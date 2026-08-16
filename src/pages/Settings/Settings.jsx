import "./Settings.css";
import toast from "react-hot-toast";

import { useTheme } from "../../context/ThemeContext";
import { useCurrency } from "../../context/CurrencyContext";
import { useNotification } from "../../context/NotificationContext";
import { useLanguage } from "../../context/LanguageContext";
import { useAccent } from "../../context/AccentContext";

const Settings = () => {
  const { darkMode, setDarkMode } = useTheme();

  const { currency, setCurrency } = useCurrency();

  const { language, setLanguage } = useLanguage();

  const { accentColor, setAccentColor } = useAccent();

  const { notificationsEnabled, toggleNotifications } = useNotification();

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);

    toast.success(!darkMode ? "Dark Mode Enabled" : "Light Mode Enabled");
  };

  const handleNotificationToggle = () => {
    toggleNotifications();

    toast.success(
      !notificationsEnabled
        ? "Notifications Enabled"
        : "Notifications Disabled",
    );
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);

    toast.success(`Language changed to ${e.target.value}`);
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);

    toast.success(`Currency changed to ${e.target.value}`);
  };

  return (
    <div className="settings">
      <h2>Settings</h2>

      <div className="setting-card">
        <div className="setting-row">
          <span>Dark Mode</span>

          <label className="switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={handleThemeToggle}
            />

            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-row">
          <span>Notifications</span>

          <label className="switch">
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={handleNotificationToggle}
            />

            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-row">
          <span>Language</span>

          <select value={language} onChange={handleLanguageChange}>
            <option value="English">English</option>

            <option value="Hindi">Hindi</option>

            <option value="Gujarati">Gujarati</option>
          </select>
        </div>

        <div className="setting-row">
          <span>Currency</span>

          <select value={currency} onChange={handleCurrencyChange}>
            <option value="INR">INR</option>

            <option value="USD">USD</option>

            <option value="EUR">EUR</option>
          </select>
        </div>

        <div className="setting-row">
          <span>Accent Color</span>

          <select
            value={accentColor}
            onChange={(e) => {
              setAccentColor(e.target.value);

              toast.success(
                `${
                  e.target.value.charAt(0).toUpperCase() +
                  e.target.value.slice(1)
                } theme selected`,
              );
            }}
          >
            <option value="blue">Blue</option>

            <option value="green">Green</option>

            <option value="purple">Purple</option>

            <option value="orange">Orange</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Settings;
