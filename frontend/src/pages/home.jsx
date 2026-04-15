import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [data, setData] = useState(null);
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(
          "https://finance-data-access-api.onrender.com/dashboard",
          { withCredentials: true }
        );

        setData(res.data);
        setRole(res.data.role);
      } catch (err) {
        console.error(err);
        setError("Unauthorized or session expired");
      }
    };

    fetchDashboard();
  }, []);

  if (error) {
    return <p className="text-red-500 text-center mt-10">{error}</p>;
  }

  if (!data) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Dashboard</h1>

      {/* Common for all roles */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-100 p-4 rounded">
          <h3>Total Income</h3>
          <p>{data.totalIncome}</p>
        </div>

        <div className="bg-red-100 p-4 rounded">
          <h3>Total Expense</h3>
          <p>{data.totalExpenses}</p>
        </div>

        <div className="bg-blue-100 p-4 rounded">
          <h3>Net Balance</h3>
          <p>{data.netBalance}</p>
        </div>
      </div>

      {/* Recent Records */}
      <div>
        <h2 className="text-xl font-semibold">Recent Records</h2>
        <ul className="list-disc ml-5">
          {data.recentRecords.map((rec) => (
            <li key={rec.id}>
              {rec.category} - {rec.amount}
            </li>
          ))}
        </ul>
      </div>

      {/* ANALYST + ADMIN */}
      {(role === "ANALYST" || role === "ADMIN") && (
        <div>
          <h2 className="text-xl font-semibold">Analytics</h2>

          <p>Monthly Trends: {JSON.stringify(data.monthlyTrends)}</p>
          <p>Weekly Trends: {JSON.stringify(data.weeklyTrends)}</p>
          <p>Profit/Loss: {JSON.stringify(data.monthlyProfitLoss)}</p>
        </div>
      )}

      {/* ADMIN ONLY */}
      {role === "ADMIN" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-red-600">Admin Panel</h2>

          <div className="flex gap-4">
            <button className="bg-green-500 text-white px-4 py-2 rounded">
              Add Record
            </button>

            <button className="bg-red-500 text-white px-4 py-2 rounded">
              Delete Record
            </button>

            <button className="bg-purple-500 text-white px-4 py-2 rounded">
              Manage Users
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;