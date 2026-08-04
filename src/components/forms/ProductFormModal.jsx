import { useCreateProduct, useUpdateProduct } from "../../api/hooks/productsHooks";
import { Form, Formik } from "formik";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import ModalComponent from "../modals/ModalComponent";
import ProductImageComponent from "../UI/ProductImageComponent";
import CustomButtonComponent from "../UI/CustomButtonComponent";
import { useRef } from "react";
import CustomInputComponent from "../UI/inputs/CustomInputComponent";

export default function ProductFormModal({
  isOpen,
  onClose,
  product,
  mode = "edit",
}) {
  const { mutateAsync: updateProduct } = useUpdateProduct();
  const { mutateAsync: createProduct } = useCreateProduct();
  const fileInputRef = useRef(null);
  const { user } = useAuth();

  const formData = {
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    stock: product?.stock || "",
    status: product?.status || "active",
    image: product?.image?.url || null,
  }

  console.log(mode)

  const handleSubmit = async (values) => {
    console.log(values)
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

  return (
    <ModalComponent
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "edit" ? "Editar producto" : mode === "view" ? "Ver producto" : "Crear producto"}
      iconStyles={mode === "edit" ? "pi-pencil" : mode === "view" ? "pi-eye" : "pi-user-plus"}
    >

      <Formik
        initialValues={formData}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form className="space-y-2">
            <div className="w-full h-full">
              <h1 className="font-bold text-gray-500 pl-1">Imagen del producto:</h1>
              <div className="flex-col inset-shadow-custom p-2 rounded-lg flex justify-center items-center gap-3 md:gap-2">
                <ProductImageComponent
                  image={typeof values.image === "string" ? values.image : values.image === null ? undefined : URL.createObjectURL(values.image)}
                  size={'h-30 w-30'}
                  iconStyle={'text-7xl'}
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={(e) => {
                    setFieldValue("image", e.target.files[0])
                  }}
                  className="hidden"
                />
                <CustomButtonComponent onClick={() => fileInputRef.current.click()} buttonStyles={mode === 'view' ? "hidden!" : ''} type={"button"} >
                  <i className="pi pi-image"></i>
                  <p>{mode === 'edit' ? 'Cambiar imagen' : 'Agregar imagen'}</p>
                </CustomButtonComponent>
              </div>
            </div>

            <CustomInputComponent name={"name"} type={"text"} label={"Nombre"} value={values.name} disabled={mode === "view"} />

            <CustomInputComponent name={"description"} type={"textarea"} label={"Descripción"} value={values.description} disabled={mode === "view"} />

            <div className="grid grid-cols-2 gap-4">
              <CustomInputComponent name={"price"} type={"number"} label={"Precio"} value={values.price} disabled={mode === "view"} />
              <CustomInputComponent name={"stock"} type={"number"} label={"Stock"} value={values.stock} disabled={mode === "view"} />
            </div>

            <CustomInputComponent
              name={"status"}
              type={"select"}
              label={"Estado"}
              value={values.status}
              disabled={mode === "view"}
              options={[
                { value: "active", label: "Activo" },
                { value: "blocked", label: "Bloqueado" },
              ]}
            />

            {mode !== "view" && (
              <div className="flex justify-end space-x-4 pt-4">
                <CustomButtonComponent
                  type="button"
                  onClick={onClose}
                  buttonStyles={'bg-red-500'}
                >
                  Cancelar
                </CustomButtonComponent>

                <CustomButtonComponent
                  type="submit"
                  disabled={isSubmitting}
                >
                  <i className="pi pi-save"></i>
                  {isSubmitting ? "Guardando..." : "Guardar"}
                </CustomButtonComponent>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </ModalComponent>
  );
}