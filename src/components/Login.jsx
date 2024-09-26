import React, { useState } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import '../style/Login.css'

const Login = ({ setToken, setUserId, csrfToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const message = location.state?.message;

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "https://chatify-api.up.railway.app/auth/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
            csrfToken,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const token = data.token;
      const decoded = decodeToken(token);

      // Store user details in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", decoded.id);
      localStorage.setItem("username", decoded.user);
      localStorage.setItem("avatar", decoded.avatar);
      localStorage.setItem("email", decoded.email);

      setToken(token);
      setUserId(decoded.id);
      setError("");

      navigate("/profile");
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message);
    }
  };

  const decodeToken = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Token decoding failed", e);
      return {};
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Login</h1>
        {message && <p className="login-message success">{message}</p>}
        {error && <p className="login-message error">{error}</p>}
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

export default Login;