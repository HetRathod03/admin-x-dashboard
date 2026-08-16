import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const { user } = useAuth();

  const getStorageKey = () =>
    user?.id ? `darkMode_${user.id}` : "darkMode_default";

  const [darkMode, setDarkMode] = useState(() => {
    const key = user?.id ? `darkMode_${user.id}` : "darkMode_default";
    const saved = localStorage.getItem(key);

    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    const key = getStorageKey();
    const saved = localStorage.getItem(key);

    const newDarkMode = saved ? JSON.parse(saved) : false;

    setDarkMode(newDarkMode);
  }, [user?.id]);

  useEffect(() => {
    const key = getStorageKey();

    localStorage.setItem(key, JSON.stringify(darkMode));

    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode, user?.id]);

  function toggleTheme() {
    setDarkMode((prev) => !prev);
  }

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleTheme,
        setDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

export const useTheme = () => useContext(ThemeContext);
