import { useEffect, useState } from "react";
import { useCurrency } from "../../context/CurrencyContext";
import SkeletonLoader from "../../components/SkeletonLoader/SkeletonLoader";
import { useProducts } from "../../context/ProductContext";

import SalesChart from "../../components/SalesChart/SalesChart";
import OrderChart from "../../components/OrderChart/OrderChart";
import LatestActivity from "../../components/LatestActivity/LatestActivity";
import RecentOrders from "../../components/RecentOrders/RecentOrders";
import TopSellingProducts from "../../components/TopSellingProducts/TopSellingProducts";
import LowStockProducts from "../../components/LowStockProducts/LowStockProducts";
import Notifications from "../../components/Notifications/Notifications";
import CalendarWidget from "../../components/CalendarWidget/CalendarWidget";
import DashboardCard from "../../components/DashboardCard/DashboardCard";
import RecentProducts from "../../components/RecentProducts/RecentProducts";
import RecentCustomers from "../../components/RecentUsers/RecentCustomers";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faBoxOpen,
  faUsers,
  faCartShopping,
  faDollarSign,
} from "@fortawesome/free-solid-svg-icons";

import "./Dashboard.css";

const Dashboard = () => {
  const { products } = useProducts();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { symbol } = useCurrency();
  const [orders, setOrders] = useState([]);

 useEffect(() => {
  const loadData = async () => {
    try {
      // ================= CUSTOMERS =================

      let savedCustomers = localStorage.getItem("adminx_customers");

      if (savedCustomers) {
        setCustomers(JSON.parse(savedCustomers));
      } else {
        const customerRes = await fetch("https://dummyjson.com/users");
        const customerData = await customerRes.json();

        localStorage.setItem(
          "adminx_customers",
          JSON.stringify(customerData.users),
        );

        setCustomers(customerData.users);
      }

      // ================= ORDERS =================

      let savedOrders = localStorage.getItem("adminx_orders");

      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        const [orderRes, userRes] = await Promise.all([
          fetch("https://dummyjson.com/carts"),
          fetch("https://dummyjson.com/users"),
        ]);

        const orderData = await orderRes.json();
        const userData = await userRes.json();

        const formattedOrders = orderData.carts.map((cart) => {
          const user = userData.users.find(
            (user) => user.id === cart.userId,
          );

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

        localStorage.setItem(
          "adminx_orders",
          JSON.stringify(formattedOrders),
        );

        setOrders(formattedOrders);
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      setCustomers([]);
      setOrders([]);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  loadData();

  window.addEventListener("ordersUpdated", loadData);
  window.addEventListener("customersUpdated", loadData);

  return () => {
    window.removeEventListener("ordersUpdated", loadData);
    window.removeEventListener("customersUpdated", loadData);
  };
}, []);

  const totalRevenue = orders.reduce((total, order) => total + order.total, 0);
  const formatCurrency = (amount) => {
    if (amount >= 10000000) {
      return `${symbol}${(amount / 10000000).toFixed(2)}Cr`;
    }

    if (amount >= 100000) {
      return `${symbol}${(amount / 100000).toFixed(2)}L`;
    }

    if (amount >= 1000) {
      return `${symbol}${(amount / 1000).toFixed(2)}K`;
    }

    return `${symbol}${amount.toFixed(2)}`;
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <section className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>

      <div className="dashboard-cards">
        <DashboardCard
          title="Total Products"
          value={products.length}
          icon={<FontAwesomeIcon icon={faBoxOpen} />}
          cardClass="product-card"
          iconClass="product-icon"
        />

        <DashboardCard
          title="Total Customers"
          value={customers.length}
          icon={<FontAwesomeIcon icon={faUsers} />}
          cardClass="user-card"
          iconClass="user-icon"
        />

        <DashboardCard
          title="Total Orders"
          value={orders.length}
          icon={<FontAwesomeIcon icon={faCartShopping} />}
          cardClass="order-card"
          iconClass="order-icon"
        />

        <DashboardCard
          title="Revenue"
          value={formatCurrency(totalRevenue)}
          icon={<FontAwesomeIcon icon={faDollarSign} />}
          cardClass="revenue-card"
          iconClass="revenue-icon"
        />
      </div>

      <div className="dashboard-bottom">
        <RecentProducts products={products} />

        <RecentCustomers customers={customers} />
      </div>

      <div className="dashboard-charts">
        <SalesChart />

        <OrderChart />
      </div>

      <div className="dashboard-orders">
        <RecentOrders />

        <TopSellingProducts />
      </div>

      <div className="dashboard-widgets">
        <LatestActivity />

        <Notifications />
      </div>

      <div className="dashboard-widgets">
        <LowStockProducts />

        <CalendarWidget />
      </div>
    </section>
  );
};

export default Dashboard;
