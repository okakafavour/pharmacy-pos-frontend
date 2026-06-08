import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const API =
    "https://pharmacy-pos-backend-some.onrender.com";

  const [stats, setStats] = useState({
    total_medicines: 0,
    total_sales: 0,
    low_stock_count: 0,
    expired_count: 0,
    total_suppliers: 0,
  });

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API}/dashboard/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <>
      <h1 className="dashboard-title">
        Dashboard
      </h1>

      <div className="stats-grid">

        <div className="stat-card">
          <h3>Total Medicines</h3>
          <p>{stats.total_medicines}</p>
        </div>

        <div className="stat-card">
          <h3>Total Sales</h3>
          <p>
            ₦
            {Number(
              stats.total_sales || 0
            ).toLocaleString()}
          </p>
        </div>

        <div className="stat-card">
          <h3>Low Stock</h3>
          <p>{stats.low_stock_count}</p>
        </div>

        <div className="stat-card">
          <h3>Expired Medicines</h3>
          <p>{stats.expired_count}</p>
        </div>

        <div className="stat-card">
          <h3>Suppliers</h3>
          <p>{stats.total_suppliers}</p>
        </div>

      </div>
    </>
  );
}

export default Dashboard;