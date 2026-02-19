import PurchaseDetailModal from "../components/UI/purchaseDetailModal";
import { formatBuyLogsForTable } from "../utils/buyLogsFormatter";
import { getBuyLogsByUserId } from "../api/buyLogsService";
import { useState, useEffect, useMemo } from "react";
import { useSearch } from "../context/SearchContext";
import Paginator from "../components/UI/Paginator";

export default function Purchase() {
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const { normalizedSearch } = useSearch();
  const [error, setError] = useState(null);
  const pageSize = 10;

  const formatDateLong = (value) => {
    return new Date(value).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const fetchUserPurchases = async (page = 1) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getBuyLogsByUserId(userId, page, pageSize);

      // ahora la API regresa metadata de paginacion y docs
      const buyLogs = response.data?.docs || [];
      const formattedPurchases = formatBuyLogsForTable(buyLogs);

      setPurchases(formattedPurchases);
      setCurrentPage(response.data?.page || page);
      setTotalPages(response.data?.totalPages || 1);
      console.log("Compras formateadas:", formattedPurchases);
      setError(null);
    } catch (err) {
      console.error("Error fetching purchases:", err);
      setError("No se pudieron cargar las compras");
      setPurchases([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPurchases();
  }, []);

  const filteredPurchases = useMemo(() => {
    if (!normalizedSearch) {
      return purchases;
    }

    return purchases.filter((purchase) => {
      const longDate = formatDateLong(purchase.date);
      const searchableText =
        `${purchase.id} ${purchase.date} ${longDate} ${purchase.total} ${purchase.status}`.toLowerCase();
      return searchableText.includes(normalizedSearch);
    });
  }, [purchases, normalizedSearch]);

  const paginatedPurchases = filteredPurchases;

  const handleViewDetails = (purchase) => {
    setSelectedPurchase(purchase);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPurchase(null);
  };

  const handlePageChange = (page) => {
    fetchUserPurchases(page);
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
            onClick={() => fetchUserPurchases(1)}
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
                      {formatDateLong(purchase.date)}
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

      <PurchaseDetailModal
        isOpen={showModal}
        purchase={selectedPurchase}
        onClose={handleCloseModal}
      />
    </div>
  );
}
