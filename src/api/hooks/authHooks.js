import { useMutation } from "@tanstack/react-query";
import { API } from "../apiConfig";

export const useAuthLogin = () => {
    return useMutation({
        mutationFn: async ({ data }) => {
            const res = await API.post(`/auth/login`, data)
            return res.data
        }
    })
}