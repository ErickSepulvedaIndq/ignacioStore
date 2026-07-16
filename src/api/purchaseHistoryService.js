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

import { API } from "./apiConfig";

export const getAllPurchase = async (page = 1, limit = 10, from = "", to = "") => {
  try {
    const response = await API.get("/purchasedHistory/", {
      params: { page, limit, from, to },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error getAllPurchasedHistory:", error);
    throw error;
  }
};

export const getPurchasedByUserId = async (userId, page = 1, limit = 10, from = "", to = "") => {
  try {
    const response = await API.get(`/purchasedHistory/user/${userId}`, {
      params: { page, limit, from, to },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error getPurchasedByIdUser:", error);
    throw error;
  }
};
