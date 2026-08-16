import "./RecentProducts.css";
import { useCurrency } from "../../context/CurrencyContext";
import { Link } from "react-router-dom";

const RecentProducts = ({ products }) => {
  const { symbol } = useCurrency();

  return (
    <div className="recent-products">
      <div className="recent-products-header">
        <div>
          <h2 className="recent-products-title">Recent Products</h2>

          <p className="recent-products-subtitle">
            Latest products added to inventory
          </p>
        </div>

        <Link to="/products" className="view-products-btn">
          View All
        </Link>
      </div>

      {/* Desktop Table View */}
      <div className="recent-products-table-wrapper">
        <table className="recent-products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {products
              .slice()
              .sort((a, b) => b.id - a.id)
              .slice(0, 5)
              .map((product) => (
                <tr key={product.id}>
                  <td>#{product.id}</td>
                  <td>
                    <img
                      className="recent-product-image"
                      src={product.thumbnail}
                      alt={product.title}
                    />
                  </td>
                  <td>{product.title}</td>
                  <td>{product.category}</td>
                  <td>
                    {symbol}
                    {product.price}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="recent-products-list">
        {products
          .slice()
          .sort((a, b) => b.id - a.id)
          .slice(0, 5)
          .map((product) => (
            <div key={product.id} className="product-card-item">
              <img
                className="product-card-image"
                src={product.thumbnail}
                alt={product.title}
              />
              <div className="product-card-content">
                <div className="product-card-top">
                  <h4 className="product-card-title">{product.title}</h4>
                  <span className="product-card-id">#{product.id}</span>
                </div>
                <div className="product-card-details">
                  <span className="product-category">{product.category}</span>
                  <span className="product-price">
                    {symbol} {product.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RecentProducts;
