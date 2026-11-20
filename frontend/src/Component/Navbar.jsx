import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    // useLocation makes the navbar re-check login status after every page change
    useLocation();
    const token = localStorage.getItem("token");

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo">
                Todo<span>Mate</span>
            </Link>

            <div className="navbar-links">
                <Link to="/">Home</Link>

                {token ? (
                    <Link to="/dashboard">Dashboard</Link>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
