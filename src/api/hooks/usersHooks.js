import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { API } from "../apiConfig";


// Hook para obtener todos los usuarios
export const useUsers = ({ page = 1, limit = 10, status, search, role, debt }) => {
    return useQuery({
        queryKey: ['users', page, limit, status, search, role, debt],
        queryFn: async ({ signal }) => {
            const response = await API.get("/users", {
                params: { page, limit, status, search, role, debt },
                signal
            });
            return response.data.data;
        },
        placeholderData: keepPreviousData,
    })
}

// Hook para obtener todos los nombres de los usuarios 
export const useUsersNames = () => {
    return useQuery({
        queryKey: ['usersNames'],
        queryFn: async () => {
            const response = await API.get("/users/names");
            return response.data.data;
        },
        placeholderData: keepPreviousData,
    })
}

// Hook para obtener un usuario por su id
export const useUser = (userId) => {
    return useQuery({
        queryKey: ['users', userId],
        queryFn: async () => {
            const response = await API.get(`/users/${userId}`);
            return response.data.data;
        },
        enabled: !!userId,
        placeholderData: keepPreviousData,
    })
}

// Hook para crear un nuevo usuario
export const useCreateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ userData }) => {
            const response = await API.post("/users", userData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
        }
    })
}

// Hook para actualizar usuario
export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ userId, userData }) => {
            const response = await API.put(`users/${userId}`, userData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
        }
    })
}

// Hook para actualizar deuda del usuario
export const useUpdateUserDebt = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ userId, amount, subtractedBy }) => {
            const response = await API.put(`/${userId}/subtract-debt`, { amount, subtractedBy });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
        }
    })
}

// Hook para eliminar usuario
export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ userId }) => {
            const response = await API.delete(`/users/${userId}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
        }
    })
}

// Hook para actualizar contraseña 
export const useChangePassword = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ userId, data }) => {
            const response = await API.patch(`/users/changePassword/${userId}`, data)
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['users'])
        }
    })
}

// Hook para cambiar la foto de perfil
export const useChangeProfilePhoto = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, userPhoto }) => {
            const formData = new FormData();
            formData.append("userPhoto", userPhoto);

            const response = await API.patch(`/users/${userId}/profile-photo`, formData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
        }
    });
};
