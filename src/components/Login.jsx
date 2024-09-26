import React, { useState } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import '../style/Login.css';

const Login = ({ setToken, setUserId, csrfToken }) => {
  // State for username, password, and error message
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Get message from location state
  const message = location.state?.message;

  // Handle user login
  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent default form submission

    try {
      const response = await fetch(
        "https://chatify-api.up.railway.app/auth/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Set content type to JSON
          },
          body: JSON.stringify({
            username,
            password,
            csrfToken, // Include CSRF token for security
          }),
        }
      );

      const data = await response.json(); // Parse the response data

      if (!response.ok) {
        throw new Error("Invalid credentials"); // Handle error if response is not OK
      }

      const token = data.token; // Get the token from the response
      const decoded = decodeToken(token); // Decode the token

      // Store user data in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", decoded.id);
      localStorage.setItem("username", decoded.user);
      localStorage.setItem("avatar", decoded.avatar);
      localStorage.setItem("email", decoded.email);

      setToken(token); // Update the token state
      setUserId(decoded.id); // Update the user ID state
      setError(""); // Clear error message

      navigate("/profile"); // Navigate to the profile page
    } catch (err) {
      console.error("Login failed:", err); // Log error to console
      setError(err.message); // Set error message to state
    }
  };

  // Function to decode the JWT token
  const decodeToken = (token) => {
    try {
      const base64Url = token.split(".")[1]; // Get the payload part of the token
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // Decode base64
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload); // Parse the JSON payload
    } catch (e) {
      console.error("Token decoding failed", e); // Log error to console
      return {}; // Return an empty object on error
    }
  };

  // Return JSX for the login component
  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Login</h1>
        {message && <p className="login-message success">{message}</p>} {/* Display success message */}
        {error && <p className="login-message error">{error}</p>} {/* Display error message */}
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Update username state
              required
              className="input-field"
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update password state
              required
              className="input-field"
            />
          </div>
          <button type="submit" className="submit-button">
            Login
          </button>
        </form>
        <NavLink to="/" className="register-link">
          <button className="register-button">
            Create an account
          </button>
        </NavLink>
      </div>
    </div>
  );
};

export default Login; // Exporting the Login component