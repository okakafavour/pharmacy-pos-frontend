import { useEffect, useState } from "react";
import axios from "axios";

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
            Reports
          </h1>

          <p className="page-subtitle">
            Pharmacy performance overview
          </p>
        </div>
      </div>

      <div className="reports-grid">

        <div className="report-card">
          <h3>Total Revenue</h3>

          <p>
            ₦
            {Number(
              stats?.total_sales || 0
            ).toLocaleString()}
          </p>
        </div>

        <div className="report-card">
          <h3>Total Medicines</h3>

          <p>
            {stats?.total_medicines || 0}
          </p>
        </div>

        <div className="report-card">
          <h3>Total Suppliers</h3>

          <p>
            {stats?.total_suppliers || 0}
          </p>
        </div>

        <div className="report-card warning">
          <h3>Low Stock</h3>

          <p>
            {stats?.low_stock_count || 0}
          </p>
        </div>

        <div className="report-card danger">
          <h3>Expired Medicines</h3>

          <p>
            {stats?.expired_count || 0}
          </p>
        </div>

      </div>

      <div className="table-card">
        <h2 className="report-section-title">
          Daily Sales Summary
        </h2>

        <table className="medicine-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Total Sales</th>
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
                  {
                    dailySales.total_transactions
                  }
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan="3">
                  Loading...
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