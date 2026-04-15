import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "VIEWER",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "https://finance-data-access-api.onrender.com/user/create",
        formData,
        { withCredentials: true }
      );

      setMessage("User created successfully");
      setIsError(false); 

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "VIEWER",
      });

    } catch (error) {
      console.error(error);

      if (error.response) {
        // Handle specific status codes (optional)
        if (error.response.status === 404) {
          setMessage("Resource not found");
        } else if (error.response.status === 500) {
          setMessage("Server error");
        } else {
          setMessage(error.response.data.message || "Something went wrong");
        }
      } else {
        setMessage("Error: " + error.message);
      }

      setIsError(true); // ❌ error → red
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-80"
      >
        <h2 className="text-2xl font-semibold text-center mb-5">Sign Up</h2>

        <input
          type="text"
          name="name"
          placeholder="Enter Username"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 mb-3 border rounded-md outline-none focus:border-blue-500"
        />

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 mb-3 border rounded-md outline-none focus:border-blue-500"
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-2 mb-3 border rounded-md outline-none focus:border-blue-500"
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded-md"
        >
          <option value="VIEWER">Viewer</option>
          <option value="ADMIN">Admin</option>
          <option value="ANALYST">Analyst</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Register
        </button>

        {/* ✅ Message */}
        {message && (
          <p
            className={`text-center mt-3 text-sm ${
              isError ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        <p className="text-center mt-4 text-sm">
          Already have an account?
          <Link to="/" className="text-blue-500 ml-1 hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;