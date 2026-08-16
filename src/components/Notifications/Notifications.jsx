import "./Notifications.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNotification } from "../../context/NotificationContext";
import { Link } from "react-router-dom";

const Notifications = () => {
  const { notifications } = useNotification();

  return (
    <div className="notifications">
      <div className="notifications-header">
        <div>
          <h2 className="notifications-title">Notifications</h2>

          <p className="notifications-subtitle">
            Latest alerts from your dashboard
          </p>
        </div>

        <Link to="/notifications" className="view-notifications-btn">
          View All
        </Link>
      </div>

      {notifications.length === 0 ? (
        <div className="no-notification">No notifications yet.</div>
      ) : (
        <div className="notifications-list">
          {notifications.slice(0, 6).map((item) => (
            <div key={item.id} className="notification-item">
              <div className="dashboard-notification-icon">
                <FontAwesomeIcon icon={item.icon} />
              </div>

              <div className="notification-info">
                <div className="notification-top">
                  <h4>{item.title}</h4>

                  <span>{item.time}</span>
                </div>

                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
