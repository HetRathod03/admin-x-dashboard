import { Link, useNavigate } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound">
      <div className="notfound-content">
        <h1>404</h1>

        <h2>Page Not Found</h2>

        <p>
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>

        <div className="notfound-buttons">
          <Link to="/" className="home-btn">
            Go Dashboard
          </Link>

          <button className="back-btn" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
