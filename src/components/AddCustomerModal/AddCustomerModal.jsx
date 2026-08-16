import React, { useState } from "react";
import toast from "react-hot-toast";
import "./AddCustomerModal.css";
import { useNotification } from "../../context/NotificationContext";
import { useActivity } from "../../context/ActivityContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const AddCustomerModal = ({ onClose, onCustomerCreated }) => {
  const { addNotification } = useNotification();
  const { addActivity } = useActivity();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    city: "",
    country: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const age = formData.age.trim();
    const gender = formData.gender;
    const city = formData.city.trim();
    const country = formData.country.trim();

    // First Name
    if (!firstName) {
      toast.error("First name is required");
      return;
    }

    if (!/^[A-Za-z ]+$/.test(firstName)) {
      toast.error("First name can contain letters only");
      return;
    }

    // Last Name
    if (!lastName) {
      toast.error("Last name is required");
      return;
    }

    if (!/^[A-Za-z ]+$/.test(lastName)) {
      toast.error("Last name can contain letters only");
      return;
    }

    // Email
    if (!email) {
      toast.error("Email is required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Enter a valid email");
      return;
    }

    // Phone
    if (!phone) {
      toast.error("Phone is required");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error("Phone must be exactly 10 digits");
      return;
    }

    // Age
    if (!age) {
      toast.error("Age is required");
      return;
    }

    if (!/^\d+$/.test(age)) {
      toast.error("Age must contain numbers only");
      return;
    }

    const numericAge = Number(age);

    if (numericAge < 1 || numericAge > 120) {
      toast.error("Enter a valid age");
      return;
    }

    // Gender
    if (!gender) {
      toast.error("Gender is required");
      return;
    }

    // City
    if (!city) {
      toast.error("City is required");
      return;
    }

    if (!/^[A-Za-z ]+$/.test(city)) {
      toast.error("City can contain letters only");
      return;
    }

    // Country
    if (!country) {
      toast.error("Country is required");
      return;
    }

    if (!/^[A-Za-z ]+$/.test(country)) {
      toast.error("Country can contain letters only");
      return;
    }

    const savedCustomers =
      JSON.parse(localStorage.getItem("adminx_customers")) || [];

    const newCustomer = {
      id: savedCustomers.length
        ? Math.max(...savedCustomers.map((customer) => customer.id)) + 1
        : 1,

      firstName,
      lastName,
      email,

      phone: `+91 ${phone}`,

      age: numericAge,
      gender,

      address: {
        city,
        country,
      },

      company: {
        name: "-",
      },
    };

    const updatedCustomers = [newCustomer, ...savedCustomers];

    localStorage.setItem("adminx_customers", JSON.stringify(updatedCustomers));

    window.dispatchEvent(new Event("customersUpdated"));

    onCustomerCreated(newCustomer);

    addNotification(
      "customer",
      "Customer Added",
      `${newCustomer.firstName} ${newCustomer.lastName} added successfully.`,
    );

    addActivity(
      "customer",
      "Customer Added",
      `${newCustomer.firstName} ${newCustomer.lastName} added successfully.`,
    );

    toast.success("Customer Added Successfully");

    onClose();
  };
  return (
    <div className="add-customer-overlay" onClick={onClose}>
      <div className="add-customer-modal" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}

        <div className="add-customer-header">
          <div>
            <h2>Add New Customer</h2>
            <p>Create a new customer profile</p>
          </div>

          <button
            className="add-customer-close"
            onClick={onClose}
            aria-label="Close"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* FORM */}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>

              <input
                type="text"
                name="firstName"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>

              <input
                type="text"
                name="lastName"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Phone</label>

              <div className="phone-input">
                <span className="phone-code">+91</span>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter phone"
                  value={formData.phone}
                  maxLength={10}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");

                    if (value.length <= 10) {
                      setFormData((prev) => ({
                        ...prev,
                        phone: value,
                      }));
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Age</label>

              <input
                type="number"
                name="age"
                placeholder="Enter age"
                value={formData.age}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Gender</label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>

              <input
                type="text"
                name="city"
                placeholder="Enter city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Country</label>

              <input
                type="text"
                name="country"
                placeholder="Enter country"
                value={formData.country}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* FOOTER */}

          <div className="add-customer-footer">
            <button
              type="button"
              className="cancel-customer-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className="save-customer-btn">
              Add Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerModal;
