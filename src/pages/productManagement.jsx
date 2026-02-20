import RegisterProductForm from "../components/forms/RegisterProductForm";
import { getAllProducts } from "../services/productService";
import { useState, useEffect, useMemo } from "react";
import { useSearch } from "../context/SearchContext";
import Paginator from "../components/UI/Paginator";
import Loading from "../components/UI/Loading";
import ProductDetailsForm from "../components/forms/ProductDetailsForm";
import { ConfirmAction } from "../components/UI/ConfirmAction";
import { deleteProduct } from "../services/productService";
import Swal from "sweetalert2";


export default function ProductManagement() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); //create, edit, view
  const [selectedProductId, setSelectedProductId] = useState(null);

  const pageSize = 10;
  const { normalizedSearch } = useSearch();

    const handleCreateModal = () => {
    setModalMode("create");
    setSelectedProductId(null);
    setModalOpen(true);
  };

  const handleEditModal = (id) => {
    setModalMode("edit");
    setSelectedProductId(id);
    setModalOpen(true);
  };

  const handleViewModal = (id) => {
    setModalMode("view");
    setSelectedProductId(id);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    ConfirmAction({
      title: "Eliminar producto",
      text: "¿Estás seguro que deseas eliminar este producto?",
      icon: "warning",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      onConfirm: async () => {
        console.log("Eliminando producto con ID:", id);
        await deleteProduct(id);
        fetchProducts(currentPage);
        Swal.fire({
          icon: "success",
          title: "Producto eliminado",
        });
      },
    });
  };

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getAllProducts(page, pageSize); 
      
      const data = response?.docs || [];
      setProductos(data);
      setTotalPages(response?.totalPages || 1);
      setCurrentPage(response?.page || 1);
    } catch (error) {
      console.error("Error cargando productos:", error);
      setProductos([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };


  
  useEffect(() => {
    fetchProducts(1);
  }, []);

  // Filtrado según buscador
  const filteredProducts = useMemo(() => {
    if (!normalizedSearch) return productos || [];
    return (productos || []).filter((product) => {
      const textToSearch = `${product.name} ${product.price} ${product.stock} ${product.status}`.toLowerCase();
      return textToSearch.includes(normalizedSearch);
    });
  }, [productos, normalizedSearch]);
  

    console.log("Productos cargados:", productos);

  


  // cambia la pagina y sube al inicio
  const handlePageChange = (page) => {
    fetchProducts(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Administrar Productos
        </h1>
        <button 
        className="bg-[#3041A0] hover:bg-[#25327D] text-white px-6 py-2 rounded-lg font-semibold transition cursor-pointer hover:scale-105"
        onClick={handleCreateModal}                                                                             
        >
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
            {filteredProducts.map((producto) => (
              <tr key={producto._id} className="hover:bg-gray-50">
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
                      producto.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {producto.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    className="text-[#3041A0] hover:text-[#25327D] mr-3 hover:scale-110 transition-transform cursor-pointer"
                    aria-label="Edit product"
                    title="Edit product"
                    onClick={() => handleEditModal(producto._id)}
                  >
                    <i className="pi pi-pencil"></i>
                  </button>
                  <button
                    className="text-[#3041A0] hover:text-[#25327D] mr-3 hover:scale-110 transition-transform cursor-pointer"
                    aria-label="View product"
                    title="View product"
                    onClick={() => handleViewModal(producto._id)}
                  >
                    <i className="pi pi-eye"></i>
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 cursor-pointer hover:scale-110 transition-transform"
                    aria-label="Delete product"
                    title="Delete product"
                    onClick={() => handleDelete(producto._id)}
                  >
                    <i className="pi pi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
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

      {/*Formulario para crear*/}
      <RegisterProductForm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => fetchProducts(currentPage)}
      />

      {/*Formulario para editar/ver*/}
      {(modalMode === "edit" || modalMode === "view") && (
        <ProductDetailsForm
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={() => fetchProducts(currentPage)}
          productId={selectedProductId}
          mode={modalMode} // edit o view
        />
      )}
    </div>
  );
}
