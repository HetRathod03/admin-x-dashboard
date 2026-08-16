import React, { useEffect, useState } from "react";
import "./Orders.css";
import toast from "react-hot-toast";
import { useNotification } from "../../context/NotificationContext";
import { useActivity } from "../../context/ActivityContext";
import { useCurrency } from "../../context/CurrencyContext";
import { useSearch } from "../../context/SearchContext";
import Loader from "../../components/Loader/Loader";
import { getUsers } from "../../services/api";
import AddOrderModal from "../../components/AddOrderModal/AddOrderModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { search, setSearch } = useSearch();
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [users, setUsers] = useState([]);
  const [showAddOrder, setShowAddOrder] = useState(false);

  const { addNotification } = useNotification();
  const { addActivity } = useActivity();

  const { symbol } = useCurrency();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const savedOrders = localStorage.getItem("adminx_orders");

      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);

        const sortedOrders = parsedOrders.sort((a, b) => {
          if (!a.createdAt) return 1;
          if (!b.createdAt) return -1;

          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        setOrders(parsedOrders);
        return;
      }

      const [orderRes, userRes] = await Promise.all([
        fetch("https://dummyjson.com/carts"),
        fetch("https://dummyjson.com/users"),
      ]);

      const orderData = await orderRes.json();
      const userData = await userRes.json();

      const formattedOrders = orderData.carts.map((cart) => {
        const user = userData.users.find((user) => user.id === cart.userId);

        return {
          id: cart.id,
          userId: cart.userId,

          customer: user
            ? `${user.firstName} ${user.lastName}`
            : `Customer ${cart.userId}`,

          products: cart.products.map((product) => ({
            id: product.id,
            title: product.title,
            quantity: product.quantity,
            price: product.price,
          })),

          quantity: cart.totalQuantity,
          total: cart.discountedTotal,

          status:
            cart.id % 3 === 0
              ? "Delivered"
              : cart.id % 2 === 0
                ? "Processing"
                : "Pending",
        };
      });

      localStorage.setItem("adminx_orders", JSON.stringify(formattedOrders));

      setOrders(formattedOrders);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };
  const handleView = (order) => {
    setSelectedOrder({
      ...order,
      customerName: order.customer,
      email: order.email || "",
    });

    setShowModal(true);
  };
  const handleStatusChange = (id, value) => {
    setOrders((prev) => {
      const updatedOrders = prev.map((order) =>
        order.id === id ? { ...order, status: value } : order,
      );

      localStorage.setItem("adminx_orders", JSON.stringify(updatedOrders));

      return updatedOrders;
    });

    addNotification(
      "order",
      "Order Status Updated",
      `Order #${id} changed to ${value}.`,
    );

    addActivity("order", "Order Updated", `Order #${id} changed to ${value}.`);

    toast.success("Order Updated");
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Delete this order?");

    if (!confirmDelete) return;

    setOrders((prev) => {
      const updatedOrders = prev.filter((order) => order.id !== id);

      localStorage.setItem("adminx_orders", JSON.stringify(updatedOrders));

      return updatedOrders;
    });

    addNotification(
      "delete",
      "Order Deleted",
      `Order #${id} has been deleted.`,
    );

    addActivity(
      "delete",
      "Order Deleted",
      `Order #${id} deleted successfully.`,
    );

    toast.success("Order Deleted");
  };

  const filteredOrders = orders.filter((order) => {
    const matchSearch =
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toString().includes(search);

    const matchStatus =
      statusFilter === "all" ? true : order.status === statusFilter;

    return matchSearch && matchStatus;
  });
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="orders">
      <div className="orders-header">
        <h2>Orders</h2>

        <div className="orders-header-right">
          <button
            className="add-order-btn"
            onClick={() => setShowAddOrder(true)}
          >
            + Add Order
          </button>

          <div className="orders-actions">
            <div className="page-search">
              <input
                type="text"
                placeholder="Search Orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE */}

      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th className="hide-mobile">#</th>
              <th>Customer</th>
              <th className="hide-mobile">Products</th>
              <th className="hide-mobile">Quantity</th>
              <th className="hide-total">Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order, index) => (
              <tr key={order.id}>
                <td className="hide-mobile">{index + 1}</td>

                <td className="customer-name">
                  {order.customer?.split(" ").map((name, index) => (
                    <span key={index}>{name}</span>
                  ))}
                </td>

                <td className="hide-mobile">{order.products?.length || 0}</td>

                <td className="hide-mobile">{order.quantity}</td>

                <td className="hide-total">
                  {symbol}
                  {order.total}
                </td>

                <td>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                  >
                    <option>Pending</option>
                    <option>Processing</option>
                    <option>Delivered</option>
                  </select>
                </td>

                <td>
                  <div className="order-action-buttons">
                    <button
                      className="order-view-btn"
                      onClick={() => handleView(order)}
                    >
                      View
                    </button>

                    <button
                      className="order-delete-btn"
                      onClick={() => handleDelete(order.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details</h2>

              <button
                className="modal-close-icon"
                onClick={() => setShowModal(false)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <div className="modal-content">
              <div className="detail-item">
                <span>Order ID</span>
                <strong>#{selectedOrder.id}</strong>
              </div>

              <div className="detail-item">
                <span>Customer</span>
                <strong>{selectedOrder.customerName}</strong>
              </div>

              <div className="detail-item">
                <span>Product</span>
                <strong>{selectedOrder.products?.[0]?.title || "N/A"}</strong>
              </div>

              <div className="detail-item">
                <span>Quantity</span>
                <strong>{selectedOrder.quantity}</strong>
              </div>

              <div className="detail-item">
                <span>Product Price</span>
                <strong>
                  {symbol}
                  {selectedOrder.products?.[0]?.price || 0}
                </strong>
              </div>

              <div className="detail-item">
                <span>Total Amount</span>
                <strong>
                  {symbol}
                  {selectedOrder.total}
                </strong>
              </div>

              <div className="detail-item">
                <span>Status</span>
                <strong
                  className={`order-status ${selectedOrder.status.toLowerCase()}`}
                >
                  {selectedOrder.status}
                </strong>
              </div>

              {selectedOrder.createdAt && (
                <div className="detail-item">
                  <span>Order Date</span>
                  <strong>
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </strong>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADD ORDER MODAL */}

      {showAddOrder && (
        <div className="modal-overlay" onClick={() => setShowAddOrder(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <AddOrderModal
              onClose={() => setShowAddOrder(false)}
              onOrderCreated={(newOrder) => {
                setOrders((prev) => [newOrder, ...prev]);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
