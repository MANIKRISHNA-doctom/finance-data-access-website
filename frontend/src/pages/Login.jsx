import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate(); // 🔥 for redirect

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!email || !password) {
      setMessage("Please enter both email and password.");
      setIsError(true);
      return;
    }

    try {
      const response = await axios.post(
        "https://finance-data-access-api.onrender.com/user/user_ver",
        { email, password },
        { withCredentials: true }
      );

      console.log("Login success:", response.data);

      setIsError(false);
      setMessage("Login successful!");

      // ✅ Redirect to home page
      setTimeout(() => {
        navigate("/home"); // 🔁 change route if needed
      }, 1000);

    } catch (error) {
      console.error("Login error:", error);

      setIsError(true);

      if (error.response) {
        if (error.response.status === 401) {
          setMessage("Invalid email or password");
        } else if (error.response.status === 404) {
          setMessage("User not found");
        } else if (error.response.status === 500) {
          setMessage("Server error");
        } else {
          setMessage(error.response.data.message || "Something went wrong");
        }
      } else {
        setMessage("Error: " + error.message);
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-80 text-center"
      >
        <h2 className="text-2xl font-semibold mb-5">Login</h2>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 border rounded-md outline-none focus:border-blue-500"
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-3 border rounded-md outline-none focus:border-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Login
        </button>

        {/* ✅ Message */}
        {message && (
          <p
            className={`mt-3 text-sm ${
              isError ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        <p className="mt-4 text-sm">
          Don't have an account?
          <Link to="/sign_up" className="text-blue-500 ml-1 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;