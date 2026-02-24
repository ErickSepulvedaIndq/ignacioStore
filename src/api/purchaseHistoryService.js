import axios from "axios";

export const getPurchaseHistory = async (page = 1, limit = 10, from = "", to = "") => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/purchase-history`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                page,
                limit,
                from,
                to
            }
        }
    );
    return res.data;
};