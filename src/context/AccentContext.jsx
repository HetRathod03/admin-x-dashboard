import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const AccentContext = createContext();

const AccentProvider = ({ children }) => {
  const { user } = useAuth();

  const getStorageKey = () =>
    user?.id ? `accentColor_${user.id}` : "accentColor_default";

  const [accentColor, setAccentColor] = useState(() => {
    const key = user?.id ? `accentColor_${user.id}` : "accentColor_default";

    return localStorage.getItem(key) || "blue";
  });

  useEffect(() => {
    const key = getStorageKey();
    const saved = localStorage.getItem(key);

    setAccentColor(saved || "blue");
  }, [user?.id]);

  useEffect(() => {
    const key = getStorageKey();

    localStorage.setItem(key, accentColor);

    document.body.setAttribute("data-accent", accentColor);
  }, [accentColor, user?.id]);

  return (
    <AccentContext.Provider
      value={{
        accentColor,
        setAccentColor,
      }}
    >
      {children}
    </AccentContext.Provider>
  );
};

export default AccentProvider;

export const useAccent = () => useContext(AccentContext);
