import { useMemo } from "react";
import "./LowStockProducts.css";
import { Link } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";

const LowStockProducts = () => {
  const { products } = useProducts();

  const lowStockProducts = useMemo(() => {
    return [...products]
      .filter((product) => product.stock <= 15)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 5);
  }, [products]);

  return (
    <div className="low-stock">
      <div className="low-stock-header">
        <div>
          <h2 className="low-stock-title">Low Stock Products</h2>

          <p className="low-stock-subtitle">Products that need restocking</p>
        </div>

        <Link to="/products" className="view-stock-btn">
          View All
        </Link>
      </div>

      <div className="low-stock-wrapper">
        <table className="low-stock-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Stock</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {lowStockProducts.map((product) => (
              <tr key={product.id}>
                <td className="product-name">
                  <div className="product-name-wrapper">
                    <img
                      src={product.thumbnail || product.images?.[0]}
                      alt={product.title}
                      className="product-thumb"
                    />
                    <span>{product.title}</span>
                  </div>
                </td>

                <td className="stock-count">{product.stock}</td>

                <td>
                  <span
                    className={`stock-badge ${
                      product.stock <= 5
                        ? "low"
                        : product.stock <= 15
                          ? "medium"
                          : "high"
                    }`}
                  >
                    {product.stock <= 5
                      ? "Low"
                      : product.stock <= 15
                        ? "Medium"
                        : "In Stock"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="low-stock-list">
        {lowStockProducts.map((product) => (
          <div key={product.id} className="low-stock-card">
            <div className="low-stock-card-top">
              <h4>{product.title}</h4>

              <span
                className={`stock-badge ${
                  product.stock <= 5
                    ? "low"
                    : product.stock <= 15
                      ? "medium"
                      : "high"
                }`}
              >
                {product.stock <= 5
                  ? "Low"
                  : product.stock <= 15
                    ? "Medium"
                    : "In Stock"}
              </span>
            </div>

            <div className="low-stock-card-bottom">
              <span>Stock</span>
              <strong className="stock-count">{product.stock}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LowStockProducts;
