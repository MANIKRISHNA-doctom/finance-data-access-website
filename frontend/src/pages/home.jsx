import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
const Home = () => {
  const [data, setData] = useState(null);
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handledelete = async ()=>{
    try {
          const res = await axios.delete(
          "https://finance-data-access-api.onrender.com/user/logout",
          { withCredentials: true }
        );
        navigate('/');
    } catch (err) {
      console.error(err);
      if(err.response){
        setError(err.response.data.message);
      }
      else{
        setError("Error while logging out");
      }
    }
  }
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(
          "https://finance-data-access-api.onrender.com/user_dashboard",
          { withCredentials: true }
        );
        setData(res.data);
        setRole(res.data.role);
      } catch (err) {
        console.error(err);
        if (err.response) {
        if (err.response.status === 401) {
          setError("Invalid email or password");
        } else if (err.response.status === 404) {
          setError("User not found");
        } else if (err.response.status === 500) {
          setError("Server error");
        } else {
          setError(err.response.data.message || "Something went wrong");
        }
      } else {
        setError("Unauthorized or session expired");
      }
    };
  }
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
      <div className="flex justify-between items-center mb-4">
  <h1 className="text-2xl font-bold">Dashboard</h1>

  <button
    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    onClick={handledelete}
  >
    Logout
  </button>
</div>

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