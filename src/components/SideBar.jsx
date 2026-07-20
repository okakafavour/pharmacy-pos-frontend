import { Link, useLocation } from "react-router-dom";
import "../styles/sidebar.css";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();

  const role = localStorage.getItem("role");

  let menuItems = [];

  if (role === "admin") {
    menuItems = [
      { name: "Dashboard", path: "/dashboard", icon: "📊" },
      { name: "Medicines", path: "/medicines", icon: "💊" },
      { name: "Customers", path: "/customers", icon: "👥" },
      { name: "Sales", path: "/sales", icon: "🛒" },
      { name: "Suppliers", path: "/suppliers", icon: "🚚" },
      { name: "Restocks", path: "/restocks", icon: "📦" },
      { name: "Reports", path: "/reports", icon: "📈" },
      { name: "Users", path: "/users", icon: "⚙️" },
    ];
  }

  if (role === "cashier") {
    menuItems = [
      { name: "Dashboard", path: "/dashboard", icon: "📊" },
      { name: "Customers", path: "/customers", icon: "👥" },
      { name: "Sales", path: "/sales", icon: "🛒" },
    ];
  }

  if (role === "pharmacist") {
    menuItems = [
      { name: "Dashboard", path: "/dashboard", icon: "📊" },
      { name: "Medicines", path: "/medicines", icon: "💊" },
      { name: "Restocks", path: "/restocks", icon: "📦" },
    ];
  }

  if (role === "manager") {
    menuItems = [
      { name: "Dashboard", path: "/dashboard", icon: "📊" },
      { name: "Suppliers", path: "/suppliers", icon: "🚚" },
      { name: "Restocks", path: "/restocks", icon: "📦" },
      { name: "Reports", path: "/reports", icon: "📈" },
    ];
  }

  return (
    <>
      {/* Dark Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`sidebar ${sidebarOpen ? "open" : ""}`}
      >
        <div className="sidebar-logo">
          <h2>💊 Mdawa</h2>
          <span>Pharmacy System</span>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={
                location.pathname === item.path
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
              onClick={() => setSidebarOpen(false)}
            >
              <span>{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        <div
          style={{
            marginTop: "auto",
            padding: "20px",
            borderTop: "1px solid rgba(255,255,255,.1)",
          }}
        >
          <small
            style={{
              display: "block",
              color: "#94a3b8",
            }}
          >
            Logged in as
          </small>

          <strong>
            {localStorage.getItem("name")}
          </strong>

          <div
            style={{
              color: "#22c55e",
              textTransform: "capitalize",
              marginTop: 6,
            }}
          >
            {role}
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;