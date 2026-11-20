import { Routes, Route } from "react-router-dom";

import Navbar from "./Component/Navbar.jsx";
import ProtectedRoute from "./Component/ProtectedRoute.jsx";

import Home from "./Pages/Home.jsx";
import Login from "./Pages/Login.jsx";
import Signup from "./Pages/signup.jsx";
import Dashboard from "./Pages/Dashboard.jsx";

function App() {
    return (
        <>
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/login" element={<Login />} />

                <Route path="/signup" element={<Signup />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </>
    );
}

export default App;