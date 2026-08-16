import "./Sidebar.css";
import { NavLink } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSidebar } from "../../context/SidebarContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

import {
  faHouse,
  faBoxOpen,
  faLayerGroup,
  faCartShopping,
  faUsers,
  faUser,
  faGear,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

const menuItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: faHouse,
  },
  {
    name: "Products",
    path: "/products",
    icon: faBoxOpen,
  },
  {
    name: "Categories",
    path: "/categories",
    icon: faLayerGroup,
  },
  {
    name: "Orders",
    path: "/orders",
    icon: faCartShopping,
  },
  {
    name: "Customers",
    path: "/customers",
    icon: faUsers,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: faUser,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: faGear,
  },
];

const Sidebar = () => {
  const { isSidebarOpen, closeSidebar } = useSidebar();

  const navigate = useNavigate();

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();

    closeSidebar();

    toast.success("Logged Out Successfully");

    navigate("/login");
  };
  return (
    <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <h2>AdminX</h2>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={closeSidebar}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <FontAwesomeIcon icon={item.icon} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        <FontAwesomeIcon icon={faRightFromBracket} />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
