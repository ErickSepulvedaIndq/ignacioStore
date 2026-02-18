import { useSearch } from '../context/SearchContext';
import Product1 from '../assets/doritos-nachos.png';
import Card from '../components/UI/card';
import { useMemo } from 'react';

// necesitamos traer la informacion de la API para poder plasmarla aqui
// por mientras pues se llena automaticamente
const productsTest = Array.from({ length: 10 }).map((_, i) => ({
    id: `product-${i}`,
    name: `Producto ${i + 1}`,
    price: ((i * 13.2) % 100 + 20).toFixed(2),
    img: Product1,
}));

export default function Product() {
    // TODO: Fetch productos desde API
    const productos = productsTest;
    const { normalizedSearch } = useSearch();

    const filteredProducts = useMemo(() => {
        if (!normalizedSearch) {
            return productos;
        }

        return productos.filter((product) =>
            `${product.name} ${product.id}`.toLowerCase().includes(normalizedSearch)
        );
    }, [productos, normalizedSearch]);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Productos</h1>

            <div className="flex flex-wrap items-center justify-center">
                {filteredProducts.map((product) => (
                    <Card
                        key={product.id}
                        productId={product.id}
                        productName={product.name}
                        price={product.price}
                        img={product.img}
                    />
                ))}

                {filteredProducts.length === 0 && (
                    <p className="text-gray-500 py-10">No se encontraron productos, verifique su texto de busqueda</p>
                )}
            </div>
        </div>
    );
}
