import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useSearch } from "../context/SearchContext";
import Paginator from "../components/UI/Paginator";
import { getBuyLogsByUserId } from "../api/buyLogsService";
import { formatBuyLogsForTable } from "../utils/buyLogsFormatter";

export default function Purchase() {
  const { user } = useAuth();
  const { normalizedSearch } = useSearch();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const pageSize = 10;

  const fetchUserPurchases = async () => {
    const userId = localStorage.getItem("userId");
    
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getBuyLogsByUserId(userId);
      
      // La respuesta viene en formato { data: [...], message: "...", success: true }
      const buyLogs = response.data || [];
      const formattedPurchases = formatBuyLogsForTable(buyLogs);
      
      setPurchases(formattedPurchases);
      setCurrentPage(1);
      setError(null);
    } catch (err) {
      console.error("Error fetching purchases:", err);
      setError("No se pudieron cargar las compras");
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUserPurchases();
  }, []);

  const filteredPurchases = useMemo(() => {
    if (!normalizedSearch) {
      return purchases;
    }

    return purchases.filter((purchase) => {
      const searchableText =
        `${purchase.id} ${purchase.date} ${purchase.total} ${purchase.status}`.toLowerCase();
      return searchableText.includes(normalizedSearch);
    });
  }, [purchases, normalizedSearch]);

  const totalPages = Math.ceil(filteredPurchases.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedPurchases = filteredPurchases.slice(startIndex, endIndex);

  const handleViewDetails = (purchase) => {
    setSelectedPurchase(purchase);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPurchase(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-500">Cargando compras...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Mis Compras</h1>
        <div className="bg-red-100 rounded-lg p-8 text-center">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchUserPurchases}
            className="mt-4 bg-[#3041A0] text-white px-4 py-2 rounded hover:bg-[#25348a] transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Mis Compras</h1>

      {filteredPurchases.length === 0 ? (
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <p className="text-gray-500">No se encontraron compras.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* contenedor para tabla responsive */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              {/* cabecera de la tabla */}
              <thead className="bg-[#3041A0] text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              {/* cuerpo de la tabla */}
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedPurchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(purchase.date).toLocaleDateString("es-MX")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ${purchase.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          purchase.status === "Pagado"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {purchase.status}
                      </span>
                    </td>

                    {/* acciones por compra */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium ">
                      <button 
                        onClick={() => handleViewDetails(purchase)}
                        className="bg-[#687bd7] hover:bg-[#0d3395] text-white px-4 py-1 rounded mr-2 transition"
                      >
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredPurchases.length > 0 && (
        <Paginator
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          loading={loading}
        />
      )}

      {/* Modal de detalles de compra */}
      {showModal && selectedPurchase && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Detalles de Compra</h2>
              <button 
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Fecha</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(selectedPurchase.date).toLocaleDateString("es-MX")}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Estado</p>
                <span
                  className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                    selectedPurchase.status === "Pagado"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {selectedPurchase.status}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Productos</p>
                <div className="bg-gray-50 rounded p-3 space-y-2 max-h-48 overflow-y-auto">
                  {selectedPurchase.products.map((product, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <div className="flex-1">
                        <span className="text-gray-700">{product.name}</span>
                        <span className="text-gray-500 ml-2">x{product.quantity || 1}</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        ${((product.price || 0) * (product.quantity || 1)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Total</span>
                  <span className="text-2xl font-bold text-[#3041A0]">${selectedPurchase.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleCloseModal}
              className="w-full mt-6 bg-[#3041A0] text-white py-2 rounded font-semibold hover:bg-[#25348a] transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
