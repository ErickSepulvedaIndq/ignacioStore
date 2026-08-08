import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { API } from "../apiConfig";

// Hook para obtener todas las compras
export const usePurchases = (page, limit, from, to) => {
    return useQuery({
        queryKey: ['purchases', page, limit, from, to],
        queryFn: async () => {
            const response = await API.get("/purchasedHistory/", {
                params: { page, limit, from, to },
            });
            return response.data.data;
        },
        placeholderData: keepPreviousData,
    })
}

// Hook para obtener todas las compras de un usuario por su id  
export function usePurchasesByUser(userId, page, limit, from, to, options = {}) {
    return useQuery({
        queryKey: ["purchases", "byUser", userId, page, limit, from, to],
        queryFn: async () => {
            const response = await API.get(`/purchasedHistory/user/${userId}`, {
                params: { page, limit, from, to },
            });
            return response.data.data;
        },
        enabled: !!userId && (options.enabled ?? true),
        ...options,
        placeholderData: keepPreviousData,
    });
}
