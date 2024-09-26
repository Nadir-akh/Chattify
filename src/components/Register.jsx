import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import '../style/Register.css';

const Register = ({ csrfToken }) => {
  const [user, setUser] = useState({ username: "", password: "", email: "" });
  const [errMsg, setErrMsg] = useState("");
  const goToLogin = useNavigate();

  const submitRegistration = (e) => {
    e.preventDefault();
    const reqBody = { ...user, csrfToken };

    fetch("https://chatify-api.up.railway.app/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody),
    })
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Username or email already exists");

        localStorage.setItem("username", user.username);
        localStorage.setItem("email", user.email);
        goToLogin("/login", { state: { message: "Registration successful" } });
      })
      .catch((err) => setErrMsg(err.message));
  };

  const handleInputChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  return (
    <div className="register-container">
      <div className="register-box">
        <h1 className="register-title">Create Account</h1>
        {errMsg && <p className="error-message">{errMsg}</p>}
        <p className="login-redirect">
          Already registered?{" "}
          <NavLink to="/login" className="login-link">
            Login here
          </NavLink>
        </p>
        <form onSubmit={submitRegistration} className="register-form">
          {["Username", "Password", "Email"].map((field, idx) => (
            <div className="form-group" key={idx}>
              <input
                type={field.toLowerCase()}
                name={field.toLowerCase()}
                placeholder={field}
                value={user[field.toLowerCase()]}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>
          ))}
          <button type="submit" className="submit-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
