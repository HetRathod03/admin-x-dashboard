import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import "./AddOrderModal.css";
import { useCurrency } from "../../context/CurrencyContext";
import { useProducts } from "../../context/ProductContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const AddOrderModal = ({ onClose, onOrderCreated }) => {
  const { symbol } = useCurrency();

  const { products, categories } = useProducts();

  const [formData, setFormData] = useState({
    customer: "",
    productId: "",
    quantity: 1,
    status: "Pending",
    category: "all",
  });

  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const savedCustomers =
      JSON.parse(localStorage.getItem("adminx_customers")) || [];

    setCustomers(savedCustomers);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= PRODUCT FILTER =================

  const filteredProducts = useMemo(() => {
    let data = [...products];

    // Category
    if (formData.category !== "all") {
      data = data.filter((product) => product.category === formData.category);
    }

    return data;
  }, [products, formData.productSearch, formData.category]);

  // ================= SELECTED PRODUCT =================

  const selectedProduct = products.find(
    (product) => product.id === Number(formData.productId),
  );

  // ================= TOTAL =================

  const total = selectedProduct
    ? Number(selectedProduct.price) * Number(formData.quantity)
    : 0;

  // ================= SUBMIT =================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.customer.trim()) {
      toast.error("Customer name is required");
      return;
    }

    if (!selectedProduct) {
      toast.error("Please select a product");
      return;
    }

    if (Number(formData.quantity) < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }

    const savedOrders = JSON.parse(localStorage.getItem("adminx_orders")) || [];

    const newOrder = {
      id: savedOrders.length
        ? Math.max(...savedOrders.map((order) => order.id)) + 1
        : 1,

      userId: null,

      customer: formData.customer.trim(),

      products: [
        {
          id: selectedProduct.id,
          title: selectedProduct.title,
          quantity: Number(formData.quantity),
          price: Number(selectedProduct.price),
        },
      ],

      quantity: Number(formData.quantity),

      total: total,

      status: formData.status,

      createdAt: new Date().toISOString(),
    };

    const updatedOrders = [...savedOrders, newOrder];

    localStorage.setItem("adminx_orders", JSON.stringify(updatedOrders));

    // RecentOrders / SalesChart ko update signal
    window.dispatchEvent(new Event("ordersUpdated"));

    onOrderCreated(newOrder);

    toast.success("Order Added Successfully");

    onClose();
  };

  return (
    <div className="add-order-overlay" onClick={onClose}>
      <div className="add-order-modal" onClick={(e) => e.stopPropagation()}>
        {/* ================= HEADER ================= */}

        <div className="add-order-header">
          <div>
            <h2>Add New Order</h2>

            <p>Create a new customer order</p>
          </div>

          <button className="add-order-close" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* ================= CUSTOMER ================= */}

          <div className="form-group">
            <label>Customer Name</label>

            <select
              name="customer"
              value={formData.customer}
              onChange={handleChange}
            >
              <option value="">Select Customer</option>

              {customers.map((customer) => (
                <option
                  key={customer.id}
                  value={`${customer.firstName} ${customer.lastName}`}
                >
                  {customer.firstName} {customer.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* ================= CATEGORY ================= */}

          <div className="form-group">
            <label>Category</label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="all">All Categories</option>

              {categories.map((category) => (
                <option
                  key={category.slug || category}
                  value={category.slug || category}
                >
                  {category.name || category.slug || category}
                </option>
              ))}
            </select>
          </div>

          {/* ================= PRODUCT ================= */}

          <div className="form-group">
            <label>Select Product</label>

            <select
              name="productId"
              value={formData.productId}
              onChange={handleChange}
            >
              <option value="">Select a product</option>

              {filteredProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.title} - {symbol}
                  {product.price}
                </option>
              ))}
            </select>
          </div>

          {/* ================= PRODUCT INFO ================= */}

          {selectedProduct && (
            <div className="selected-product-wrapper">
              <label>Selected Product</label>

              <div className="selected-product-card">
                <img
                  src={selectedProduct.thumbnail || selectedProduct.images?.[0]}
                  alt={selectedProduct.title}
                  className="selected-product-image"
                />

                <div className="selected-product-details">
                  <h4>{selectedProduct.title}</h4>

                  <p>
                    {symbol}
                    {Number(selectedProduct.price).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
          {/* ================= QUANTITY + TOTAL ================= */}

          <div className="form-row">
            <div className="form-group">
              <label>Quantity</label>

              <input
                type="number"
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Total Amount</label>

              <div className="amount-display">
                <span>{symbol}</span>

                <strong>{total.toLocaleString()}</strong>
              </div>
            </div>
          </div>

          {/* ================= STATUS ================= */}

          <div className="form-group">
            <label>Status</label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>

              <option value="Processing">Processing</option>

              <option value="Delivered">Delivered</option>
            </select>
          </div>

          {/* ================= FOOTER ================= */}

          <div className="add-order-footer">
            <button
              type="button"
              className="cancel-order-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className="save-order-btn">
              Add Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrderModal;
