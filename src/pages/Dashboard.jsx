import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();

  const API =
    "https://pharmacy-pos-backend-some.onrender.com";

  const [stats, setStats] = useState({
    total_medicines: 0,
    total_sales: 0,
    low_stock_count: 0,
    expired_count: 0,
    total_suppliers: 0,
  });

  const [lowStock, setLowStock] = useState([]);
  const [expired, setExpired] = useState([]);
  const [expiringSoon, setExpiringSoon] =
    useState([]);

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

  const fetchLowStock = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API}/medicines/low-stock`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLowStock(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchExpired = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API}/medicines/expired`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setExpired(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchExpiringSoon = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API}/medicines/expiring-soon`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setExpiringSoon(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchLowStock();
    fetchExpired();
    fetchExpiringSoon();
  }, []);

  return (
    <div className="dashboard-page">

      <h1 className="dashboard-title">
        Dashboard
      </h1>

      <div className="dashboard-actions">

        <button
          className="action-btn"
          onClick={() =>
            navigate("/medicines")
          }
        >
          💊 Add Medicine
        </button>

        <button
          className="action-btn"
          onClick={() =>
            navigate("/sales")
          }
        >
          🛒 New Sale
        </button>

        <button
          className="action-btn"
          onClick={() =>
            navigate("/restocks")
          }
        >
          📦 Restock
        </button>

        <button
          className="action-btn"
          onClick={() =>
            navigate("/suppliers")
          }
        >
          🚚 Suppliers
        </button>

      </div>

      <div className="dashboard-alerts">

        <div className="alert-card success">
          <h4>🔔 System Ready</h4>
          <p>
            Mdawa Pharmacy System is
            running successfully.
          </p>
        </div>

        {lowStock.map((medicine) => (
          <div
            key={`low-${medicine.ID}`}
            className="alert-card warning"
          >
            <h4>⚠️ Low Stock Alert</h4>

            <p>
              {medicine.name} has only{" "}
              <strong>
                {medicine.stock}
              </strong>{" "}
              units remaining.
            </p>
          </div>
        ))}

        {expired.map((medicine) => (
          <div
            key={`expired-${medicine.ID}`}
            className="alert-card danger"
          >
            <h4>⛔ Expired Medicine</h4>

            <p>
              {medicine.name} has expired
              and should be removed from
              inventory.
            </p>
          </div>
        ))}

        {expiringSoon.map((medicine) => (
          <div
            key={`soon-${medicine.ID}`}
            className="alert-card info"
          >
            <h4>📅 Expiring Soon</h4>

            <p>
              {medicine.name} expires on{" "}
              {new Date(
                medicine.expire_date
              ).toLocaleDateString()}
            </p>
          </div>
        ))}

      </div>

      <div className="stats-grid">

        <div
          className="stat-card clickable"
          onClick={() =>
            navigate("/medicines")
          }
        >
          <h3>Total Medicines</h3>
          <p>{stats.total_medicines}</p>
        </div>

        <div
          className="stat-card clickable"
          onClick={() =>
            navigate("/sales")
          }
        >
          <h3>Total Sales</h3>

          <p>
            ₦
            {Number(
              stats.total_sales || 0
            ).toLocaleString()}
          </p>
        </div>

        <div
          className="stat-card clickable"
          onClick={() =>
            navigate("/medicines")
          }
        >
          <h3>Low Stock</h3>
          <p>{stats.low_stock_count}</p>
        </div>

        <div
          className="stat-card clickable"
          onClick={() =>
            navigate("/medicines")
          }
        >
          <h3>Expired Medicines</h3>
          <p>{stats.expired_count}</p>
        </div>

        <div
          className="stat-card clickable"
          onClick={() =>
            navigate("/suppliers")
          }
        >
          <h3>Suppliers</h3>
          <p>{stats.total_suppliers}</p>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;