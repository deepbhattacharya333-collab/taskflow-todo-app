
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthDashboard.css";

const API_URL = "http://127.0.0.1:5000/api/todos";

function Dashboard() {
    const navigate = useNavigate();

    const [taskTitle, setTaskTitle] = useState("");
    const [tasks, setTasks] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [filter, setFilter] = useState("all"); // all, pending or done

    const token = localStorage.getItem("token");

    // Get the logged in user's name (saved during login)
    let userName = "";
    try {
        const savedUser = JSON.parse(localStorage.getItem("loggedInUser"));
        userName = savedUser?.name || "";
    } catch {
        userName = "";
    }

    // Load tasks from backend
    useEffect(() => {
        async function fetchTasks() {
            if (!token) {
                navigate("/login");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(API_URL, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    setMessage(data.message || "Failed to load tasks");

                    if (response.status === 401) {
                        localStorage.removeItem("token");
                        localStorage.removeItem("loggedInUser");
                        navigate("/login");
                    }

                    return;
                }

                setTasks(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Fetch tasks error:", error);
                setMessage("Cannot connect to backend. Please check the server.");
            } finally {
                setLoading(false);
            }
        }

        fetchTasks();
    }, [token, navigate]);

    // Add task
    async function addTask(event) {
        event.preventDefault();

        const title = taskTitle.trim();

        if (!title) {
            setMessage("Please enter a task.");
            return;
        }

        setMessage("");
        setSaving(true);

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title }),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to add task");
                return;
            }

            setTasks((currentTasks) => [data.todo, ...currentTasks]);
            setTaskTitle("");
        } catch (error) {
            console.error("Add task error:", error);
            setMessage("Cannot connect to backend.");
        } finally {
            setSaving(false);
        }
    }

    // Toggle task completion
    async function toggleTask(task) {
        setMessage("");

        try {
            const response = await fetch(`${API_URL}/${task._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    completed: !task.completed,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to update task");
                return;
            }

            setTasks((currentTasks) =>
                currentTasks.map((currentTask) =>
                    currentTask._id === task._id ? data.todo : currentTask
                )
            );
        } catch (error) {
            console.error("Update task error:", error);
            setMessage("Cannot connect to backend.");
        }
    }

    // Delete task
    async function deleteTask(taskId) {
        setMessage("");

        try {
            const response = await fetch(`${API_URL}/${taskId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to delete task");
                return;
            }

            setTasks((currentTasks) =>
                currentTasks.filter((task) => task._id !== taskId)
            );
        } catch (error) {
            console.error("Delete task error:", error);
            setMessage("Cannot connect to backend.");
        }
    }

    // Logout
    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("loggedInUser");
        navigate("/login");
    }

    const completedTasks = tasks.filter((task) => task.completed).length;
    const remainingTasks = tasks.length - completedTasks;

    // Progress in percentage
    const percent =
        tasks.length === 0
            ? 0
            : Math.round((completedTasks / tasks.length) * 100);

    // Tasks to show according to the selected filter
    const visibleTasks = tasks.filter((task) => {
        if (filter === "done") return task.completed;
        if (filter === "pending") return !task.completed;
        return true;
    });

    return (
        <main className="dashboard-page">
            <header className="dashboard-header">
                <div>
                    <h1>My Dashboard</h1>
                    <p>Welcome{userName ? `, ${userName}` : ""}! Keep track of what you need to get done.</p>
                </div>

                <button type="button" onClick={logout}>
                    Logout
                </button>
            </header>

            <section className="dashboard-summary">
                <div>
                    <h3>Total Tasks</h3>
                    <p>{tasks.length}</p>
                </div>

                <div>
                    <h3>Completed</h3>
                    <p>{completedTasks}</p>
                </div>

                <div>
                    <h3>Remaining</h3>
                    <p>{remainingTasks}</p>
                </div>
            </section>

            <section className="progress-box">
                <div className="progress-text">
                    <span>Your progress</span>
                    <span>{percent}%</span>
                </div>

                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${percent}%` }}
                    ></div>
                </div>
            </section>

            <section className="dashboard-tasks">
                <h2>My Tasks</h2>

                <form onSubmit={addTask}>
                    <input
                        type="text"
                        value={taskTitle}
                        onChange={(event) => setTaskTitle(event.target.value)}
                        placeholder="What do you need to do?"
                        required
                    />

                    <button type="submit" disabled={saving}>
                        {saving ? "Adding..." : "Add Task"}
                    </button>
                </form>

                {message && <p className="dashboard-message">{message}</p>}

                <div className="filter-buttons">
                    {["all", "pending", "done"].map((name) => (
                        <button
                            type="button"
                            key={name}
                            className={filter === name ? "active" : ""}
                            onClick={() => setFilter(name)}
                        >
                            {name.charAt(0).toUpperCase() + name.slice(1)}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <p>Loading tasks...</p>
                ) : tasks.length === 0 ? (
                    <p>No tasks yet. Add your first task above.</p>
                ) : visibleTasks.length === 0 ? (
                    <p>No tasks in this list.</p>
                ) : (
                    <div className="task-list">
                        {visibleTasks.map((task) => (
                            <div className="task-item" key={task._id}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={Boolean(task.completed)}
                                        onChange={() => toggleTask(task)}
                                    />

                                    <span
                                        className={
                                            task.completed ? "completed-task" : ""
                                        }
                                    >
                                        {task.title}
                                    </span>
                                </label>

                                <button
                                    type="button"
                                    onClick={() => deleteTask(task._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default Dashboard;