import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AuthDashboard.css";

function Signup() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSignup(event) {
        event.preventDefault();

        setMessage("");
        setLoading(true);

        try {
            const response = await fetch(
                "http://127.0.0.1:5000/api/auth/signup",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Signup failed");
                return;
            }

            setMessage("Account created successfully!");

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (error) {
            setMessage("Cannot connect to backend. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="auth-page">
            <div className="auth-card">
                <h1>Sign Up</h1>
                <p>Create a free account to start adding tasks.</p>

                <form onSubmit={handleSignup}>
                    <label htmlFor="name">Full name</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Enter your name"
                        required
                    />

                    <label htmlFor="email">Email address</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Enter your email"
                        required
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Create a password"
                        minLength={6}
                        required
                    />

                    {message && (
                        <p
                            className={
                                message.includes("successfully")
                                    ? "form-message success"
                                    : "form-message"
                            }
                        >
                            {message}
                        </p>
                    )}

                    <button type="submit" disabled={loading}>
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                <p>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </main>
    );
}

export default Signup;
