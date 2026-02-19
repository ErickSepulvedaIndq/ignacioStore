/**
 * 
 * CAMBIOS REALIZADOS:
 *  getBuyLogsByUserId(userId): Obtiene TODAS las compras de un usuario específico
 *    - Endpoint: GET /api/buylogs/user/:userId
 *    - Requiere: token de autenticación en headers
 *    - Devuelve: array de objetos con { id_user, products, createdAt, updatedAt, _id }
 *    - UTILIZADO EN: pages/purchase.jsx
 * 
 *  createBuyLog(data): Crea un nuevo registro de compra
 *    - Endpoint: POST /api/buylogs
 *    - Body esperado: { id_user, products: [{ id, name, price }] }
 *    - Requiere: token de autenticación
 * 
 * ESTRUCTURA DE RESPUESTA DE getBuyLogsByUserId:
 * {
 *   "success": true,
 *   "error": false,
 *   "message": "Registros de compras obtenidos exitosamente",
 *   "data": [
 *     {
 *       "_id": "...",
 *       "id_user": "...",
 *       "products": [
 *         { "id": "...", "name": "Coca Cola 600ml", "price": 20 },
 *         { "id": "...", "name": "Sabritas Original", "price": 18 }
 *       ],
 *       "createdAt": "2026-02-19T10:30:00Z",
 *       "updatedAt": "2026-02-19T10:30:00Z"
 *     }
 *   ]
 * }
 * 
 * Archivo: src/api/buyLogsService.js
 */

import axios from "axios";

// Obtener compras del usuario autenticado
export const getBuyLogsByUserId = async (userId) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/buylogs/user/${userId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return res.data;
};

// Crear un registro de compra
export const createBuyLog = async (data) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/buylogs`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};