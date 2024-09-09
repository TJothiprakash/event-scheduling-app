import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Register.css"; // Import the CSS file here

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // Default role is set to 'User'
  });

  const [message, setMessage] = useState(""); // For displaying success/error messages
  const [isError, setIsError] = useState(false); // To differentiate between success and error

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if password and confirmPassword match
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      setIsError(true);
      return;
    }

    // Make the request to register the user
    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        setMessage(
          "Registration successful! Check your email for confirmation."
        );
        setIsError(false);

        // Clear the form after successful registration
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "User",
        });
      } else {
        setMessage(data.msg || "Registration failed.");
        setIsError(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred during registration.");
      setIsError(true);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header text-center">
              <h3>Register</h3>
            </div>
            <div className="card-body">
              {/* Display success/error message */}
              {message && (
                <div
                  className={`alert ${
                    isError ? "alert-danger" : "alert-success"
                  }`}
                  role="alert"
                >
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="username">
                    <span className="text-danger">*</span> Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">
                    <span className="text-danger">*</span> Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">
                    <span className="text-danger">*</span> Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    pattern=".{8,}" // At least 8 characters
                    title="Password must be at least 8 characters long"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    <span className="text-danger">*</span> Confirm Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="role">
                    <span className="text-danger">*</span> Role
                  </label>
                  <select
                    className="form-control"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>
                <div className="d-flex justify-content-center">
                  <button type="submit" className="btn btn-primary">
                    Register
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
