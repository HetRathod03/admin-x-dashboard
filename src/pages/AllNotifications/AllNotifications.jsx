import "./AllNotifications.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useNotification } from "../../context/NotificationContext";

const AllNotifications = () => {
  const { notifications, clearNotifications, removeNotification } =
    useNotification();

  return (
    <section className="all-notifications">
      <div className="all-header">
        <h2>All Notifications</h2>

        {notifications.length > 0 && (
          <button className="clear-btn" onClick={clearNotifications}>
            Clear All
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="empty-notification">No Notifications Found</div>
      ) : (
        <div className="notification-list">
          {notifications.map((item) => (
            <div className="notification-card" key={item.id}>
              <div className="notification-icon">
                <FontAwesomeIcon icon={item.icon} />
              </div>

              <div className="notification-info">
                <h4>{item.title}</h4>

                <p>{item.description}</p>

                <span>{item.time}</span>
              </div>

              <button
                className="delete-notification-btn"
                onClick={() => removeNotification(item.id)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default AllNotifications;
