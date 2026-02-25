import axios from "axios";

// Crear instancia de Axios para usuarios
const API_USERS = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/users`,
});

// Interceptor para enviar JWT automáticamente
API_USERS.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Obtener todos los usuarios con paginación
export const getAllUsers = async (page = 1, limit = 10) => {
  try {
    const response = await API_USERS.get("/", {
      params: { page, limit },
    });
    return response.data.data; // docs, totalPages, page, etc.
  } catch (error) {
      console.error("Error getAllUsers:", error);
    throw error;
  }
};

//Necesario para Dropdown de usuarios en purchaseHistory
export const getAllUsersNames = async () => {
  try {
    const response = await API_USERS.get("/names");
    return response.data.data;
  } catch (error) {
    console.error("Error getAllUsersNames:", error);
    throw error;
  }
};

// Obtener usuario por ID
export const getUserById = async (id) => {
  try {
    const response = await API_USERS.get(`/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error en getUserById:", error);
    throw error;
  }
};

// Crear nuevo usuario
export const createUser = async (userData) => {
  try {
    const response = await API_USERS.post("/", userData);
    return response.data;
  } catch (error) {
    console.error("Error en createUser:", error);
    throw error;
  }
};

// Actualizar usuario
export const updateUser = async (id, userData) => {
  try {
    const response = await API_USERS.put(`/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error en updateUser:", error);
    throw error;
  }
};

// Actualizar deuda del usuario (agregar monto a la deuda)
export const updateUserDebt = async (id, amount) => {
  try {
    const response = await API_USERS.put(`/${id}/add-debt`, { amount });
    return response.data;
  } catch (error) {
    console.error("Error en updateUserDebt:", error);
    throw error;
  }
};

// Restar deuda del usuario (cuando se cobra)
export const subtractUserDebtController = async (id, amount, subtractedBy) => {
  try {
    const response = await API_USERS.put(`/${id}/subtract-debt`, { amount, subtractedBy });
    return response.data;
  } catch (error) {
    console.error("Error en subtractUserDebtController:", error);
    throw error;
  }
};

// Eliminar usuario
export const deleteUser = async (id) => {
  try {
    const response = await API_USERS.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error en deleteUser:", error);
    throw error;
  }
};

