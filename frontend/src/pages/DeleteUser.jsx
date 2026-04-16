import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const DeleteUser = () => {
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();

    if (!userId) {
      setMessage("Please enter user ID");
      setIsError(true);
      return;
    }

    try {
      const res = await axios.delete(
        `https://finance-data-access-api.onrender.com/user/soft_delete/${userId}`,
        { withCredentials: true }
      );

      setMessage(res.data.message);
      setIsError(false);
      setUserId("");
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
        onSubmit={handleDelete}
        className="bg-white p-6 rounded shadow w-80 space-y-4"
      >
        <h2 className="text-xl font-bold text-center text-red-600">
          Delete User
        </h2>

        <input
          type="number"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <button className="bg-red-500 text-white w-full py-2 rounded hover:bg-red-600">
          Delete User
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

export default DeleteUser;