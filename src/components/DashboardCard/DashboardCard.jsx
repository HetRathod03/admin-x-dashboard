import "./DashboardCard.css";

const DashboardCard = ({ title, value, icon, cardClass, iconClass }) => {
  const getDescription = () => {
    switch (title) {
      case "Total Products":
        return "All Inventory";

      case "Total Customers":
        return "All Customers";

      case "Total Orders":
        return "All Orders";

      case "Revenue":
      case "Total Revenue":
        return "All Time";

      default:
        return "";
    }
  };

  return (
    <div className={`dashboard-card ${cardClass}`}>
      <div className={`dashboard-card-icon ${iconClass}`}>{icon}</div>

      <div className="dashboard-card-content">
        <p className="dashboard-card-title">{title}</p>

        <h2
          className={`dashboard-card-value ${
            title === "Revenue" || title === "Total Revenue"
              ? "revenue-value"
              : ""
          }`}
        >
          {value}
        </h2>

        <div className="dashboard-card-footer">
          <small>{getDescription()}</small>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
