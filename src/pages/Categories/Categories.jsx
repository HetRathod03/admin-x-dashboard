import React, { useEffect, useState } from "react";
import "./Categories.css";
import toast from "react-hot-toast";
import { useNotification } from "../../context/NotificationContext";
import { useActivity } from "../../context/ActivityContext";
import { useSearch } from "../../context/SearchContext";
import Loader from "../../components/Loader/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const { search, setSearch } = useSearch();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);

  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
  });

  const [showEditModal, setShowEditModal] = useState(false);

  const [editCategory, setEditCategory] = useState({
    name: "",
    slug: "",
  });

  const { addNotification } = useNotification();
  const { addActivity } = useActivity();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const res = await fetch("https://dummyjson.com/products/categories");

      const data = await res.json();

      const deletedCategories =
        JSON.parse(localStorage.getItem("deletedCategories")) || [];

      const addedCategories =
        JSON.parse(localStorage.getItem("addedCategories")) || [];

      const updatedCategories =
        JSON.parse(localStorage.getItem("updatedCategories")) || [];

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
            name: updatedCategory.name,
            slug: updatedCategory.slug,
            url: updatedCategory.url,
          };
        }
      });

      // Add custom categories
      categoryList = [
        ...addedCategories.filter(
          (addedCategory) =>
            !categoryList.some(
              (category) => category.slug === addedCategory.slug,
            ),
        ),
        ...categoryList,
      ];

      setCategories(categoryList);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleEdit = (category) => {
    setEditCategory({
      name: category.name,
      slug: category.slug,
    });

    setSelectedCategory(category);
    setShowEditModal(true);
  };

  // UPDATE CATEGORY
  const handleUpdateCategory = () => {
    const name = editCategory.name.trim();
    const slug = editCategory.slug.trim().toLowerCase();

    if (!name || !slug) {
      toast.error("Please fill all fields");
      return;
    }

    const exists = categories.some(
      (category) =>
        category.slug === slug && category.slug !== selectedCategory.slug,
    );

    if (exists) {
      toast.error("Category already exists");
      return;
    }

    const oldSlug = selectedCategory.slug;

    const updatedCategory = {
      name,
      slug,
      url: `https://dummyjson.com/products/category/${slug}`,
      oldSlug,
    };

    // UI update
    setCategories((prev) =>
      prev.map((category) =>
        category.slug === oldSlug ? updatedCategory : category,
      ),
    );

    // Save edited categories permanently
    const updatedCategories =
      JSON.parse(localStorage.getItem("updatedCategories")) || [];

    const filteredUpdatedCategories = updatedCategories.filter(
      (category) => category.oldSlug !== oldSlug,
    );

    filteredUpdatedCategories.push(updatedCategory);

    localStorage.setItem(
      "updatedCategories",
      JSON.stringify(filteredUpdatedCategories),
    );

    //  added category and update addedCategories 
    const addedCategories =
      JSON.parse(localStorage.getItem("addedCategories")) || [];

    const updatedAddedCategories = addedCategories.map((category) =>
      category.slug === oldSlug
        ? {
            name,
            slug,
            url: `https://dummyjson.com/products/category/${slug}`,
          }
        : category,
    );

    localStorage.setItem(
      "addedCategories",
      JSON.stringify(updatedAddedCategories),
    );

    window.dispatchEvent(new Event("categoriesUpdated"));

    addNotification(
      "edit",
      "Category Updated",
      `${name} category updated successfully.`,
    );

    addActivity(
      "edit",
      "Category Updated",
      `${name} category updated successfully.`,
    );

    toast.success("Category Updated");

    setShowEditModal(false);
    setSelectedCategory(null);
  };
  // category add
  const handleAddCategory = () => {
    const name = newCategory.name.trim();
    const slug = newCategory.slug.trim().toLowerCase();

    if (!name || !slug) {
      toast.error("Please fill all fields");
      return;
    }

    const exists = categories.some((category) => category.slug === slug);

    if (exists) {
      toast.error("Category already exists");
      return;
    }

    const category = {
      name,
      slug,
      url: `https://dummyjson.com/products/category/${slug}`,
    };

    const addedCategories =
      JSON.parse(localStorage.getItem("addedCategories")) || [];

    const updatedAddedCategories = [category, ...addedCategories];

    localStorage.setItem(
      "addedCategories",
      JSON.stringify(updatedAddedCategories),
    );

    setCategories((prev) => [category, ...prev]);

    window.dispatchEvent(new Event("categoriesUpdated"));

    addNotification(
      "add",
      "Category Added",
      `${name} category added successfully.`,
    );

    addActivity(
      "add",
      "Category Added",
      `${name} category added successfully.`,
    );

    toast.success("Category Added");

    setNewCategory({
      name: "",
      slug: "",
    });

    setShowAddModal(false);
  };

  const handleDelete = (slug) => {
    const confirmDelete = window.confirm("Delete this category?");

    if (!confirmDelete) return;

    const category = categories.find((item) => item.slug === slug);

    // Deleted categories
    const deletedCategories =
      JSON.parse(localStorage.getItem("deletedCategories")) || [];

    if (!deletedCategories.includes(slug)) {
      deletedCategories.push(slug);
    }

    localStorage.setItem(
      "deletedCategories",
      JSON.stringify(deletedCategories),
    );

    // Remove from added categories also
    const addedCategories =
      JSON.parse(localStorage.getItem("addedCategories")) || [];

    const updatedAddedCategories = addedCategories.filter(
      (item) => item.slug !== slug,
    );

    localStorage.setItem(
      "addedCategories",
      JSON.stringify(updatedAddedCategories),
    );

    // Remove from UI
    setCategories((prev) => prev.filter((item) => item.slug !== slug));

    addNotification(
      "delete",
      "Category Deleted",
      `${category.name} category deleted successfully.`,
    );

    addActivity(
      "delete",
      "Category Deleted",
      `${category.name} deleted successfully.`,
    );

    toast.success("Category Deleted");
  };
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="categories">
      <div className="categories-header">
        <h2>Categories</h2>

        <button
          className="add-category-btn"
          onClick={() => setShowAddModal(true)}
        >
          + Add Category
        </button>

        <div className="page-search">
          <input
            type="text"
            placeholder="Search Category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="categories-table">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th className="hide-slug">Slug</th>
              <th className="hide-url">URL</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCategories.map((category, index) => (
              <tr key={category.slug}>
                <td>{index + 1}</td>

                <td>{category.name}</td>

                <td className="hide-slug">{category.slug}</td>

                <td className="hide-url">{category.url}</td>

                <td>
                  <div className="product-action-buttons">
                    <button
                      className="product-view-btn"
                      onClick={() => handleView(category)}
                    >
                      View
                    </button>

                    <button
                      className="product-edit-btn"
                      onClick={() => handleEdit(category)}
                    >
                      Edit
                    </button>

                    <button
                      className="product-delete-btn"
                      onClick={() => handleDelete(category.slug)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedCategory && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-icon"
              onClick={() => setShowModal(false)}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <h2>Category Details</h2>

            <div className="modal-content">
              <div className="detail-item">
                <span>Name</span>
                <strong>{selectedCategory.name}</strong>
              </div>

              <div className="detail-item">
                <span>Slug</span>
                <strong>{selectedCategory.slug}</strong>
              </div>

              <div className="detail-item">
                <span>URL</span>
                <strong style={{ wordBreak: "break-all" }}>
                  {selectedCategory.url}
                </strong>
              </div>
            </div>

            <div className="modal-footer">
              <button className="close-btn" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-icon"
              onClick={() => setShowAddModal(false)}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <h2>Add Category</h2>

            <div className="modal-content">
              <div className="detail-item">
                <span>Category Name</span>

                <input
                  type="text"
                  placeholder="Enter category name"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="detail-item">
                <span>Slug</span>

                <input
                  type="text"
                  placeholder="Enter slug"
                  value={newCategory.slug}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      slug: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="close-btn"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>

              <button className="add-category-btn" onClick={handleAddCategory}>
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-icon"
              onClick={() => setShowEditModal(false)}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <h2>Edit Category</h2>

            <div className="modal-content">
              <div className="detail-item">
                <span>Category Name</span>

                <input
                  type="text"
                  placeholder="Enter category name"
                  value={editCategory.name}
                  onChange={(e) =>
                    setEditCategory({
                      ...editCategory,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="detail-item">
                <span>Slug</span>

                <input
                  type="text"
                  placeholder="Enter slug"
                  value={editCategory.slug}
                  onChange={(e) =>
                    setEditCategory({
                      ...editCategory,
                      slug: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="close-btn"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>

              <button
                className="add-category-btn"
                onClick={handleUpdateCategory}
              >
                Update Category
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Categories;
