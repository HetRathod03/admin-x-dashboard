import "./LatestActivity.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useActivity } from "../../context/ActivityContext";

const LatestActivity = () => {
  const { activities } = useActivity();

  return (
    <div className="latest-activity">
      <div className="activity-header">
        <div>
          <h2 className="activity-title">Latest Activity</h2>

          <p className="activity-subtitle">
            Recent actions performed in the dashboard
          </p>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="activity-empty">No Activity Yet</div>
      ) : (
        <div className="activity-list">
          {activities.slice(0, 6).map((item) => (
            <div className="activity-item" key={item.id}>
              <div className="activity-icon">
                <FontAwesomeIcon icon={item.icon} />
              </div>

              <div className="activity-info">
                <div className="activity-top">
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

export default LatestActivity;
