import { createContext, useContext, useEffect, useState } from "react";

import {
  faBoxOpen,
  faUserPlus,
  faCartShopping,
  faTrash,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

const ActivityContext = createContext();

export const ActivityProvider = ({ children }) => {
  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem("activities");

    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("activities", JSON.stringify(activities));
  }, [activities]);

  const addActivity = (type, title, description) => {
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

    const activity = {
      id: Date.now(),

      icon,

      title,

      description,

      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setActivities((prev) => [activity, ...prev]);
  };

  const clearActivities = () => {
    setActivities([]);
  };

  return (
    <ActivityContext.Provider
      value={{
        activities,
        addActivity,
        clearActivities,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => useContext(ActivityContext);
