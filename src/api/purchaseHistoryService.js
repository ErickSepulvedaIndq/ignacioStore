/*
EndPoints manejados para el historial de compras:
   - Endpoint: GET /users/names
Obtener datos de las compras de todos los usuarios
   - GET ALL USERS_PURCHASES
   - Endpoint: GET /purchase-history/
      debo mandar el rango de fechas y nomas 

   - GET USERS_PURCHASES By ID
   - Endpoint: GET /purchase-history/
        debo mandar el rango de fechas y el id del user
*/

import axios from "axios";

const API_PURCHASE_HISTORY = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/purchase-history`,
});

API_PURCHASE_HISTORY.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Obtener todas las compras con paginación
export const getAllPurchase = async (page = 1, limit = 10, from = "", to = "") => {
  try {
    const response = await API_PURCHASE_HISTORY.get("/", {
      params: { page, limit, from, to },
    });
    return response.data.data; // docs, totalPages, page, etc.
  } catch (error) {
    console.error("Error getAllPurchaseHistory:", error);
    throw error;
  }
};

export const getPurchasedByUserId = async (userId, page = 1, limit = 10, from = "", to = "") => {
  try {
    const response = await API_PURCHASE_HISTORY.get(`/user/${userId}`, {
      params: { page, limit, from, to },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error getPurchasedByIdUser:", error);
    throw error;
  }
};
