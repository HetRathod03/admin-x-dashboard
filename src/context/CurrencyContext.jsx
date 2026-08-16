import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CurrencyContext = createContext();

const CurrencyProvider = ({ children }) => {
  const { user } = useAuth();

  const getStorageKey = () =>
    user?.id ? `currency_${user.id}` : "currency_default";

  const [currency, setCurrency] = useState(() => {
    const key = user?.id ? `currency_${user.id}` : "currency_default";
    return localStorage.getItem(key) || "INR";
  });

  useEffect(() => {
    const key = getStorageKey();
    const saved = localStorage.getItem(key);

    setCurrency(saved || "INR");
  }, [user?.id]);

  useEffect(() => {
    const key = getStorageKey();

    localStorage.setItem(key, currency);
  }, [currency, user?.id]);

  const getSymbol = () => {
    switch (currency) {
      case "USD":
        return "$";

      case "EUR":
        return "€";

      default:
        return "₹";
    }
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        symbol: getSymbol(),
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyProvider;

export const useCurrency = () => useContext(CurrencyContext);
