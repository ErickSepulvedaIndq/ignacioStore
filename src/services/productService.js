import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor para enviar JWT automáticamente
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/*PRODUCTOS*/

//Obtener todos los productos
export const getAllProducts = async (page = 1, limit = 10, includeBlocked = false) => {
  const response = await API.get("/products/", {
    params: { page, limit, includeBlocked }
  });
  console.log(response.data);
  return response.data.data;
};

// Obtener producto por ID
export const getProductById = async (id) => {
  const response = await API.get(`/products/${id}`);
  return response.data;
};

//Buscar producto por nombre
export const getProductByName = async (name, page = 1, limit = 10) => {
  const response = await API.get(`/products/search/${name}`, {
    params: { page, limit },
  });
  return response.data.data;
};

// Crear producto (con imagen opcional)
export const createProduct = async (productData) => {
  const formData = new FormData();

  formData.append("name", productData.name);
  formData.append("description", productData.description);
  formData.append("price", productData.price);
  formData.append("stock", productData.stock);
  formData.append("status", productData.status);
  formData.append("createdBy", productData.createdBy);

  if (productData.image) {
    formData.append("image", productData.image);
  }

  const response = await API.post("/products", formData);
  return response.data;
};

// Actualizar producto (con o sin imagen)
export const updateProduct = async (id, productData) => {
  const formData = new FormData();

  if (productData.name) formData.append("name", productData.name);
  if (productData.description) formData.append("description", productData.description);
  if (productData.price) formData.append("price", productData.price);
  if (productData.stock) formData.append("stock", productData.stock);
  if (productData.status) formData.append("status", productData.status);
  if (productData.updatedBy) formData.append("updatedBy", productData.updatedBy);

  if (productData.image) {
    formData.append("image", productData.image);
  }

  const response = await API.put(`/products/${id}`, formData);
  return response.data;
};

// Eliminar producto
export const deleteProduct = async (id, deletedBy) => {
  const response = await API.delete(`/products/${id}`, {
    data: { deletedBy },
  });
  return response.data;
};

export const buyProduct = async (products) => {
  const response = await API.post("/products/buy", { products })
  return response.data
}
