import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }

      const data = await response.json();
      console.log("Login response data:", data); // Log the full response

      // Assuming data.user contains the relevant fields
      localStorage.setItem("role", data.user.role); // Accessing nested role
      localStorage.setItem("token", data.token); // Storing the token
        console.log("token from backend "+data.token);
        
      const role = localStorage.getItem("role"); // Get role from localStorage

      if (role === "admin") {
        navigate("/adminview");
      } else if (role === "user") {
        navigate("/userview");
      } else {
        console.error("Invalid role detected:", role);
        throw new Error("Invalid user role.");
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
