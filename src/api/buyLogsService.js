import axios from "axios";

// Obtener compras del usuario autenticado
export const getBuyLogsByUserId = async (userId, page = 1, limit = 10, from = "", to = "") => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/buylogs/user/${userId}`,
        {
            params: {
                page,
                limit,
                from,
                to,
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
    try {
        const token = localStorage.getItem("token");
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/buylogs`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error createBuyLog:", error);
        throw error;
    }
};

export const getPendingBuyLogs = async (page = 1, limit = 10, from = "", to = "") => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/buylogs/debtors`,
        {
            params: {
                page,
                limit,
                from,
                to,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return res.data;
};

export const markBuyLogAsPaid = async (buyLogId) => {
    const token = localStorage.getItem("token");
    const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/buylogs/${buyLogId}/pay`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return res.data;
};