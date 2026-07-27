import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "../apiConfig";


// Hook para obtener todas las compras por el id del usuario
export const useBuyLogs = (userId, page = 1, limit = 10, from = "", to = "") => {
    return useQuery({
        queryKey: ['buyLogs', userId, page, limit, from, to],
        queryFn: async () => {
            const response = await API.get(`/buyLogs/user/${userId}`, {
                params: { page, limit, from, to },
            })
            return response.data;
        }
    })
}

// Hook para crear un registro de compra
export const useCreateBuyLog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const response = await API.post(`/buyLogs`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.removeQueries(['buyLogs']);
        }
    })
}

// Hook para obtener los deudores
export const usePendingBuyLogs = (page = 1, limit = 10, from = "", to = "") => {
    return useQuery({
        queryKey: ['buyLogs'],
        queryFn: async () => {
            const response = await API.get('/buyLogs/debtors',
                { params: { page, limit, from, to, } }
            )
            return response.data;
        }
    })
}

// Hook para marcar deuda como pagada
export const useMarkBuyLogAsPaid = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ buyLogId }) => {
            const response = await API.patch(`/buyLogs/${buyLogId}/pay`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['buyLogs'])
        }
    })
}

