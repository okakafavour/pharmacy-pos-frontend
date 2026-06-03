function Header() {
  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Admin",
    role: "Administrator",
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/";
  };

  return (
    <header className="header">
      <div className="header-left">
        <input
          type="text"
          placeholder="Search medicines, customers..."
          className="search-box"
        />
      </div>

      <div className="header-right">
        <button className="icon-btn">
          🔔
        </button>

        <div className="user-info">
          <div className="avatar">
            {user.name.charAt(0)}
          </div>

          <div>
            <h4>{user.name}</h4>
            <p>{user.role}</p>
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