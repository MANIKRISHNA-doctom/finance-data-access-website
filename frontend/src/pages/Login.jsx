import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./app.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!email || !password) {
      setMessage("Please enter both email and password.");
      return;
    }

    try {
      const response = await axios.post(
        ": https://finance-data-access-api.onrender.com/user/user_ver", // 🔁 change this URL
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Login success:", response.data);
      setMessage("Login successful!");
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>

        {message && <p className="message">{message}</p>}

        <p className="signup-text">
          <link to='/sign_up'>Sign Up</link>
        </p>
      </form>
    </div>
  );
};

export default Login;