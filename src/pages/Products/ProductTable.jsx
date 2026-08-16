import "./Products.css";
import { useProducts } from "../../context/ProductContext";
import { useCurrency } from "../../context/CurrencyContext";

const ProductTable = ({ products, onEdit, onView }) => {
  const { deleteProduct } = useProducts();

  const { symbol } = useCurrency();

  return (
    <table className="product-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Image</th>
          <th>Title</th>
          <th className="hide-mobile">Category</th>
          <th className="hide-mobile">Price</th>
          <th className="hide-mobile">Rating</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {products.map((product, index) => (
          <tr key={product.id}>
            <td>{index + 1}</td>

            <td>
              <img src={product.thumbnail} alt={product.title} />
            </td>

            <td>{product.title}</td>

            <td className="hide-mobile">{product.category}</td>

            <td className="hide-mobile">
              {symbol}
              {product.price}
            </td>

            <td className="hide-mobile">{product.rating}</td>

            <td>
              <div className="action-buttons">
                <button className="view-btn" onClick={() => onView(product)}>
                  View
                </button>

                <button className="edit-btn" onClick={() => onEdit(product)}>
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => {
                    const confirmDelete = window.confirm(
                      "Are you sure you want to delete this product?",
                    );

                    if (confirmDelete) {
                      deleteProduct(product.id);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;
