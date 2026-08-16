import { useEffect, useState } from "react";
import { useProducts } from "../../context/ProductContext";
import "./AddProductModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const AddProductModal = ({ closeModal, selectedProduct }) => {
  const { categories, createProduct, editProduct } = useProducts();

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
    thumbnail: "",
    rating: "",
  });

  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        title: selectedProduct.title || "",
        price: selectedProduct.price || "",
        category: selectedProduct.category || "",
        brand: selectedProduct.brand || "",
        stock: selectedProduct.stock || "",
        thumbnail: selectedProduct.thumbnail || "",
        rating: selectedProduct.rating || "",
      });

      setPreviewImage(selectedProduct.thumbnail || "");
    } else {
      setFormData({
        title: "",
        price: "",
        category: "",
        brand: "",
        stock: "",
        thumbnail: "",
        rating: "",
      });

      setPreviewImage("");
    }
  }, [selectedProduct]);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "thumbnail") {
      setPreviewImage(e.target.value);
    }
  }

  function handleImage(e) {
  const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onloadend = () => {
    const imageURL = reader.result;

    setPreviewImage(imageURL);

    setFormData((prev) => ({
      ...prev,
      thumbnail: imageURL,
    }));
  };

  reader.readAsDataURL(file);
}
  async function handleSubmit(e) {
    e.preventDefault();

    const productData = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      rating: Number(formData.rating),
    };

    if (selectedProduct) {
      await editProduct(selectedProduct.id, productData);
    } else {
      await createProduct(productData);
    }

    closeModal();
  }

  return (
    <div className="add-product-overlay">
      <div className="add-product-modal">
        <button
          type="button"
          className="add-product-close-btn"
          onClick={closeModal}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>

        <h2>{selectedProduct ? "Edit Product" : "Add Product"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Product Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="brand"
            placeholder="Brand"
            value={formData.brand}
            onChange={handleChange}
          />

          <input
            type="text"
            name="thumbnail"
            placeholder="Image URL"
            value={formData.thumbnail}
            onChange={handleChange}
          />

          <input type="file" accept="image/*" onChange={handleImage} />

          <div className="image-preview">
            <img
              src={previewImage || "https://placehold.co/250x180?text=No+Image"}
              alt="Preview"
              onError={(e) => {
                e.target.src = "https://placehold.co/250x180?text=No+Image";
              }}
            />
          </div>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>

            {categories.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="rating"
            placeholder="Rating"
            min="0"
            max="5"
            step="0.1"
            value={formData.rating}
            onChange={handleChange}
            required
          />

          <div className="add-product-buttons">
            <button type="submit">
              {selectedProduct ? "Update Product" : "Add Product"}
            </button>

            <button type="button" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
