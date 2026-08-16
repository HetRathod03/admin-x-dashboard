import "./RecentCustomers.css";
import { Link } from "react-router-dom";

const RecentCustomers = ({ customers }) => {
  return (
    <div className="recent-customers">
      <div className="recent-customers-header">
        <div>
          <h2 className="recent-customers-title">Recent Customers</h2>

          <p className="recent-customers-subtitle">Recently added customers</p>
        </div>
        <Link to="/customers" className="view-customers-btn">
          View All
        </Link>
      </div>

      {/* Desktop Table View */}
      <div className="recent-customers-table-wrapper">
        <table className="recent-customers-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>City</th>
            </tr>
          </thead>

          <tbody>
            {customers.slice(0, 8).map((customer) => (
              <tr key={customer.id}>
                <td>#{customer.id}</td>

                <td>
                  {customer.firstName} {customer.lastName}
                </td>

                <td>{customer.email}</td>

                <td>{customer.address?.city || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="recent-customers-list">
        {customers.slice(0, 5).map((customer) => (
          <div key={customer.id} className="customer-card-item">
            <div className="customer-card-id">#{customer.id}</div>

            <div className="customer-card-content">
              <div className="customer-card-top">
                <h4 className="customer-card-name">
                  {customer.firstName} {customer.lastName}
                </h4>

                <span className="customer-card-city">
                  {customer.address?.city || "N/A"}
                </span>
              </div>

              <p className="customer-card-email">{customer.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentCustomers;
