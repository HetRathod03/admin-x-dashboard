import "./OrderChart.css";
import { useEffect, useState } from "react";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const OrderChart = () => {
  const [chartData, setChartData] = useState({
    completed: 0,
    pending: 0,
    processing: 0,
  });

  useEffect(() => {
    fetchOrders();

    const handleOrdersUpdated = () => {
      fetchOrders();
    };

    window.addEventListener("ordersUpdated", handleOrdersUpdated);

    return () => {
      window.removeEventListener("ordersUpdated", handleOrdersUpdated);
    };
  }, []);

  const fetchOrders = () => {
    try {
      const savedOrders = localStorage.getItem("adminx_orders");

      if (!savedOrders) {
        setChartData({
          completed: 0,
          pending: 0,
          processing: 0,
        });
        return;
      }

      const orders = JSON.parse(savedOrders);

      const completed = orders.filter(
        (order) => order.status === "Delivered",
      ).length;

      const pending = orders.filter(
        (order) => order.status === "Pending",
      ).length;

      const processing = orders.filter(
        (order) => order.status === "Processing",
      ).length;

      setChartData({
        completed,
        pending,
        processing,
      });
    } catch (error) {
      console.error("Failed to load order status:", error);
    }
  };

  const total = chartData.completed + chartData.pending + chartData.processing;

  const data = {
    labels: ["Delivered", "Pending", "Processing"],

    datasets: [
      {
        data: [chartData.completed, chartData.pending, chartData.processing],

        backgroundColor: ["#22c55e", "#f59e0b", "#2563eb"],

        hoverOffset: 12,

        borderColor: "#fff",

        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "bottom",

        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          color: "#6b7280",

          font: {
            size: 13,
            weight: "600",
          },
        },
      },
    },
  };

  return (
    <div className="order-chart">
      <div className="order-header">
        <div>
          <h2 className="order-chart-title">Order Status</h2>

          <p className="order-subtitle">Distribution of all customer orders</p>
        </div>

        <div className="order-total">
          {total}
          <span>Total</span>
        </div>
      </div>

      <div className="pie-chart-box">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default OrderChart;
