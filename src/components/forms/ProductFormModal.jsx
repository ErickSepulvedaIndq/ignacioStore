import { useCreateProduct, useUpdateProduct } from "../../api/hooks/productsHooks";
import { Field, Form, Formik } from "formik";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function ProductFormModal({
  isOpen,
  onClose,
  product,
  mode = "edit",
}) {
  const { mutateAsync: updateProduct } = useUpdateProduct();
  const { mutateAsync: createProduct } = useCreateProduct();
  const { user } = useAuth();

  const formData = {
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    stock: product?.stock || "",
    status: product?.status || "active",
    image: product?.image?.url || null,
  }

  const handleSubmit = async (values) => {
    if (mode === "create") {
      toast.promise(
        createProduct({ productData: values, createdBy: user.userId }),
        {
          loading: 'Creando producto..',
          success: 'Producto creado exitosamente!',
          error: (err) => {
            console.error(err);
            return 'Error al crear producto, intente más tarde.'
          }
        }
      )
    } else {
      toast.promise(
        updateProduct({ id: product?._id, productData: values }),
        {
          loading: 'Editando producto...',
          success: 'Producto editado correctamente!',
          error: (err) => {
            console.error(err);
            return 'Error al editar producto, intente más tarde.'
          }
        }
      )
    }
    onClose()
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-gray-100 rounded-2xl shadow-2xl w-full max-w-3xl p-10 relative animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-[#3041A0]">
            {mode === "edit" ? "Editar Producto" : "Ver Producto"}
          </h2>
          <button
            className="text-gray-500 text-xl cursor-pointer hover:scale-110 transition-transform duration-300 hover:text-red-600"
            onClick={() => {
              onClose();
            }}
          >
            ✕
          </button>
        </div>
        <Formik
          initialValues={formData}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue }) => (

            <Form className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre
                </label>
                <Field
                  type="text"
                  name="name"
                  id="name"
                  disabled={mode === "view"}
                  className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripción
                </label>
                <Field
                  id="description"
                  name="description"
                  as="textarea"
                  rows={4}
                  disabled={mode === "view"}
                  className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition disabled:bg-gray-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Precio
                  </label>
                  <Field
                    type="number"
                    name="price"
                    id="price"
                    required
                    disabled={mode === "view"}
                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Stock
                  </label>
                  <Field
                    type="number"
                    id="stock"
                    name="stock"
                    required
                    disabled={mode === "view"}
                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Estado
                </label>
                <Field
                  id="status"
                  name="status"
                  as="select"
                  disabled={mode === "view"}
                  className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 focus:border-indigo-500 focus:ring-2 cursor-pointer focus:ring-indigo-200 transition disabled:bg-gray-100"
                >
                  <option value="active">Activo</option>
                  <option value="blocked">Bloqueado</option>
                </Field>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Imagen
                </label>

                {values.image && (
                  <img
                    src={
                      typeof values.image === "string"
                        ? values.image
                        : URL.createObjectURL(values.image)
                    }
                    alt="Preview"
                    className="w-40 h-40 object-cover rounded-lg mb-4 border-2 border-gray-300"
                  />
                )}

                <input
                  type="file"
                  name="image"
                  onChange={(e) => setFieldValue("image", e.target.files[0])}
                  disabled={mode === "view"}
                  className="w-full rounded-lg border-2 border-dashed border-gray-400 bg-white px-4 py-3 cursor-pointer hover:border-indigo-500 transition disabled:cursor-not-allowed disabled:bg-gray-100"
                />
              </div>

              {mode !== "view" && (
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-medium cursor-pointer"
                    onClick={onClose}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-[#3041A0] text-white rounded-lg hover:bg-[#2b3b92] font-semibold shadow-md cursor-pointer disabled:bg-gray-500 disabled:cursor-not-allowed"
                  >
                    Guardar
                  </button>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
