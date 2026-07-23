import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "../apiConfig";

// Hook para obtener todos los productos
export const useProducts = (page = 1, limit = 10, includeBlocked = false) => {
    return useQuery({
        queryKey: ['products', page],
        queryFn: async () => {
            const response = await API.get('/products', {
                params: { page, limit, includeBlocked }
            });
            return response.data.data;
        }
    })
}

// Hook para obtener un producto por id
export const useProduct = (id) => {
    return useQuery({
        queryKey: ['products', id],
        queryFn: async () => {
            const response = await API.get(`/products/${id}`);
            return response.data;
        }
    })
}

// Hook para buscar producto por nombre
export const useSearchProductByName = (name, page = 1, limit = 10) => {
    return useQuery({
        queryKey: ['products', name],
        queryFn: async () => {
            const response = await API.get(`/products/search/${name}`, {
                params: { page, limit },
            });
            return response.data.data;
        }
    })
}

// Hook para crear producto (con imagen opcional)
export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ productData, createdBy }) => {
            const formData = new FormData();

            formData.append("name", productData.name);
            formData.append("description", productData.description);
            formData.append("price", productData.price);
            formData.append("stock", productData.stock);
            formData.append("status", productData.status);
            formData.append("createdBy", createdBy);

            if (productData.image) {
                formData.append("image", productData.image);
            }

            const response = await API.post("/products", formData);
            return response.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] })
    })
}

// Hook para actualizar producto (con imagen opcional)
export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, productData }) => {
            const formData = new FormData();

            if (productData.name) formData.append("name", productData.name);
            if (productData.description) formData.append("description", productData.description);
            if (productData.price) formData.append("price", productData.price);
            if (productData.stock) formData.append("stock", productData.stock);
            if (productData.status) formData.append("status", productData.status);
            if (productData.updatedBy) formData.append("updatedBy", productData.updatedBy);

            if (productData.image) {
                formData.append("image", productData.image);
            }

            const response = await API.put(`/products/${id}`, formData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        }
    })
}

// Hook para borrar productor por id
export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, deletedBy }) => {
            const response = await API.delete(`/products/${id}`, {
                data: { deletedBy },
            });
            return response.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] })
    })
}

// Hook para comprar productos
export const useBuyProducts = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ products }) => {
            const response = await API.post("/products/buy", { products })
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        }
    })
}

// Hook para obtener los productos del carrito por id del usuario
export const useGetCartProducts = (userId) => {
    return useQuery({
        queryKey: ['cart'],
        queryFn: async () => {
            const response = await API.get(`/products/getCartProducts/${userId}`)
            return response.data
        }
    })
}

// Hook para añadir productos al carrito
export const useAddProductsToCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ productId, quantity, userId }) => {
            const response = await API.post("/products/addToCart", { productId, quantity, userId })
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        }
    })
}

// Hook para remover productos del carrito
export const useRemoveProductsFromCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ userId, productId, quantity }) => {
            const response = await API.post("/products/deleteFromCart", { userId, productId, quantity })
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        }
    })
}