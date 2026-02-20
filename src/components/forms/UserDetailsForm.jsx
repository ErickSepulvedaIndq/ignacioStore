import { useState, useEffect } from "react";
import { getUserById, updateUser } from "../../api/userService";
//import { useAuth } from "../../context/AuthContext";

export default function UserDetailsForm({
  isOpen,
  onClose,
  onSuccess,
  userId,
  mode = "edit",
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    role: "user",
    debt: 0,
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  /* ===============================
     Cargar usuario
  =============================== */
  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      setFetching(true);
      try {
        const userData = await getUserById(userId); // <-- ya devuelve el objeto usuario
        if (!userData) return;

        setFormData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          username: userData.username || "",
          password: "",
          role: userData.role || "user",
          debt: userData.debt ?? 0,
        });
      } catch (error) {
        console.error("Error cargando usuario:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchUser();
  }, [userId]);

  /* ===============================
     Manejar cambios
  =============================== */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "debt" ? Number(value) : value,
    }));
  };

  /* ===============================
     Submit
  =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === "view") return;

    setLoading(true);

    try {
      const updateData = {
        ...formData,
      };

      // Si password está vacío, no lo enviamos
      if (!updateData.password) {
        delete updateData.password;
      }

      await updateUser(userId, updateData);

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error actualizando usuario:", error);
      alert("Error actualizando usuario, revisa consola.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-gray-100 rounded-2xl shadow-2xl w-full max-w-3xl p-10 relative animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === "edit" ? "Editar Usuario" : "Ver Usuario"}
          </h2>
          <button
            className="text-gray-500 hover:text-gray-800 text-xl transition"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {fetching ? (
          <div className="flex justify-center py-16 text-lg font-medium">
            Cargando usuario...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre y Apellido */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  disabled={mode === "view"}
                  className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Apellido
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
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
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={mode === "view"}
                className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition disabled:bg-gray-100"
              />
            </div>

            {/* Password */}
            {mode === "edit" && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nueva contraseña (opcional)
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                />
              </div>
            )}

            {/* Rol y Deuda */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rol
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={mode === "view"}
                  className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition disabled:bg-gray-100"
                >
                  <option value="admin">Admin</option>
                  <option value="user">Usuario</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Deuda
                </label>
                <input
                  type="number"
                  name="debt"
                  value={formData.debt}
                  onChange={handleChange}
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
                  className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-medium"
                  onClick={onClose}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold shadow-md disabled:opacity-50"
                >
                  {loading ? "Guardando..." : "Guardar"}
                </button>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
