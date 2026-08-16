import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useCurrency } from "../../context/CurrencyContext";
import { useProducts } from "../../context/ProductContext";
import "./TopSellingProducts.css";
import { Link } from "react-router-dom";

const TopSellingProducts = () => {
  const [products, setProducts] = useState([]);

  const { symbol } = useCurrency();
  const { products: allProducts } = useProducts();

  useEffect(() => {
    calculateTopProducts();

    const handleOrdersUpdated = () => {
      calculateTopProducts();
    };

    window.addEventListener("ordersUpdated", handleOrdersUpdated);

    return () => {
      window.removeEventListener("ordersUpdated", handleOrdersUpdated);
    };
  }, [allProducts]);

  const calculateTopProducts = () => {
    try {
      const savedOrders = localStorage.getItem("adminx_orders");

      if (!savedOrders) {
        setProducts([]);
        return;
      }

      const orders = JSON.parse(savedOrders);

      const soldMap = {};

      orders.forEach((order) => {
        if (!order.products || !Array.isArray(order.products)) {
          return;
        }

        order.products.forEach((product) => {
          const quantity = Number(product.quantity) || 0;

          if (!soldMap[product.id]) {
            soldMap[product.id] = 0;
          }

          soldMap[product.id] += quantity;
        });
      });

      const topProducts = Object.entries(soldMap)
        .map(([productId, sold]) => {
          const product = allProducts.find(
            (item) => item.id === Number(productId),
          );

          if (!product) {
            return null;
          }

          return {
            ...product,
            sold,
          };
        })
        .filter(Boolean)
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 5);

      const maxSold =
        topProducts.length > 0
          ? Math.max(...topProducts.map((product) => product.sold))
          : 0;

      const productsWithPercentage = topProducts.map((product) => ({
        ...product,
        soldPercentage:
          maxSold > 0 ? Math.round((product.sold / maxSold) * 100) : 0,
      }));

      setProducts(productsWithPercentage);
    } catch (error) {
      console.error("Failed to calculate top selling products:", error);
      setProducts([]);
    }
  };

  return (
    <div className="top-selling">
      <div className="top-selling-header">
        <div>
          <h2 className="top-selling-title">Top Selling Products</h2>

          <p className="top-selling-subtitle">
            Best performing products this month
          </p>
        </div>

        <Link to="/products" className="view-products-btn">
          View All
        </Link>
      </div>

      <div className="top-selling-list">
        {products.length > 0 ? (
          products.map((product) => (
            <div className="top-selling-item" key={product.id}>
              <img
                src={product.thumbnail || product.images?.[0]}
                alt={product.title}
                className="top-selling-image"
              />

              <div className="top-selling-info">
                <div className="top-row">
                  <h4>{product.title}</h4>

                  <span className="rating">
                    <FontAwesomeIcon icon={faStar} />
                    {product.rating}
                  </span>
                </div>

                <div className="progress">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${product.soldPercentage}%`,
                    }}
                  ></div>
                </div>

                <div className="bottom-row">
                  <span>{product.sold} Sold</span>

                  <strong>
                    {symbol}
                    {product.price}
                  </strong>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="top-selling-empty">No sales data available</p>
        )}
      </div>
    </div>
  );
};

export default TopSellingProducts;
