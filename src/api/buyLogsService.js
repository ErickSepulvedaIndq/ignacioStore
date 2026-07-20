import axios from "axios";

const API_BUY_LOGS = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/buylogs`,
});

API_BUY_LOGS.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Obtener compras por ID de usuario con paginación y filtros de fecha
export const getBuyLogsByUserId = async (userId, page = 1, limit = 10, from = "", to = "") => {
    try {
        const response = await API_BUY_LOGS.get(`/user/${userId}`, {
            params: { page, limit, from, to },
        });
        // console.log("Response from getBuyLogsByUserId:", response);
        return response.data;
    } catch (error) {
        console.error("Error getBuyLogsByUserId:", error);
        throw error;
    }
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
        console.error("Error en createBuyLog:", error);
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