import "./Activity.css";
import { useActivity } from "../../context/ActivityContext";

const Activity = () => {
  const { activities } = useActivity();

  return (
    <div className="activity">
      <div className="activity-header">
        <h2>Recent Activities</h2>
      </div>

      {activities.length === 0 ? (
        <p className="empty">No Activity Yet</p>
      ) : (
        activities.slice(0, 6).map((item) => (
          <div key={item.id} className="activity-item">
            <div className="activity-info">
              <h4>{item.title}</h4>

              <p>{item.description}</p>

              <span>{item.time}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Activity;
