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
        },
        enabled: !!userId,
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
        queryKey: ['buyLogs', page, limit, from, to],
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
        mutationFn: async ({ userId, buyLogId, amount }) => {
            const response = await API.patch(`/buyLogs/${buyLogId}/pay`, { amount: amount, userId: userId });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['buyLogs'])
            queryClient.invalidateQueries(['users'])
        }
    })
}

// Hook para marcar deuda total como pagada
export const useMarkTotalDebtAsPaid = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ userId }) => {
            const response = await API.patch(`/buyLogs/total/${userId}/pay`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['buyLogs'])
            queryClient.invalidateQueries(['users'])
        }
    })
}

export const useGenerateReport = () => {
    return useMutation({
        mutationFn: async ({ month, year }) => {
            const response = await API.get(`/buylogs/reports/monthly/${month}/${year}`, { responseType: "blob" });
            return response;
        }
    })
}

