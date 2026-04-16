import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const CreateRecord = () => {
  const [formData, setFormData] = useState({
    amount: "",
    type: "INCOME",
    category: "",
    date: "",
    notes: "",
    viewer_Id: ""
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
       const payload = {
            ...formData,
            amount: Number(formData.amount),
            viewer_Id: Number(formData.viewer_Id)
        };
       const res = await axios.post(
        "https://finance-data-access-api.onrender.com/user_records/create",
        payload,
        { withCredentials: true }
      );

      setIsError(false);
      setMessage(res.data.message || "Record created successfully");

      setFormData({
        amount: "",
        type: "INCOME",
        category: "",
        date: "",
        notes: "",
        viewer_Id: ""
      });

    } catch (err) {
      console.error(err);
      setIsError(true);

      if (err.response) {
        setMessage(err.response.data.message || "Error creating record");
      } else {
        setMessage("Server not reachable");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-bold text-center mb-4 text-green-600">
          Create Record (Admin)
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <input
            type="number"
            name="viewer_Id"
            placeholder="User ID (viewer_Id)"
            value={formData.viewer_Id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <textarea
            name="notes"
            placeholder="Notes (optional)"
            value={formData.notes}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Create Record
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
        <Link to="/home">
            <button className="mt-3 text-blue-500 underline"> 
                Home                 
            </button>
        </Link>
      </div>
    </div>
  );
};

export default CreateRecord;