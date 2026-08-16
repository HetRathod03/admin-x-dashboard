import "./Products.css";

import { useProducts } from "../../context/ProductContext";
import { useState } from "react";
import { exportProductsCSV } from "../../utils/exportCSV";
import { exportProductsPDF } from "../../utils/exportPDF";
import AddProductModal from "../../components/AddProductModal/AddProductModal";
import ViewProductModal from "../../components/ViewProductModal/ViewProductModal";
import ProductTable from "./ProductTable";
import { useSearch } from "../../context/SearchContext";
import Loader from "../../components/Loader/Loader";

const Products = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const { search, setSearch } = useSearch();

  const {
    categories,

    loading,

    category,
    setCategory,

    sortBy,
    setSortBy,

    currentProducts,
    filteredProducts,

    currentPage,
    setCurrentPage,
    totalPages,
  } = useProducts();

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="products">
      <h1>Products</h1>

      <div className="products-toolbar">
        <div className="toolbar-left">
          <button className="add-btn" onClick={() => setShowModal(true)}>
            + Add Product
          </button>
        </div>

        <div className="toolbar-center">
          <div className="page-search">
            <input
              type="text"
              placeholder="Search Product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All Categories</option>

            {categories.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="default">Default</option>
            <option value="lowToHigh">Low To High</option>
            <option value="highToLow">High To Low</option>
          </select>
        </div>

        <div className="toolbar-right">
          <button
            className="csv-btn"
            onClick={() => exportProductsCSV(filteredProducts)}
          >
            Export CSV
          </button>

          <button
            className="pdf-btn"
            onClick={() => exportProductsPDF(filteredProducts)}
          >
            Export PDF
          </button>
        </div>
      </div>

      <ProductTable
        products={currentProducts}
        onEdit={(product) => {
          setSelectedProduct(product);
          setShowModal(true);
        }}
        onView={(product) => {
          setViewProduct(product);
          setShowViewModal(true);
        }}
      />
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Prev
        </button>

        <span>
          {currentPage} / {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>

      {showModal && (
        <AddProductModal
          closeModal={() => {
            setShowModal(false);
            setSelectedProduct(null);
          }}
          selectedProduct={selectedProduct}
        />
      )}
      {showViewModal && (
        <ViewProductModal
          product={viewProduct}
          closeModal={() => {
            setShowViewModal(false);
            setViewProduct(null);
          }}
        />
      )}
    </section>
  );
};

export default Products;
