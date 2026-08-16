import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const LanguageContext = createContext();

const LanguageProvider = ({ children }) => {
  const { user } = useAuth();

  const getStorageKey = () =>
    user?.id ? `language_${user.id}` : "language_default";

  const [language, setLanguage] = useState(() => {
    const key = user?.id ? `language_${user.id}` : "language_default";
    return localStorage.getItem(key) || "English";
  });

  useEffect(() => {
    const key = getStorageKey();
    const saved = localStorage.getItem(key);

    setLanguage(saved || "English");
  }, [user?.id]);

  useEffect(() => {
    const key = getStorageKey();

    localStorage.setItem(key, language);
  }, [language, user?.id]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;

export const useLanguage = () => useContext(LanguageContext);
