import { useSearch } from '../context/SearchContext';
import Card from '../components/UI/card';
import { useMemo, useState, useEffect } from 'react';
import { getAllProducts } from '../services/productService';
import Loading from '../components/UI/Loading';

export default function Product() {
    // TODO: Fetch productos desde API
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { normalizedSearch } = useSearch();
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getAllProducts();
                console.log("Productos cargados:", response);

                // Ajusta dependiendo de tu customResponse
                // Si tu backend responde { data: [...] }
                setProductos(response.docs || response);


            } catch (err) {
                setError("Error al cargar productos");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);
    const filteredProducts = useMemo(() => {
        if (!normalizedSearch) {
            return productos;
        }

        return productos.filter((product) =>
            `${product.name} ${product.id}`.toLowerCase().includes(normalizedSearch)
        );
    }, [productos, normalizedSearch]);

    if (loading) {
        return <Loading/>
    }

    if (error) {
        return <div className="p-10 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Productos</h1>

            <div className="flex flex-wrap items-center justify-center">
            {filteredProducts.map((product) => (
                <Card
                    key={product._id}
                    productId={product._id}
                    productName={product.name}
                    price={product.price}
                    img={product.image?.url}
                    stock={product.stock}
                />
            ))}

                {filteredProducts.length === 0 && (
                    <p className="text-gray-500 py-10">No se encontraron productos, verifique su texto de busqueda</p>
                )}
            </div>
        </div>
    );
}
