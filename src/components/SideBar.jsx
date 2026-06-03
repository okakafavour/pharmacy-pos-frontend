import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Medicines", path: "/medicines", icon: "💊" },
    { name: "Customers", path: "/customers", icon: "👥" },
    { name: "Sales", path: "/sales", icon: "🛒" },
    { name: "Suppliers", path: "/suppliers", icon: "🚚" },
    { name: "Reports", path: "/reports", icon: "📈" },
    { name: "Users", path: "/users", icon: "⚙️" },
  ];

  return (
    <div className="sidebar">
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
          >
            <span>{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;