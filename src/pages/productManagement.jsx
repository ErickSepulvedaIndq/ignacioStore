import { useState } from "react";
import Paginator from "../components/UI/Paginator";
import Loading from "../components/UI/Loading";
import ProductFormModal from "../components/forms/ProductFormModal";
import { ConfirmAction } from "../components/UI/ConfirmAction";
import Swal from "sweetalert2";
import { useDeleteProduct, useProducts } from "../api/hooks/productsHooks";
import toast from "react-hot-toast";

export default function ProductManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  // const { normalizedSearch } = useSearch();
  const { data: products, isLoading } = useProducts(currentPage, 10, false);
  const { mutateAsync: deleteProduct } = useDeleteProduct();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [product, setProduct] = useState(null);

  const handleOpenModal = (mode, product) => {
    setModalOpen(true);
    setModalMode(mode);
    setProduct(product);
  }

  const handleDelete = async (id) => {
    ConfirmAction({
      title: "Eliminar producto",
      text: "¿Estás seguro que deseas eliminar este producto?",
      icon: "warning",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      onConfirm: async () => {
        toast.promise(
          deleteProduct({ id }),
          {
            loading: 'Eliminando...',
            success: <b>Producto eliminado correctamente!</b>,
            error: (err) => {
              console.error(err);
              return <b>Error al eliminar producto.</b>
            }
          }
        );
      },
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-6 pb-0 mb-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Administrar Productos
        </h1>
        <button
          className="bg-[#3041A0] hover:bg-[#25327D] text-white px-6 py-2 rounded-lg font-semibold transition cursor-pointer hover:scale-105"
          onClick={() => handleOpenModal("create")}
        >
          + Nuevo Producto
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden h-[67vh]">
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
            {products?.docs?.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span
                    className={`${product.stock < 10 ? "text-red-600 font-semibold" : ""
                      }`}
                  >
                    {product.stock} unidades
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${product.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                      }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    className="text-[#3041A0] hover:text-[#25327D] mr-3 hover:scale-110 transition-transform cursor-pointer"
                    aria-label="Edit product"
                    title="Edit product"
                    onClick={() => handleOpenModal("edit", product)}
                  >
                    <i className="pi pi-pencil"></i>
                  </button>
                  <button
                    className="text-[#3041A0] hover:text-[#25327D] mr-3 hover:scale-110 transition-transform cursor-pointer"
                    aria-label="View product"
                    title="View product"
                    onClick={() => handleOpenModal("view", product)}
                  >
                    <i className="pi pi-eye"></i>
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 cursor-pointer hover:scale-110 transition-transform"
                    aria-label="Delete product"
                    title="Delete product"
                    onClick={() => handleDelete(product._id)}
                  >
                    <i className="pi pi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
            {/* {filteredProducts.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  No se encontraron productos
                </td>
              </tr>
            )} */}
          </tbody>
        </table>
      </div>

      <Paginator
        currentPage={currentPage}
        totalPages={products?.totalPages}
        onPageChange={(p) => setCurrentPage(p)}
        loading={isLoading}
      />

      {/*Formulario para editar/ver*/}
      <ProductFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        product={product}
        mode={modalMode}
      />
    </div>
  );
}
