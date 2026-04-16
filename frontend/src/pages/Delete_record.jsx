import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const DeleteRecord = () => {
  const [recordId, setRecordId] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();

    if (!recordId) {
      setIsError(true);
      setMessage("Please enter Record ID");
      return;
    }

    try {
      const res = await axios.delete(
        `https://finance-data-access-api.onrender.com/user_records/soft_delete/${recordId}`,
        { withCredentials: true }
      );

      setIsError(false);
      setMessage(res.data.message || "Record deleted successfully");
      setRecordId("");
    } catch (err) {
      console.error(err);
      setIsError(true);

      if (err.response) {
        setMessage(err.response.data.message || "Error deleting record");
      } else {
        setMessage("Server not reachable");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center text-red-600">
        Delete Record (Admin)
      </h2>

      <form onSubmit={handleDelete} className="space-y-4">
        <input
          type="number"
          placeholder="Enter Record ID"
          value={recordId}
          onChange={(e) => setRecordId(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-400"
        />

        <button
          type="submit"
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Delete Record
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 text-center ${
            isError ? "text-red-500" : "text-green-500"
          }`}
        >
          {message}
        </p>
      )}
      <Link to='/home'>Home page</Link>
    </div>
  );
};

export default DeleteRecord;