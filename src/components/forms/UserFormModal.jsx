import { Field, Form, Formik } from "formik";
import { useCreateUser, useUpdateUser } from "../../api/hooks/usersHooks";
import toast from "react-hot-toast";
//import { useAuth } from "../../context/AuthContext";

export default function UserFormModal({ isOpen, onClose, user, mode = "create" }) {
  const { mutateAsync: createUser } = useCreateUser();
  const { mutateAsync: editUser } = useUpdateUser();

  const formData = {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    username: user?.username || "",
    password: user?.password || "",
    role: user?.role || "user",
    debt: user?.debt || 0,
    status: user?.status || "active",
  }

  const handleSubmit = async (values) => {
    if (mode === "create") {
      toast.promise(
        createUser({ userData: values }),
        {
          loading: 'Creando usuario..',
          success: 'Usuario creado exitosamente!',
          error: (err) => {
            console.error(err);
            return 'Error al crear usuario, intente más tarde.'
          }
        }
      )
    } else {
      toast.promise(
        editUser({ userId: user?._id, userData: values }),
        {
          loading: 'Editando usuario...',
          success: 'Usuario editado correctamente!',
          error: (err) => {
            console.error(err);
            return 'Error al editar usuario, intente más tarde.'
          }
        }
      )
    }
    onClose()
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-gray-100 rounded-2xl shadow-2xl w-full max-w-3xl p-10 relative animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === "edit" ? "Editar Usuario" : mode === "view" ? "Ver Usuario" : "Crear Usuario"}
          </h2>
          <button
            className="text-gray-500 text-xl transition cursor-pointer hover:scale-120 hover:text-red-500"
            title="Cerrar"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <Formik
          initialValues={formData}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              {/* Nombre y Apellido */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre
                  </label>
                  <Field
                    id="firstName"
                    type="text"
                    name="firstName"
                    required
                    disabled={mode === "view"}
                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Apellido
                  </label>
                  <Field
                    id="lastName"
                    type="text"
                    name="lastName"
                    required
                    disabled={mode === "view"}
                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition disabled:bg-gray-100"
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Usuario
                </label>
                <Field
                  id="username"
                  type="text"
                  name="username"
                  required
                  disabled={mode === "view"}
                  className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition disabled:bg-gray-100"
                />
              </div>

              {/* Password */}
              {mode !== "view" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {mode === "edit" ? "Nueva contraseña (opcional)" : "Contraseña"}
                  </label>
                  <Field
                    id="password"
                    type="password"
                    name="password"
                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                  />
                </div>
              )}

              {/* Rol, Deuda y Status*/}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Estado
                  </label>
                  <Field
                    id="status"
                    name="status"
                    as="select"
                    disabled={mode === "view"}
                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition disabled:bg-gray-100"
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </Field>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Rol
                  </label>
                  <Field
                    id="role"
                    name="role"
                    as="select"
                    disabled={mode === "view"}
                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition disabled:bg-gray-100"
                  >
                    <option value="admin">Admin</option>
                    <option value="user">Usuario</option>
                  </Field>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deuda
                  </label>
                  <Field
                    id="debt"
                    type="number"
                    name="debt"
                    disabled={mode === "view"}
                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition disabled:bg-gray-100"
                  />
                </div>
              </div>

              {/* Botones */}
              {mode !== "view" && (
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    className="px-6 py-3 cursor-pointer bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-medium"
                    onClick={onClose}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 cursor-pointer bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold shadow-md disabled:opacity-50"
                  >
                    {isSubmitting ? "Guardando..." : "Guardar"}
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
