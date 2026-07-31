import { useState } from 'react';
import Loading from '../../components/UI/Loading';
import Paginator from '../../components/UI/Paginator';
import { useProducts } from '../../api/hooks/productsHooks';
import ProductCard from '../../components/UI/ProductCard';

export default function ProductsPage() {

    const [currentPage, setCurrentPage] = useState(1)
    const { data: products, isLoading, isError } = useProducts(currentPage, 10, false);

    if (isLoading) {
        return <Loading />
    }

    if (isError) {
        return <div className="p-10 text-center text-gray-500">Error al cargar los productos. Por favor, recargue la página o inténtelo de nuevo más tarde.</div>;
    }

    return (
        <div className="flex flex-1 flex-col gap-4">

            {/* Filtros para los productos */}
            <div className=' w-full p-2 rounded-xl shadow-custom'>
                <h1 className='text-gray-500 font-bold ml-1 mb-2'>Filtros</h1>
                <div className='w-full relative'>
                    <input type="text" placeholder='Buscar...' className='inset-shadow-custom bg-gray-100 w-full rounded-lg pl-8 pr-2 py-2' />
                    <i className='absolute text-gray-500 pi pi-search left-2 top-3'></i>
                </div>
            </div>

            <div className="grid p-4 bg-white shadow-custom flex-1 overflow-scroll rounded-xl gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {products?.docs?.map((product) => (
                    <ProductCard
                        key={product._id}
                        product={product}
                    />
                    // <div key={product._id} className='bg-amber-300 w-full h-50'> hola</div>
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
