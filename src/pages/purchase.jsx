import PurchaseDetailModal from "../components/UI/purchaseDetailModal";
import DateRangeFilter from "../components/forms/DateRangeFilter";
import { formatBuyLogsForTable } from "../utils/buyLogsFormatter";
import { getBuyLogsByUserId } from "../api/buyLogsService";
import Paginator from "../components/UI/Paginator";
import Loading from "../components/UI/Loading";
import { useState, useEffect } from "react";

export default function Purchase() {
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const pageSize = 10;

  const formatDateLong = (value) => {
    return new Date(value).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const fetchUserPurchases = async (page = 1, from = "", to = "") => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getBuyLogsByUserId(
        userId,
        page,
        pageSize,
        from,
        to,
      );

      // ahora la API regresa metadata de paginacion y docs
      const buyLogs = response.data?.docs || [];
      const formattedPurchases = formatBuyLogsForTable(buyLogs);

      setPurchases(formattedPurchases);
      setCurrentPage(response.data?.page || page);
      setTotalPages(response.data?.totalPages || 1);
      setError(null);
    } catch (err) {
      setError("No se pudieron cargar las compras"+err);
      setPurchases([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPurchases(1, "", "");
  }, []);

  const paginatedPurchases = purchases;

  const handleViewDetails = (purchase) => {
    setSelectedPurchase(purchase);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPurchase(null);
  };

  const handlePageChange = (page) => {
    fetchUserPurchases(page, fromDate, toDate);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleApplyDateFilter = () => {
    fetchUserPurchases(1, fromDate, toDate);
  };

  const handleClearDateFilter = () => {
    setFromDate("");
    setToDate("");
    fetchUserPurchases(1, "", "");
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Mis Compras</h1>
        <div className="bg-red-100 rounded-lg p-8 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => fetchUserPurchases(1, fromDate, toDate)}
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

      <DateRangeFilter
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onApply={handleApplyDateFilter}
        onClear={handleClearDateFilter}
      />

      {loading ? (
        <Loading />
      ) : purchases.length === 0 ? (
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

      {purchases.length > 0 && (
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
