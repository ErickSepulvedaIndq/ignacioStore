import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/products",
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
export const getAllProducts = async () => {
  const response = await API.get("/", {
    params: {  }
  });
  console.log(response.data);
  return response.data.data;
};

// Obtener producto por ID
export const getProductById = async (id) => {
  const response = await API.get(`/${id}`);
  return response.data;
};

//Buscar producto por nombre
export const getProductByName = async (name) => {
  const response = await API.get(`/name/${name}`);
  return response.data;
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

  const response = await API.post("/", formData);
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

  const response = await API.put(`/${id}`, formData);
  return response.data;
};

// Eliminar producto
export const deleteProduct = async (id, deletedBy) => {
  const response = await API.delete(`/${id}`, {
    data: { deletedBy },
  });
  return response.data;
};

export const buyProduct = async (products) => {
  const response = await API.post("/buy", { products })
  return response.data
}
