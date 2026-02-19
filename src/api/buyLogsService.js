import axios from "axios";

// Obtener compras del usuario autenticado
export const getBuyLogsByUserId = async (userId, page = 1, limit = 10) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/buylogs/user/${userId}`,
        {
            params: {
                page,
                limit,
            },
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