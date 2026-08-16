import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";
import "./MainLayout.css";
import { useSidebar } from "../context/SidebarContext";

const MainLayout = () => {
  const { isSidebarOpen, closeSidebar } = useSidebar();
  return (
    <div className="layout">
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      <Sidebar />

      <div className="main-content">
        <Navbar />

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
