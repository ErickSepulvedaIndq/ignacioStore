import { useState } from "react";
import { createUser } from "../../api/userService";

export default function RegisterUserForm({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    role: "user",
    debt: 0,
    status: "active",
  });

  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      role: "user",
      debt: 0,
      status: "active",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "debt" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {

      await createUser(formData);

      onSuccess();
      resetForm();
      onClose();
    } catch (error) {
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
          <h2 className="text-2xl font-bold text-gray-800">Crear Usuario</h2>
          <button
            className="text-gray-500 hover:text-gray-800 text-xl transition"
            onClick={() => {
              resetForm();
              onClose();
            }}
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16 text-lg font-medium">
            Creando usuario...
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
                  className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
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
                  className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
              />
            </div>

            {/* Rol y Estado */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rol
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>
            </div>

            {/* Deuda */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Deuda
              </label>
              <input
                type="number"
                name="debt"
                value={formData.debt}
                min={0}
                onChange={handleChange}
                className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-medium"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold shadow-md"
              >
                Crear
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
