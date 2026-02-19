/**
 * NUEVO COMPONENTE CREADO EN ESTA SESIÓN
 * Modal de Compra con Validaciones
 * 
 * UTILIDAD:
 * - Formulario validado para crear nuevas compras
 * - Usa Yup para validación de datos
 * - Usa Formik para gestión de estado del formulario
 * - Muestra errores en tiempo real
 * 
 * PROPIEDADES:
 * - isOpen: boolean - si el modal está visible
 * - onClose: function - callback cuando se cierra
 * - onSubmit: function - callback cuando se envía el formulario
 * - initialValues: object - valores iniciales (opcional)
 * 
 * Archivo: src/components/UI/PurchaseModal.jsx
 */

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";

// Esquema de validación con Yup
const purchaseValidationSchema = Yup.object().shape({
  products: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.string().required("ID de producto es requerido"),
        name: Yup.string()
          .required("Nombre es requerido")
          .min(3, "Mínimo 3 caracteres"),
        price: Yup.number()
          .required("Precio es requerido")
          .positive("El precio debe ser positivo"),
        quantity: Yup.number()
          .required("Cantidad es requerida")
          .positive("La cantidad debe ser mayor a 0")
          .integer("La cantidad debe ser un número entero"),
      })
    )
    .min(1, "Debe seleccionar al menos 1 producto"),
  notes: Yup.string().max(500, "Las notas no pueden exceder 500 caracteres"),
});

export default function PurchaseModal({
  isOpen,
  onClose,
  onSubmit,
  products = [],
  initialValues = null,
}) {
  const { user } = useAuth();

  if (!isOpen) return null;

  const defaultValues = initialValues || {
    products: [{ id: "", name: "", price: 0, quantity: 1 }],
    notes: "",
  };

  const handleSubmit = (values, { setSubmitting }) => {
    // Validación adicional si es necesario
    if (values.products.length === 0) {
      alert("Debe agregar al menos 1 producto");
      setSubmitting(false);
      return;
    }

    onSubmit({
      ...values,
      userId: user?.userId,
    });
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6 max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Nueva Compra</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <Formik
          initialValues={defaultValues}
          validationSchema={purchaseValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, isSubmitting, setFieldValue }) => (
            <Form className="space-y-4">
              {/* Sección de Productos */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Productos</h3>

                {values.products.map((product, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 p-3 rounded mb-2 space-y-2"
                  >
                    {/* Selector de Producto */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Producto {idx + 1} *
                      </label>
                      <Field
                        as="select"
                        name={`products.${idx}.id`}
                        onChange={(e) => {
                          const selected = products.find(
                            (p) => p._id === e.target.value
                          );
                          if (selected) {
                            setFieldValue(`products.${idx}.id`, selected._id);
                            setFieldValue(`products.${idx}.name`, selected.name);
                            setFieldValue(`products.${idx}.price`, selected.price);
                          }
                        }}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3041A0]"
                      >
                        <option value="">Seleccionar producto</option>
                        {products.map((p) => (
                          <option key={p._id} value={p._id}>
                            {p.name} - ${p.price}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name={`products.${idx}.id`}
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    {/* Cantidad */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Cantidad *
                        </label>
                        <Field
                          type="number"
                          name={`products.${idx}.quantity`}
                          min="1"
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3041A0]"
                        />
                        <ErrorMessage
                          name={`products.${idx}.quantity`}
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Subtotal
                        </label>
                        <div className="w-full mt-1 px-3 py-2 border border-gray-300 rounded bg-gray-100">
                          ${(
                            (product.price || 0) *
                            (product.quantity || 0)
                          ).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Botón para remover producto */}
                    {values.products.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newProducts = values.products.filter(
                            (_, i) => i !== idx
                          );
                          setFieldValue("products", newProducts);
                        }}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Remover producto
                      </button>
                    )}
                  </div>
                ))}

                {/* Botón para agregar producto */}
                <button
                  type="button"
                  onClick={() => {
                    setFieldValue("products", [
                      ...values.products,
                      { id: "", name: "", price: 0, quantity: 1 },
                    ]);
                  }}
                  className="text-[#3041A0] hover:text-[#25348a] font-medium text-sm mt-2"
                >
                  + Agregar otro producto
                </button>

                {errors.products && typeof errors.products === "string" && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.products}
                  </div>
                )}
              </div>

              {/* Notas Opcionales */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Notas (opcional)
                </label>
                <Field
                  as="textarea"
                  name="notes"
                  maxLength="500"
                  rows="2"
                  placeholder="Agregar notas sobre la compra..."
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3041A0]"
                />
                <ErrorMessage
                  name="notes"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Total */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800">Total</span>
                  <span className="text-2xl font-bold text-[#3041A0]">
                    $
                    {values.products
                      .reduce(
                        (sum, p) => sum + (p.price || 0) * (p.quantity || 0),
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-2 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded font-semibold hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#3041A0] text-white py-2 rounded font-semibold hover:bg-[#25348a] transition disabled:opacity-50"
                >
                  {isSubmitting ? "Guardando..." : "Guardar Compra"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
