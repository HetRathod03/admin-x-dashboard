import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNotification } from "./NotificationContext";
import { useActivity } from "./ActivityContext";
import {
  getCategories,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct as deleteProductAPI,
} from "../services/api";
import { useSearch } from "./SearchContext";

const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const { search, setSearch } = useSearch();

  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [categories, setCategories] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const { addNotification } = useNotification();
  const { addActivity } = useActivity();

  const productsPerPage = 10;

  useEffect(() => {
    fetchProducts();
    fetchCategories();

    const handleCategoriesUpdated = () => {
      fetchCategories();
    };

    window.addEventListener("categoriesUpdated", handleCategoriesUpdated);

    return () => {
      window.removeEventListener("categoriesUpdated", handleCategoriesUpdated);
    };
  }, []);

  // ================= FETCH PRODUCTS =================

  async function fetchProducts() {
    try {
      setLoading(true);

      const savedProducts = localStorage.getItem("adminx_products");

      if (savedProducts) {
        const parsedProducts = JSON.parse(savedProducts);

        const sortedProducts = parsedProducts.sort((a, b) => {
          if (!a.createdAt) return 1;
          if (!b.createdAt) return -1;

          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        setProducts(sortedProducts);
        return;
      }

      const data = await getProducts();

      setProducts(data.products);

      localStorage.setItem("adminx_products", JSON.stringify(data.products));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  // ================= ADD PRODUCT =================

  async function createProduct(productData) {
    try {
      setLoading(true);

      const newProduct = await addProduct(productData);

      setProducts((prev) => {
        const product = {
          ...newProduct,
          ...productData,
          id: prev.length ? Math.max(...prev.map((p) => p.id)) + 1 : 1,

          createdAt: new Date().toISOString(),
        };

        const updatedProducts = [product, ...prev];

        localStorage.setItem(
          "adminx_products",
          JSON.stringify(updatedProducts),
        );

        return updatedProducts;
      });

      addNotification(
        "product",
        "Product Added",
        `${productData.title} has been added successfully.`,
      );

      addActivity(
        "product",
        "Product Added",
        `${productData.title} added successfully.`,
      );

      toast.success("Product Added Successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  // ================= EDIT PRODUCT =================

  async function editProduct(id, productData) {
    try {
      setLoading(true);

      if (id <= 194) {
        await updateProduct(id, productData);
      }

      setProducts((prev) => {
        const updatedProducts = prev.map((product) =>
          product.id === id
            ? {
                ...product,
                ...productData,
              }
            : product,
        );

        localStorage.setItem(
          "adminx_products",
          JSON.stringify(updatedProducts),
        );

        return updatedProducts;
      });

      addNotification(
        "product",
        "Product Updated",
        `${productData.title} has been updated successfully.`,
      );

      addActivity(
        "product",
        "Product Updated",
        `${productData.title} updated successfully.`,
      );

      toast.success("Product Updated Successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  // ================= DELETE PRODUCT =================

  async function deleteProduct(id) {
    const product = products.find((item) => item.id === id);

    try {
      setLoading(true);

      if (id <= 194) {
        await deleteProductAPI(id);
      }

      setProducts((prev) => {
        const updatedProducts = prev.filter((product) => product.id !== id);

        localStorage.setItem(
          "adminx_products",
          JSON.stringify(updatedProducts),
        );

        return updatedProducts;
      });

      addNotification(
        "delete",
        "Product Deleted",
        `${product?.title || "Product"} has been deleted.`,
      );

      addActivity(
        "delete",
        "Product Deleted",
        `${product?.title || "Product"} deleted successfully.`,
      );

      toast.success("Product Deleted Successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  // ================= FETCH CATEGORIES =================

  async function fetchCategories() {
    try {
      const data = await getCategories();

      const deletedCategories =
        JSON.parse(localStorage.getItem("deletedCategories")) || [];

      const addedCategories =
        JSON.parse(localStorage.getItem("addedCategories")) || [];

      const updatedCategories =
        JSON.parse(localStorage.getItem("updatedCategories")) || [];

      // API categories
      let categoryList = data.filter(
        (category) => !deletedCategories.includes(category.slug),
      );

      // Apply edited categories
      updatedCategories.forEach((updatedCategory) => {
        const index = categoryList.findIndex(
          (category) => category.slug === updatedCategory.oldSlug,
        );

        if (index !== -1) {
          categoryList[index] = {
            ...categoryList[index],
            name: updatedCategory.name,
            slug: updatedCategory.slug,
            url: updatedCategory.url,
          };
        }
      });

      // Update products with new category slug
      updatedCategories.forEach((updatedCategory) => {
        if (updatedCategory.oldSlug !== updatedCategory.slug) {
          setProducts((prevProducts) => {
            const updatedProducts = prevProducts.map((product) =>
              product.category === updatedCategory.oldSlug
                ? {
                    ...product,
                    category: updatedCategory.slug,
                  }
                : product,
            );

            localStorage.setItem(
              "adminx_products",
              JSON.stringify(updatedProducts),
            );

            return updatedProducts;
          });
        }
      });
      // Add custom categories
      categoryList = [
        ...categoryList,
        ...addedCategories.filter(
          (addedCategory) =>
            !categoryList.some(
              (category) => category.slug === addedCategory.slug,
            ),
        ),
      ];

      setCategories(categoryList);
    } catch (error) {
      toast.error(error.message);
    }
  }
  // ================= FILTER / SEARCH / SORT =================

  const filteredProducts = useMemo(() => {
    let data = [...products];

    // Search
    if (search.trim() !== "") {
      data = data.filter((product) =>
        product.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Category
    if (category !== "all") {
      data = data.filter((product) => product.category === category);
    }

    // Sorting
    if (sortBy === "lowToHigh") {
      data.sort((a, b) => a.price - b.price);
    }

    if (sortBy === "highToLow") {
      data.sort((a, b) => b.price - a.price);
    }

    return data;
  }, [products, search, category, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;

  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const value = {
    products,
    filteredProducts,
    categories,

    loading,

    fetchProducts,
    createProduct,
    editProduct,
    deleteProduct,

    search,
    setSearch,

    category,
    setCategory,

    sortBy,
    setSortBy,

    currentProducts,

    currentPage,
    setCurrentPage,

    totalPages,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export default ProductProvider;

export const useProducts = () => {
  return useContext(ProductContext);
};
