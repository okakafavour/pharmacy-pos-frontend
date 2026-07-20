import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import Header from "../components/Header";

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(
    window.innerWidth > 768
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );
  }, []);

  return (
    <div className="layout">

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="main-content">

        <Header
          setSidebarOpen={setSidebarOpen}
        />

        <div className="page-content">
          <Outlet />
        </div>

      </div>

    </div>
  );
}

export default DashboardLayout;