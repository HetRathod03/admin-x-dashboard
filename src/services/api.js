const BASE_URL = "https://dummyjson.com";

// ================= Products =================

export async function getProducts(limit = 194, skip = 0) {
  try {

    const response = await fetch(
      `${BASE_URL}/products?limit=${limit}&skip=${skip}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products.");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
}

export async function getProduct(id) {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch product.");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
}

export async function searchProducts(search) {
  try {
    const response = await fetch(
      `${BASE_URL}/products/search?q=${search}`
    );

    if (!response.ok) {
      throw new Error("Search failed.");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
}

// ================= Categories =================

export async function getCategories() {
  try {
    const response = await fetch(
      `${BASE_URL}/products/categories`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch categories.");
    }

    const data = await response.json();


    return data;
  } catch (error) {
    throw error;
  }
}

export async function getCategoryProducts(category) {
  try {
    const response = await fetch(
      `${BASE_URL}/products/category/${category}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch category products.");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
}

// ================= Users =================

export async function getUsers(limit = 30) {
  try {
    const response = await fetch(
      `${BASE_URL}/users?limit=${limit}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch users.");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
}

// ================= Add Product =================

export async function addProduct(product) {
  try {
    const response = await fetch(`${BASE_URL}/products/add`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error("Failed to add product.");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
}

// ================= Delete Product =================

export async function deleteProduct(id) {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete product.");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
}

// ================= Update Product =================

export async function updateProduct(id, product) {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error("Failed to update product.");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
}

// ================= Orders =================

export async function getOrders(limit = 250) {
  try {
    const response = await fetch(
      `${BASE_URL}/carts?limit=${limit}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch orders.");
    }

    const data = await response.json();

    return {
      orders: data.carts,
    };
  } catch (error) {
    throw error;
  }
}
//=================== Login ==================

export async function loginUser(username, password) {

  const res = await fetch("https://dummyjson.com/auth/login", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      username,
      password,
      expiresInMins: 60,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login Failed");
  }

  return data;
}