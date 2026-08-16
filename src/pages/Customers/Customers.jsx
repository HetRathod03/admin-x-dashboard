import React, { useEffect, useState } from "react";
import "./Customers.css";
import toast from "react-hot-toast";
import { useNotification } from "../../context/NotificationContext";
import { useActivity } from "../../context/ActivityContext";
import { useSearch } from "../../context/SearchContext";
import Loader from "../../components/Loader/Loader";
import AddCustomerModal from "../../components/AddCustomerModal/AddCustomerModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faXmark } from "@fortawesome/free-solid-svg-icons";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { search, setSearch } = useSearch();

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showEditCustomer, setShowEditCustomer] = useState(false);

  const [editCustomer, setEditCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const { addNotification } = useNotification();
  const { addActivity } = useActivity();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const savedCustomers = localStorage.getItem("adminx_customers");

      if (savedCustomers) {
        const parsedCustomers = JSON.parse(savedCustomers);

        setCustomers(parsedCustomers);
        return;
      }

      const res = await fetch("https://dummyjson.com/users");
      const data = await res.json();

      setCustomers(data.users);

      localStorage.setItem("adminx_customers", JSON.stringify(data.users));
    } catch (error) {
      toast.error("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const handleEdit = (customer) => {
    setEditCustomer({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
    });

    setSelectedCustomer(customer);
    setShowEditCustomer(true);
  };

  const handleUpdateCustomer = () => {
    const updatedCustomer = {
      ...selectedCustomer,
      firstName: editCustomer.firstName.trim(),
      lastName: editCustomer.lastName.trim(),
      email: editCustomer.email.trim(),
      phone: editCustomer.phone.trim(),
    };

    if (
      !updatedCustomer.firstName ||
      !updatedCustomer.lastName ||
      !updatedCustomer.email ||
      !updatedCustomer.phone
    ) {
      toast.error("Please fill all fields");
      return;
    }

    setCustomers((prev) => {
      const updatedCustomers = prev.map((customer) =>
        customer.id === selectedCustomer.id ? updatedCustomer : customer,
      );

      localStorage.setItem(
        "adminx_customers",
        JSON.stringify(updatedCustomers),
      );

      return updatedCustomers;
    });

    addNotification(
      "edit",
      "Customer Updated",
      `${updatedCustomer.firstName} ${updatedCustomer.lastName} updated successfully.`,
    );

    addActivity(
      "edit",
      "Customer Updated",
      `${updatedCustomer.firstName} ${updatedCustomer.lastName} updated successfully.`,
    );

    toast.success("Customer Updated");

    setShowEditCustomer(false);
    setSelectedCustomer(null);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Delete Customer?");

    if (!confirmDelete) return;

    const customer = customers.find((item) => item.id === id);

    setCustomers((prev) => {
      const updatedCustomers = prev.filter((item) => item.id !== id);

      localStorage.setItem(
        "adminx_customers",
        JSON.stringify(updatedCustomers),
      );

      return updatedCustomers;
    });

    addNotification(
      "delete",
      "Customer Deleted",
      `${customer.firstName} ${customer.lastName} has been removed.`,
    );

    addActivity(
      "delete",
      "Customer Deleted",
      `${customer.firstName} ${customer.lastName} removed.`,
    );

    toast.success("Customer Deleted");
  };

  const filteredCustomers = customers.filter((customer) => {
    return (
      customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="customers">
      <div className="customers-header">
        <div>
          <h2>Customers</h2>
          <p>Manage your customers</p>
        </div>

        <button
          className="add-customer-btn"
          onClick={() => setShowAddCustomer(true)}
        >
          + Add Customer
        </button>
      </div>

      <div className="page-search">
        <input
          type="text"
          placeholder="Search Customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="customers-table">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th className="hide-email">Email</th>
              <th className="hide-phone">Phone</th>
              <th>City</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCustomers.map((customer, index) => (
              <tr key={customer.id}>
                <td>{index + 1}</td>

                <td>
                  <div className="customer-name">
                    <span>{customer.firstName}</span>
                    <span>{customer.lastName}</span>
                  </div>
                </td>

                <td className="hide-email">{customer.email}</td>

                <td className="hide-phone">{customer.phone}</td>

                <td>{customer.address.city}</td>

                <td>
                  <div className="customer-action-buttons">
                    <button
                      className="customer-view-btn"
                      onClick={() => handleView(customer)}
                    >
                      View
                    </button>

                    <button
                      className="customer-edit-btn"
                      onClick={() => handleEdit(customer)}
                    >
                      Edit
                    </button>

                    <button
                      className="customer-delete-btn"
                      onClick={() => handleDelete(customer.id)}
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

      {showModal && selectedCustomer && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Customer Details</h2>

              <button
                className="modal-close-btn"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <div className="modal-content">
              <div className="detail-item">
                <span>ID</span>
                <strong>{selectedCustomer.id}</strong>
              </div>

              <div className="detail-item">
                <span>Name</span>
                <strong>
                  {selectedCustomer.firstName} {selectedCustomer.lastName}
                </strong>
              </div>

              <div className="detail-item">
                <span>Email</span>
                <strong>{selectedCustomer.email}</strong>
              </div>

              <div className="detail-item">
                <span>Phone</span>
                <strong>{selectedCustomer.phone}</strong>
              </div>

              <div className="detail-item">
                <span>Age</span>
                <strong>{selectedCustomer.age}</strong>
              </div>

              <div className="detail-item">
                <span>Gender</span>
                <strong>{selectedCustomer.gender}</strong>
              </div>

              <div className="detail-item">
                <span>City</span>
                <strong>{selectedCustomer.address.city}</strong>
              </div>

              <div className="detail-item">
                <span>Country</span>
                <strong>{selectedCustomer.address.country}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
      {showAddCustomer && (
        <AddCustomerModal
          onClose={() => setShowAddCustomer(false)}
          onCustomerCreated={(newCustomer) => {
            setCustomers((prev) => [newCustomer, ...prev]);
          }}
        />
      )}
      {showEditCustomer && selectedCustomer && (
        <div
          className="modal-overlay"
          onClick={() => setShowEditCustomer(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Customer</h2>

              <button
                className="modal-close-btn"
                onClick={() => setShowEditCustomer(false)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <div className="modal-content">
              <div className="detail-item">
                <span>First Name</span>

                <input
                  type="text"
                  value={editCustomer.firstName}
                  onChange={(e) =>
                    setEditCustomer({
                      ...editCustomer,
                      firstName: e.target.value,
                    })
                  }
                />
              </div>

              <div className="detail-item">
                <span>Last Name</span>

                <input
                  type="text"
                  value={editCustomer.lastName}
                  onChange={(e) =>
                    setEditCustomer({
                      ...editCustomer,
                      lastName: e.target.value,
                    })
                  }
                />
              </div>

              <div className="detail-item">
                <span>Email</span>

                <input
                  type="email"
                  value={editCustomer.email}
                  onChange={(e) =>
                    setEditCustomer({
                      ...editCustomer,
                      email: e.target.value,
                    })
                  }
                />
              </div>

              <div className="detail-item">
                <span>Phone</span>

                <input
                  type="text"
                  value={editCustomer.phone}
                  onChange={(e) =>
                    setEditCustomer({
                      ...editCustomer,
                      phone: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="customer-modal-footer">
              <button
                className="customer-close-btn"
                onClick={() => setShowEditCustomer(false)}
              >
                Cancel
              </button>

              <button
                className="add-customer-btn"
                onClick={handleUpdateCustomer}
              >
                Update Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Customers;
