import "./SalesChart.css";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Line } from "react-chartjs-2";
import { useCurrency } from "../../context/CurrencyContext";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
);

const SalesChart = () => {
  const [sales, setSales] = useState([]);

  const { symbol } = useCurrency();

  useEffect(() => {
    fetchSales();

    const handleOrdersUpdated = () => {
      fetchSales();
    };

    window.addEventListener("ordersUpdated", handleOrdersUpdated);

    return () => {
      window.removeEventListener("ordersUpdated", handleOrdersUpdated);
    };
  }, []);

  const fetchSales = () => {
    try {
      const savedOrders = localStorage.getItem("adminx_orders");

      if (!savedOrders) {
        setSales(Array(5).fill(0));
        return;
      }

      const orders = JSON.parse(savedOrders);

      // Week 1, Week 2, Week 3, Week 4, Week 5
      const weeklySales = Array(5).fill(0);

      const now = new Date();

      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      orders.forEach((order) => {
        if (!order.createdAt) return;

        const orderDate = new Date(order.createdAt);

        if (Number.isNaN(orderDate.getTime())) return;

        // Sirf current month ke orders
        if (
          orderDate.getMonth() === currentMonth &&
          orderDate.getFullYear() === currentYear
        ) {
          const day = orderDate.getDate();

          // 1-7 = Week 1
          // 8-14 = Week 2
          // 15-21 = Week 3
          // 22-28 = Week 4
          // 29-31 = Week 5
          const weekIndex = Math.floor((day - 1) / 7);

          weeklySales[weekIndex] += Number(order.total) || 0;
        }
      });

      setSales(weeklySales);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load sales data");
    }
  };

  // ================= WEEK LABELS =================

  const labels = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];

  // ================= TOTAL REVENUE =================

  const totalRevenue = sales.reduce((sum, value) => sum + value, 0);

  // ================= CHART DATA =================

  const chartData = {
    labels,

    datasets: [
      {
        label: "Revenue",
        data: sales,

        borderColor: "#2563eb",
        borderWidth: 4,
        tension: 0.45,
        fill: true,

        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) return null;

          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom,
          );

          gradient.addColorStop(0, "rgba(37,99,235,.35)");

          gradient.addColorStop(1, "rgba(37,99,235,0)");

          return gradient;
        },

        pointRadius: 5,
        pointHoverRadius: 8,

        pointBackgroundColor: "#2563eb",
        pointBorderColor: "#fff",
        pointBorderWidth: 3,
      },
    ],
  };

  // ================= CHART OPTIONS =================

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    interaction: {
      mode: "index",
      intersect: false,
    },

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        backgroundColor: "#111827",
        displayColors: false,
        padding: 12,
        cornerRadius: 10,

        callbacks: {
          label: function (context) {
            return `Revenue : ${symbol}${Number(context.raw).toLocaleString()}`;
          },
        },
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },

        ticks: {
          color: "#6b7280",

          font: {
            size: 13,
            weight: "600",
          },
        },
      },

      y: {
        beginAtZero: true,

        border: {
          display: false,
        },

        grid: {
          color: "rgba(148,163,184,.18)",
        },

        ticks: {
          color: "#6b7280",

          callback: function (value) {
            return symbol + value;
          },
        },
      },
    },
  };

  return (
    <div className="sales-chart">
      <div className="sales-header">
        <div>
          <h2 className="sales-chart-title">Sales Overview</h2>

          <p className="sales-subtitle">Revenue generated over this month</p>
        </div>

        <button className="sales-btn">This Month</button>
      </div>

      <div className="sales-stats">
        <div>
          <span className="sales-label">Total Revenue</span>

          <h2 className="sales-total">
            {symbol}
            {totalRevenue.toLocaleString()}
          </h2>
        </div>
      </div>

      <div className="sales-chart-box">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default SalesChart;
