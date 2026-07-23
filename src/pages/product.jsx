import ProductCard from '../components/UI/ProductCard';
import { useState } from 'react';
import Loading from '../components/UI/Loading';
import Paginator from '../components/UI/Paginator';
import { useProducts } from '../api/hooks/productsHooks';

export default function Product() {
    // const { normalizedSearch } = useSearch();
    const [currentPage, setCurrentPage] = useState(1)
    const { data: products, isLoading, isError } = useProducts(currentPage, 10, false);

    if (isLoading) {
        return <Loading />
    }

    if (isError) {
        return <div className="p-10 text-center text-gray-500">Error al cargar los productos. Por favor, recargue la página o inténtelo de nuevo más tarde.</div>;
    }

    return (
        <div className="mx-auto">
            <h1 className="text-3xl font-bold mb-1 1sticky text-gray-800">Comprar Productos</h1>
            <div className="flex py-4 pb-10 bg-gray-100 rounded gap-5 flex-wrap items-center justify-center overflow-scroll h-[77vh]">
                {products?.docs?.map((product) => (
                    <ProductCard
                        key={product._id}
                        product={product}
                    />
                ))}

                {products?.docs?.length === 0 && (
                    <p className="text-gray-500 py-10">No se encontraron productos, verifique su texto de búsqueda.</p>
                )}
            </div>

            {products.totalPages > 1 && (
                <Paginator
                    currentPage={products?.page}
                    totalPages={products?.totalPages}
                    onPageChange={(v) => setCurrentPage(v)}
                    loading={isLoading}
                />
            )}
        </div>
    );
}
