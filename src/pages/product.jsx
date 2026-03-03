import { useSearch } from '../context/SearchContext';
import Card from '../components/UI/card';
import { useState, useEffect, useCallback } from 'react';
import { getAllProducts, getProductByName } from '../services/productService';
import Loading from '../components/UI/Loading';
import Paginator from '../components/UI/Paginator';
import { useCart } from '../context/CartContext';

export default function Product() {
    // TODO: Fetch productos desde API
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); 
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

    const { getCartItems: fetchCartFromApi } = useCart();
    const { normalizedSearch } = useSearch();

    useEffect(() => {
        const loadCart = async () => {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                if (user?.userId) {
                    await fetchCartFromApi(user.userId);
                }
            }
        };
        loadCart();
        // El bucle ocurre porque fetchCartFromApi cambia en cada render si no es estable.
        // O porque el estado global del carrito cambia y provoca re-renders.
    }, []); // Quitamos fetchCartFromApi de las dependencias para romper el bucle
    const fetchProducts = useCallback(async (page = 1, searchTerm = "") => {
        try {
            setLoading(true);
            const response = searchTerm
                ? await getProductByName(searchTerm, page, pageSize)
                : await getAllProducts(page, pageSize);

            const docs = Array.isArray(response) ? response : (response?.docs || []);
            const responsePage = Array.isArray(response) ? 1 : (response?.page || page);
            const responseTotalPages = Array.isArray(response) ? 1 : (response?.totalPages || 1);

            setProductos(docs);
            setCurrentPage(responsePage);
            setTotalPages(responseTotalPages);
            setError(null);
        } catch (err) {
            setError("Error al cargar productos");
            setProductos([]);
            setTotalPages(1);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchProducts(1, normalizedSearch);
        }, 350);

        return () => clearTimeout(timeoutId);
    }, [normalizedSearch, fetchProducts]);

    const handlePageChange = (page) => {
        fetchProducts(page, normalizedSearch);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (loading) {
        return <Loading/>
    }

    if (error) {
        return <div className="p-10 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-1 text-gray-800">Comprar Productos</h1>

            <div className="flex flex-wrap items-center justify-center ">
            {productos.map((product) => (
                <Card
                    key={product._id}
                    productId={product._id}
                    productName={product.name}
                    description={product.description}
                    price={product.price}
                    img={product.image?.url}
                    stock={product.stock}
                />
            ))}

                {productos.length === 0 && (
                    <p className="text-gray-500 py-10">No se encontraron productos, verifique su texto de busqueda</p>
                )}
            </div>

            {totalPages > 1 && (
                <Paginator
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    loading={loading}
                />
            )}
        </div>
    );
}
