import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Todo from "../models/Todo.js";

const router = express.Router();

// Verify login token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Please login first"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, "taskflow_secret_key");

        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

// CREATE TODO
router.post("/", verifyToken, async (req, res) => {
    try {
        const { title } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Task title is required"
            });
        }

        const newTodo = new Todo({
            title: title.trim(),
            user: req.userId
        });

        await newTodo.save();

        res.status(201).json({
            message: "Task created successfully",
            todo: newTodo
        });
    } catch (error) {
        console.log("Create todo error:", error.message);

        res.status(500).json({
            message: "Failed to create task"
        });
    }
});

// READ ALL TODOS
router.get("/", verifyToken, async (req, res) => {
    try {
        const todos = await Todo.find({
            user: req.userId
        }).sort({ createdAt: -1 });

        res.status(200).json(todos);
    } catch (error) {
        console.log("Get todos error:", error.message);

        res.status(500).json({
            message: "Failed to get tasks"
        });
    }
});

// UPDATE TODO
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid task ID"
            });
        }

        const updatedTodo = await Todo.findOneAndUpdate(
            {
                _id: id,
                user: req.userId
            },
            {
                ...(title !== undefined && { title }),
                ...(completed !== undefined && { completed })
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedTodo) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task updated successfully",
            todo: updatedTodo
        });
    } catch (error) {
        console.log("Update todo error:", error.message);

        res.status(500).json({
            message: "Failed to update task"
        });
    }
});

// DELETE TODO
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid task ID"
            });
        }

        const deletedTodo = await Todo.findOneAndDelete({
            _id: id,
            user: req.userId
        });

        if (!deletedTodo) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task deleted successfully"
        });
    } catch (error) {
        console.log("Delete todo error:", error.message);

        res.status(500).json({
            message: "Failed to delete task"
        });
    }
});

export default router;