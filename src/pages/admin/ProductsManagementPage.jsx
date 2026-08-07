import { useState } from "react";
import { ConfirmAction } from "../../components/UI/ConfirmAction";
import { useDeleteProduct, useProducts } from "../../api/hooks/productsHooks";
import toast from "react-hot-toast";
import Paginator from "../../components/UI/Paginator";
import ProductFormModal from "../../components/forms/ProductFormModal";
import LoadingComponent from "../../components/UI/LoadingComponent";
import ErrorComponent from "../../components/UI/ErrorComponent";
import ProductImageComponent from "../../components/UI/ProductImageComponent";
import FiltersComponent from "../../components/forms/FiltersComponent";

export default function ProductsManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: products, isLoading, isError, refetch } = useProducts(currentPage, 10, true);
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
      text: "¿Está seguro que desea eliminar este producto?",
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

  return (
    <div className="flex flex-col w-full h-full gap-2">

      <FiltersComponent
        onApply={() => { }}
        button={true}
        buttonContent={
          <div className="flex flex-row justify-center items-center gap-2 w-35">
            <i className="pi pi-box"></i>
            <p>Crear producto</p>
          </div>
        }
        buttonOnClick={() => handleOpenModal('create', null)}
      />

      <div className="bg-white rounded-lg h-full shadow w-full overflow-hidden">
        <div className="overflow-auto w-full h-full">
          {isLoading ? <LoadingComponent /> : isError ? <ErrorComponent refetch={refetch} /> : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-900 text-white sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-center text-xs font-bold uppercase">
                    Imagen
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider ">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products?.docs?.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 flex justify-center items-center">
                      <ProductImageComponent iconStyle={'text-xl'} size={'h-12 w-12 border-0!'} image={product?.image?.url} />
                    </td>

                    <td className="px-4 py-4 text-sm font-medium text-gray-900 text-center max-w-25">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center ">
                      <span
                        className={`${product.stock < 10 ? "text-red-600 font-semibold" : ""
                          }`}
                      >
                        {product.stock} uds.
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${product.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {product.status === "active" ? "ACTIVO" : "INACTIVO"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                      <button
                        className="text-blue-800 mr-3 cursor-pointer hover:scale-140
                                  transform transition-all duration-200 ease-in-out"
                        aria-label="View product"
                        title="Ver producto"
                        onClick={() => handleOpenModal("view", product)}
                      >
                        <i className="pi pi-eye text-base md:text-sm"></i>
                      </button>
                      <button
                        className={`text-blue-800 mr-3 cursor-pointer hover:scale-140
                                  transform transition-all duration-200 ease-in-out`}
                        aria-label="Edit product"
                        title="Editar producto"
                        onClick={() => handleOpenModal("edit", product)}
                      >
                        <i className="pi pi-pencil text-base md:text-sm"></i>
                      </button>
                      <button
                        className={`text-red-600 hover:text-red-800 cursor-pointer hover:scale-140
                                  transform transition-all duration-200 ease-in-out`}
                        aria-label="Delete product"
                        title="Eliminar producto"
                        onClick={() => handleDelete(product._id)}
                      >
                        <i className="pi pi-trash text-base md:text-sm"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
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
