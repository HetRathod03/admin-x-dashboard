import { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSidebar } from "../../context/SidebarContext";
import { useNotification } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";
import { useSearch } from "../../context/SearchContext";

import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  faBars,
  faBell,
  faMagnifyingGlass,
  faUser,
  faGear,
  faRightFromBracket,
  faChevronDown,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const { toggleSidebar } = useSidebar();

  const { notifications, notificationsEnabled, clearNotifications } =
    useNotification();

  const { user, logout } = useAuth();

  const { search, setSearch } = useSearch();

  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);

  const menuRef = useRef(null);

  const [showNotifications, setShowNotifications] = useState(false);

  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();

    toast.success("Logged Out Successfully");

    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="menu-btn" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} />
        </button>

        <div className="search-box">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="navbar-right">
        <ThemeToggle />

        <div className="notification-wrapper" ref={notificationRef}>
          <button
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FontAwesomeIcon icon={faBell} />

            {notificationsEnabled && notifications.length > 0 && (
              <span className="notification-dot"></span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h4>Notifications</h4>

                <button
                  className="clear-notification-btn"
                  onClick={clearNotifications}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>

              {notifications.length === 0 ? (
                <p className="empty-notification">No Notifications</p>
              ) : (
                notifications.slice(0, 5).map((item) => (
                  <div className="notification-item" key={item.id}>
                    <FontAwesomeIcon icon={item.icon} />

                    <div className="notification-content">
                      <h5>{item.title}</h5>
                      <p>{item.description}</p>
                      <span>{item.time}</span>
                    </div>
                  </div>
                ))
              )}

              <div className="notification-footer">
                <Link
                  to="/notifications"
                  onClick={() => setShowNotifications(false)}
                >
                  View All Notifications →
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="profile" ref={menuRef}>
          <div
            className="profile-header"
            onClick={() => setShowMenu(!showMenu)}
          >
            <div className="navbar-avatar">
              {user?.image ? (
                <img
                  src={user.image}
                  alt="Profile"
                  className="navbar-profile-image"
                />
              ) : (
                user?.firstName?.charAt(0)
              )}
            </div>

            <div className="profile-info">
              <h4>
                {user?.firstName} {user?.lastName}
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`dropdown-arrow ${showMenu ? "rotate" : ""}`}
                />
              </h4>

              <p>{user?.role || "Admin"}</p>
            </div>
          </div>

          {showMenu && (
            <div className="profile-dropdown">
              <Link to="/profile" onClick={() => setShowMenu(false)}>
                <FontAwesomeIcon icon={faUser} />
                <span>My Profile</span>
              </Link>

              <Link to="/settings" onClick={() => setShowMenu(false)}>
                <FontAwesomeIcon icon={faGear} />
                <span>Settings</span>
              </Link>

              <button onClick={handleLogout}>
                <FontAwesomeIcon icon={faRightFromBracket} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
