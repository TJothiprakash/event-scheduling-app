import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "../Navbar.css";
import { FaBars, FaTimes } from "react-icons/fa"; // Importing menu and close icons

const Navbar = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // State for menu visibility

  const toggleMenu = () => {
    setIsOpen(!isOpen); // Toggle menu open/close state
  };

  const logout = () => {
    handleLogout(); // Clear user state
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav className="navbar">
      <button className="menu-button" onClick={toggleMenu}>
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />} {/* Toggle icon */}
      </button>

      <div className={`nav-menu ${isOpen ? "open" : ""}`}>
        <ul className="nav-list">
          <li>
            <Link to="/" onClick={toggleMenu}>Home</Link>
          </li>
          {user ? (
            <>
              <li>
                <button className="nav-button" onClick={() => { logout(); toggleMenu(); }}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" onClick={toggleMenu}>Login</Link>
              </li>
              <li>
                <Link to="/register" onClick={toggleMenu}>Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
