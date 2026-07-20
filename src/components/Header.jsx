import "../styles/header.css";

function Header({ setSidebarOpen }) {
  const user = {
    name: localStorage.getItem("name") || "Admin",
    role: localStorage.getItem("role") || "Administrator",
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");

    window.location.href = "/";
  };

  return (
    <header className="header">

      <div className="header-left">

        <button
          className="menu-btn"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>

        <input
          type="text"
          placeholder="Search medicines..."
          className="search-box"
        />

      </div>

      <div className="header-right">

        <button className="icon-btn">
          🔔
        </button>

        <div className="user-info">

          <div className="avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div className="user-details">
            <h4>{user.name}</h4>

            <p className="user-role">
              {user.role}
            </p>
          </div>

        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </div>

    </header>
  );
}

export default Header;