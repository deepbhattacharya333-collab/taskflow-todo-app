import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
    // Sample tasks only for the preview card (not saved anywhere)
    const sampleTasks = [
        { title: "Finish DBMS assignment", done: true },
        { title: "Revise React notes", done: true },
        { title: "Go for a walk", done: false },
        { title: "Prepare for lab viva", done: false }
    ];

    return (
        <main>
            {/* Top section */}
            <section className="home-hero">
                <div className="home-hero-inner">
                    <div className="home-text">
                        <h1>
                            Plan your day with <span>TodoMate</span>
                        </h1>

                        <p>
                            Write your tasks, tick them when they are done
                            and see your progress. Simple and easy to use.
                        </p>

                        <div className="home-buttons">
                            <Link to="/signup" className="home-primary">
                                Get Started
                            </Link>
                            <Link to="/login" className="home-secondary">
                                Login
                            </Link>
                        </div>
                    </div>

                    <div className="home-card">
                        <h3>Today's Tasks</h3>

                        {sampleTasks.map((task) => (
                            <div className="home-card-task" key={task.title}>
                                <input
                                    type="checkbox"
                                    checked={task.done}
                                    readOnly
                                />
                                <span className={task.done ? "done" : ""}>
                                    {task.title}
                                </span>
                            </div>
                        ))}

                        <div className="home-card-progress">
                            <div className="home-card-bar">
                                <div className="home-card-fill"></div>
                            </div>
                            <small>2 of 4 tasks completed</small>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="home-features">
                <h2>Why TodoMate?</h2>

                <div className="features-list">
                    <div className="feature-box">
                        <div className="feature-icon">✅</div>
                        <h3>Easy to use</h3>
                        <p>Add a task in one click. No confusing options.</p>
                    </div>

                    <div className="feature-box">
                        <div className="feature-icon">📊</div>
                        <h3>See progress</h3>
                        <p>A progress bar shows how much work is complete.</p>
                    </div>

                    <div className="feature-box">
                        <div className="feature-icon">🔒</div>
                        <h3>Your own account</h3>
                        <p>Login to see only your tasks, saved safely.</p>
                    </div>
                </div>
            </section>

            <footer className="home-footer">
                © 2026 TodoMate. Made as a college project.
            </footer>
        </main>
    );
}

export default Home;
