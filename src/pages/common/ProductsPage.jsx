import { useState } from 'react';
import LoadingComponent from '../../components/UI/LoadingComponent';
import Paginator from '../../components/UI/Paginator';
import { useProducts } from '../../api/hooks/productsHooks';
import ProductCard from '../../components/UI/ProductCard';
import ErrorComponent from '../../components/UI/ErrorComponent';
import FiltersComponent from '../../components/forms/FiltersComponent';
import { useDebounce } from '../../api/hooks/useDebounce';

export default function ProductsPage() {
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState("")
    const [stockStatus, setStockStatus] = useState("all")
    const debouncedSearch = useDebounce(search, 400)

    const { data: products, isLoading, isError, refetch } = useProducts({
        page: currentPage,
        limit: 10,
        status: 'active',
        search: debouncedSearch,
        stockStatus,
    });

    const handleFilter = (state, search) => {
        setCurrentPage(1)
        setSearch(search)
        setStockStatus(state)
    }

    return (
        <div className="flex flex-1 flex-col gap-2">

            {/* Filtros para los productos */}
            <FiltersComponent
                stateFilter={true}
                stateOptions={[
                    { value: "all", label: "Todos los estados" },
                    { value: "available", label: "Disponibles" },
                    { value: "soldOut", label: "Agotados" },
                    { value: "last", label: "Ultima" },
                ]}
                onApply={(f, t, u, state, search) => { handleFilter(state, search) }}
            />

            {isLoading ? <LoadingComponent /> : isError ? <ErrorComponent refetch={refetch} /> : (
                <div className="grid p-4 bg-white shadow-custom flex-1 overflow-scroll rounded-xl gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
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
            )}

            {products?.totalPages > 1 && (
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
