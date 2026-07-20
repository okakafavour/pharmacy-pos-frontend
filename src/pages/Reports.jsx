import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/reports.css";

function Reports() {
  const API =
    "https://pharmacy-pos-backend-some.onrender.com";

  const [stats, setStats] = useState(null);
  const [dailySales, setDailySales] =
    useState(null);

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

  const fetchDailySales = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API}/reports/daily-sales`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDailySales(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchDailySales();
  }, []);

  return (
  <div className="reports-page">

    <div className="page-header">
      <div>
        <h1 className="page-title">
          Reports & Analytics
        </h1>

        <p className="page-subtitle">
          Monitor pharmacy performance and sales statistics
        </p>
      </div>

      <div className="report-actions">
        <button className="secondary-btn">
          Export PDF
        </button>

        <button className="primary-btn">
          Export Excel
        </button>
      </div>
    </div>

    <div className="reports-grid">

      <div className="report-card revenue">
        <span className="report-icon">
          💰
        </span>

        <h3>Total Revenue</h3>

        <h2>
          ₦
          {Number(
            stats?.total_sales || 0
          ).toLocaleString()}
        </h2>

        <small>Overall sales generated</small>
      </div>

      <div className="report-card medicines">

        <span className="report-icon">
          💊
        </span>

        <h3>Total Medicines</h3>

        <h2>
          {stats?.total_medicines || 0}
        </h2>

        <small>Products in inventory</small>

      </div>

      <div className="report-card suppliers">

        <span className="report-icon">
          🚚
        </span>

        <h3>Total Suppliers</h3>

        <h2>
          {stats?.total_suppliers || 0}
        </h2>

        <small>Registered suppliers</small>

      </div>

      <div className="report-card warning">

        <span className="report-icon">
          ⚠️
        </span>

        <h3>Low Stock</h3>

        <h2>
          {stats?.low_stock_count || 0}
        </h2>

        <small>Need restocking</small>

      </div>

      <div className="report-card danger">

        <span className="report-icon">
          ⛔
        </span>

        <h3>Expired Medicines</h3>

        <h2>
          {stats?.expired_count || 0}
        </h2>

        <small>Remove immediately</small>

      </div>

    </div>

    <div className="table-card">

      <div className="table-header">

        <h2>
          Daily Sales Report
        </h2>

        <span className="table-badge">
          Today
        </span>

      </div>

      <table className="medicine-table">

        <thead>

          <tr>

            <th>Date</th>

            <th>Total Revenue</th>

            <th>Transactions</th>

          </tr>

        </thead>

        <tbody>

          {dailySales ? (

            <tr>

              <td>
                {dailySales.date}
              </td>

              <td>
                ₦
                {Number(
                  dailySales.total_sales
                ).toLocaleString()}
              </td>

              <td>
                {dailySales.total_transactions}
              </td>

            </tr>

          ) : (

            <tr>

              <td colSpan="3">
                Loading reports...
              </td>

            </tr>

          )}

        </tbody>

      </table>

    </div>

  </div>
);
}

export default Reports;