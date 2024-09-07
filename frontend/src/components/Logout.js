import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("token"); // Remove the token
    localStorage.removeItem("userDetails"); // Remove any other details you stored
    // Add any other keys that need to be cleared

    // Redirect to login page
    navigate("/login");
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <button className="btn btn-danger" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Logout;
