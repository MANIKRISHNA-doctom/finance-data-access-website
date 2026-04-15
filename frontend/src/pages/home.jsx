import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(
        "https://finance-data-access-api.onrender.com/user_dashboard",
        { withCredentials: true }
      );

      setData(res.data);
    } catch (err) {
      console.error(err);
      if (error.response) {
        // Handle specific status codes (optional)
        if (error.response.status === 404) {
          setError("Resource not found");
        } else if (error.response.status === 500) {
          setError("Server error");
        } else {
          setError(error.response.data.message || "Something went wrong");
        }
      } else {
        setError("Error: " + error.message);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await axios.delete(
        "https://finance-data-access-api.onrender.com/user/logout",
        { withCredentials: true }
      );
      window.location.href = "/"; // redirect to login
    } catch (err) {
      console.error(err);
    }
  };

  if (error) {
    return <h2 className="text-red-500 text-center mt-10">{error}</h2>;
  }

  if (!data) {
    return <h2 className="text-center mt-10">Loading...</h2>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded">
          <h3>Total Income</h3>
          <p className="text-lg font-bold">₹{data.totalIncome}</p>
        </div>

        <div className="bg-red-100 p-4 rounded">
          <h3>Total Expenses</h3>
          <p className="text-lg font-bold">₹{data.totalExpenses}</p>
        </div>

        <div className="bg-blue-100 p-4 rounded">
          <h3>Net Balance</h3>
          <p className="text-lg font-bold">₹{data.netBalance}</p>
        </div>
      </div>

      {/* Recent Records */}
      <h2 className="text-xl mb-2">Recent Records</h2>
      <ul className="bg-white shadow rounded p-4">
        {data.recentRecords.map((rec) => (
          <li key={rec.id} className="border-b py-2">
            {rec.category} - ₹{rec.amount} ({rec.type})
          </li>
        ))}
      </ul>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mt-6 bg-black text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Home;