import "./ViewProductModal.css";
import { useCurrency } from "../../context/CurrencyContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const ViewProductModal = ({ product, closeModal }) => {
  if (!product) return null;

  const { symbol } = useCurrency();

  return (
    <div className="view-modal-overlay">
      <div className="view-modal">
        <button className="view-modal-close-btn" onClick={closeModal}>
          <FontAwesomeIcon icon={faXmark} />
        </button>

        <img
          src={product.thumbnail}
          alt={product.title}
          className="view-product-image"
        />

        <h2>{product.title}</h2>

        <p>
          <strong>Product ID:</strong> {product.id}
        </p>

        <div className="view-details">
          <p>
            <strong>Category:</strong> {product.category}
          </p>

          <p>
            <strong>Brand:</strong> {product.brand}
          </p>

          <p>
            <strong>Price:</strong> {symbol}
            {product.price}
          </p>

          <p>
            <strong>Stock:</strong> {product.stock}
          </p>

          <p>
            <strong>Rating:</strong> {product.rating}
          </p>

          <p>
            <strong>Description:</strong>
          </p>

          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewProductModal;
