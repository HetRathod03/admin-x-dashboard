import "./SkeletonLoader.css";

const SkeletonLoader = () => {
  return (
    <section className="dashboard-skeleton">
      {/* Cards */}
      <div className="skeleton-cards">
        {[1, 2, 3, 4].map((item) => (
          <div className="skeleton skeleton-card" key={item}></div>
        ))}
      </div>

      {/* Recent Products / Users */}
      <div className="skeleton-row">
        <div className="skeleton skeleton-box large"></div>
        <div className="skeleton skeleton-box large"></div>
      </div>

      {/* Charts */}
      <div className="skeleton-row">
        <div className="skeleton skeleton-box"></div>
        <div className="skeleton skeleton-box"></div>
      </div>

      {/* Orders */}
      <div className="skeleton-row">
        <div className="skeleton skeleton-box"></div>
        <div className="skeleton skeleton-box"></div>
      </div>

      {/* Widgets */}
      <div className="skeleton-row">
        <div className="skeleton skeleton-box"></div>
        <div className="skeleton skeleton-box"></div>
      </div>
    </section>
  );
};

export default SkeletonLoader;
