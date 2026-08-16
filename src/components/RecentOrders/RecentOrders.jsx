import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "./RecentOrders.css";
import { useCurrency } from "../../context/CurrencyContext";
import { Link } from "react-router-dom";

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);

  const { symbol } = useCurrency();

  useEffect(() => {
    fetchData();

    const handleOrdersUpdated = () => {
      fetchData();
    };

    window.addEventListener("ordersUpdated", handleOrdersUpdated);

    return () => {
      window.removeEventListener("ordersUpdated", handleOrdersUpdated);
    };
  }, []);

  function fetchData() {
    try {
      const savedOrders = localStorage.getItem("adminx_orders");

      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    } catch (error) {
      toast.error("Failed to load recent orders");
    }
  }

  return (
    <div className="recent-orders">
      <div className="recent-orders-header">
        <div>
          <h2 className="orders-title">Recent Orders</h2>
          <p className="orders-subtitle">Latest customer purchases</p>
        </div>

        <Link to="/orders" className="view-orders-btn">
          View All
        </Link>
      </div>

      {/* Desktop Table View */}
      <div className="orders-table-wrapper">
        <table className="recent-orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {orders
              .slice()
              .sort(
                (a, b) =>
                  new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
              )
              .slice(0, 5)
              .map((order) => (
                <tr key={order.id}>
                  <td className="order-id">#{order.id}</td>

                  <td>{order.customer}</td>

                  <td className="product-name">
                    {order.products.length > 0 ? order.products[0].title : "-"}
                  </td>
                  <td className="order-date">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
                  </td>

                  <td className="amount">
                    {symbol}
                    {order.total.toLocaleString()}
                  </td>

                  <td>
                    <span
                      className={`status ${
                        order.status?.toLowerCase().trim() === "pending"
                          ? "pending"
                          : order.status?.toLowerCase().trim() === "processing"
                            ? "processing"
                            : order.status?.toLowerCase().trim() === "delivered"
                              ? "delivered"
                              : ""
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="orders-list">
        {orders
          .slice()
          .sort(
            (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
          )
          .slice(0, 5)
          .map((order) => (
            <div key={order.id} className="order-card-item">
              <div className="order-card-header">
                <span className="order-card-id">#{order.id}</span>

                <span
                  className={`status ${
                    order.status?.toLowerCase().trim() === "pending"
                      ? "pending"
                      : order.status?.toLowerCase().trim() === "processing"
                        ? "processing"
                        : order.status?.toLowerCase().trim() === "delivered"
                          ? "delivered"
                          : ""
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="order-card-content">
                <div className="order-detail">
                  <span className="detail-label">Customer</span>

                  <span className="detail-value">{order.customer}</span>
                </div>

                <div className="order-detail">
                  <span className="detail-label">Product</span>

                  <span className="detail-value product-name">
                    {order.products.length > 0 ? order.products[0].title : "-"}
                  </span>
                </div>

                <div className="order-detail">
                  <span className="detail-label">Date</span>

                  <span className="detail-value">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
                  </span>
                </div>

                <div className="order-detail">
                  <span className="detail-label">Amount</span>

                  <span className="detail-value amount">
                    {symbol}
                    {order.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RecentOrders;
