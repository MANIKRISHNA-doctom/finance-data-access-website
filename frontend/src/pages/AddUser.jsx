import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "VIEWER",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://finance-data-access-api.onrender.com/user/create",
        formData,
        { withCredentials: true }
      );

      setMessage("User created successfully ✅");
      setIsError(false);

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "VIEWER",
      });
    } catch (err) {
      console.error(err);
      setIsError(true);

      if (err.response) {
        setMessage(err.response.data.message || "Something went wrong");
      } else {
        setMessage("Server not reachable");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-80 space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Add User</h2>

        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="VIEWER">Viewer</option>
          <option value="ANALYST">Analyst</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button className="bg-green-500 text-white w-full py-2 rounded hover:bg-green-600">
          Create User
        </button>

        {/* Message */}
        {message && (
          <p
            className={`text-center ${
              isError ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}

        {/* Home Button */}
        <Link to="/home">
          <button
            type="button"
            className="w-full mt-2 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
          >
            Go to Home
          </button>
        </Link>
      </form>
    </div>
  );
};

export default AddUser;