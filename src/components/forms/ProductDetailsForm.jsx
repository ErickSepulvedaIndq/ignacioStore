import { useState, useEffect } from "react";
import { getProductById, updateProduct } from "../../services/productService";
import { useAuth } from "../../context/AuthContext";

export default function ProductDetailsForm({
  isOpen,
  onClose,
  onSuccess,
  productId,
  mode = "edit",
}) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    status: "active",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Traer datos del producto
  useEffect(() => {
    if (!productId) {
      console.log("No hay productId, no se cargará nada");
      return;
    }

    const fetchProduct = async () => {
      console.log("Fetching producto con ID:", productId);
      setFetching(true);
      try {
        const response = await getProductById(productId);
        console.log("Respuesta de la API:", response);

        const productData = response?.data; // <--- ACCEDER A data
        if (!productData) {
          console.warn("No se encontró data en la respuesta");
          setFormData({
            name: "",
            description: "",
            price: "",
            stock: "",
            status: "active",
            image: null,
          });
          return;
        }

        console.log("Producto cargado (data):", productData);

        setFormData({
          name: productData.name || "",
          description: productData.description || "",
          price: productData.price || "",
          stock: productData.stock || "",
          status: productData.status || "active",
          image: productData.image?.url || null, // <--- extraer URL de la imagen
        });

        console.log("formData actualizado:", {
          name: productData.name || "",
          description: productData.description || "",
          price: productData.price || "",
          stock: productData.stock || "",
          status: productData.status || "active",
          image: productData.image?.url || null,
        });
      } catch (err) {
        console.error("Error cargando producto:", err);
      } finally {
        setFetching(false);
        console.log("fetching set a false");
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    console.log("handleChange:", { name, value, files });
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === "view") {
      console.log("Modo view, no se envía nada");
      return;
    }

    console.log("Enviando formData al actualizar:", formData);
    setLoading(true);
    try {
      const productData = {
        ...formData,
      };
      const updated = await updateProduct(productId, productData);
      console.log("Producto actualizado (respuesta backend):", updated);
      onSuccess(); // recarga tabla
      onClose();
    } catch (err) {
      console.error("Error actualizando producto:", err);
      alert("Ocurrió un error al actualizar, revisa la consola.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    console.log("Modal cerrado");
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
              console.log("Cerrando modal");
              onClose();
            }}
          >
            ✕
          </button>
        </div>

        {fetching ? (
          <div className="flex justify-center py-16 text-lg font-medium">
            Cargando producto...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
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
                disabled={mode === "view"}
                className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
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
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  disabled={mode === "view"}
                  className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition disabled:bg-gray-100"
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
                  disabled={mode === "view"}
                  className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition disabled:bg-gray-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Estado
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={mode === "view"}
                className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 focus:border-indigo-500 focus:ring-2 cursor-pointer focus:ring-indigo-200 transition disabled:bg-gray-100"
              >
                <option value="active">Activo</option>
                <option value="blocked">Bloqueado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Imagen
              </label>

              {formData.image && (
                <img
                  src={
                    typeof formData.image === "string"
                      ? formData.image
                      : URL.createObjectURL(formData.image)
                  }
                  alt="Preview"
                  className="w-40 h-40 object-cover rounded-lg mb-4 border-2 border-gray-300"
                />
              )}

              <input
                type="file"
                name="image"
                onChange={handleChange}
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
                  className="px-6 py-3 bg-[#3041A0] text-white rounded-lg hover:bg-[#2b3b92] font-semibold shadow-md cursor-pointer"
                >
                  Guardar
                </button>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
