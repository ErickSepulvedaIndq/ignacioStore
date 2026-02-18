import { useState, useEffect, useMemo } from "react";
import { useSearch } from "../context/SearchContext";
import Paginator from "../components/UI/Paginator";
import { productDemoRows } from "../models/product";

export default function ProductManagement() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const { normalizedSearch } = useSearch();

  useEffect(() => {
    // TODO: Fetch productos desde API
    setTimeout(() => {
      setProductos(productDemoRows);
      setLoading(false);
      setCurrentPage(1);
    }, 500);
  }, []);

  // filtra segun lo que se escribe en el buscador
  const filteredProducts = useMemo(() => {
    if (!normalizedSearch) {
      return productos;
    }

    return productos.filter((product) => {
      const textToSearch = `${product.name} ${product.price} ${product.stock} ${product.status}`.toLowerCase();
      return textToSearch.includes(normalizedSearch);
    });
  }, [productos, normalizedSearch]);

  // calcula las paginas disponibles
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  // define el rango de datos de la pagina actual
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // cambia la pagina y sube al inicio
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-500">Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Administrar Productos
        </h1>
        <button className="bg-[#3041A0] hover:bg-[#25327D] text-white px-6 py-2 rounded-lg font-semibold transition">
          + Nuevo Producto
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#3041A0] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedProducts.map((producto) => (
              <tr key={producto.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {producto.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${producto.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span
                    className={`${
                      producto.stock < 10 ? "text-red-600 font-semibold" : ""
                    }`}
                  >
                    {producto.stock} unidades
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      producto.status === "activo"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {producto.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    className="text-[#3041A0] hover:text-[#25327D] mr-3"
                    aria-label="Edit product"
                    title="Edit product"
                  >
                    <i className="pi pi-pencil"></i>
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    aria-label="Deactivate product"
                    title="Deactivate product"
                  >
                    <i className="pi pi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
            {paginatedProducts.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  No se encontraron productos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Paginator
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        loading={loading}
      />
    </div>
  );
}
