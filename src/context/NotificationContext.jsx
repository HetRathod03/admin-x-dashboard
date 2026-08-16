import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

import {
  faBoxOpen,
  faUserPlus,
  faCartShopping,
  faTrash,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();

  const getNotificationsKey = () =>
    user?.id ? `notifications_${user.id}` : "notifications_default";

  const getEnabledKey = () =>
    user?.id
      ? `notificationsEnabled_${user.id}`
      : "notificationsEnabled_default";

  const [notifications, setNotifications] = useState(() => {
    const key = user?.id ? `notifications_${user.id}` : "notifications_default";

    const saved = localStorage.getItem(key);

    return saved ? JSON.parse(saved) : [];
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const key = user?.id
      ? `notificationsEnabled_${user.id}`
      : "notificationsEnabled_default";

    const saved = localStorage.getItem(key);

    return saved ? JSON.parse(saved) : true;
  });

  /* ================= USER CHANGE ================= */

  useEffect(() => {
    const notificationsKey = getNotificationsKey();
    const enabledKey = getEnabledKey();

    const savedNotifications = localStorage.getItem(notificationsKey);

    const savedEnabled = localStorage.getItem(enabledKey);

    setNotifications(savedNotifications ? JSON.parse(savedNotifications) : []);

    setNotificationsEnabled(savedEnabled ? JSON.parse(savedEnabled) : true);
  }, [user?.id]);

  /* ================= SAVE NOTIFICATIONS ================= */

  useEffect(() => {
    const key = getNotificationsKey();

    localStorage.setItem(key, JSON.stringify(notifications));
  }, [notifications, user?.id]);

  /* ================= SAVE ENABLED ================= */

  useEffect(() => {
    const key = getEnabledKey();

    localStorage.setItem(key, JSON.stringify(notificationsEnabled));
  }, [notificationsEnabled, user?.id]);

  /* ================= TOGGLE ================= */

  const toggleNotifications = () => {
    setNotificationsEnabled((prev) => !prev);
  };

  /* ================= CLEAR ================= */

  const clearNotifications = () => {
    setNotifications([]);
  };

  /* ================= REMOVE ================= */

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  /* ================= ADD ================= */

  const addNotification = (type, title, description) => {
    if (!notificationsEnabled) return;

    let icon = faCircleCheck;

    switch (type) {
      case "product":
        icon = faBoxOpen;
        break;

      case "customer":
        icon = faUserPlus;
        break;

      case "order":
        icon = faCartShopping;
        break;

      case "delete":
        icon = faTrash;
        break;

      default:
        icon = faCircleCheck;
    }

    const newNotification = {
      id: Date.now(),
      icon,
      title,
      description,
      time: "Just now",
    };

    setNotifications((prev) => [newNotification, ...prev]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        clearNotifications,
        removeNotification,
        notificationsEnabled,
        toggleNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
