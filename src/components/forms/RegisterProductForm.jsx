import { useState } from "react";
import { createProduct } from "../../services/productService";
import { useAuth } from "../../context/AuthContext";

export default function RegisterProductForm({ isOpen, onClose, onSuccess }) {
    const { user } = useAuth();
    console.log("Usuario actual:", user);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    status: "active",
    image: null,
  });

  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      status: "active",
      image: null,
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {

         const productData = {
        ...formData,
        author: user._id
         };

      await createProduct(productData);
      onSuccess();
      resetForm();
      onClose();
    } catch (err) {
      console.error("Error creando producto:", err);
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
            Crear Producto
          </h2>
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
            Creando producto...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
              />
            </div>

            {/* Precio y Stock */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Precio
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                />
              </div>
            </div>

            {/* Estado */}
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
                <option value="blocked">Bloqueado</option>
              </select>
            </div>

            {/* Imagen */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Imagen
              </label>

              {formData.image && (
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="Preview"
                  className="w-40 h-40 object-cover rounded-lg mb-4 border-2 border-gray-300"
                />
              )}

              <input
                type="file"
                name="image"
                onChange={handleChange}
                className="w-full rounded-lg border-2 border-dashed border-gray-400 bg-white px-4 py-3 cursor-pointer hover:border-indigo-500 transition"
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
