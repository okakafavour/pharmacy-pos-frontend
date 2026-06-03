function Dashboard() {
  return (
    <>
      <h1 className="dashboard-title">
        Dashboard
      </h1>

      <div className="stats-grid">

        <div className="stat-card">
          <h3>Total Medicines</h3>
          <p>1,254</p>
        </div>

        <div className="stat-card">
          <h3>Customers</h3>
          <p>856</p>
        </div>

        <div className="stat-card">
          <h3>Sales Today</h3>
          <p>₦120,000</p>
        </div>

        <div className="stat-card">
          <h3>Low Stock</h3>
          <p>12</p>
        </div>

      </div>
    </>
  );
}

export default Dashboard;