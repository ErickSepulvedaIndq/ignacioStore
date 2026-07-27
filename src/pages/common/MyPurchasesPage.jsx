import { useState } from "react";
import PurchaseDetailModal from "../../components/UI/purchaseDetailModal";
import DateRangeFilter from "../../components/forms/DateRangeFilter";
import Paginator from "../../components/UI/Paginator";
import Loading from "../../components/UI/Loading";
import { useBuyLogs } from "../../api/hooks/useBuyLogsHooks";
import { useAuth } from "../../context/AuthContext";

export default function MyPurchasesPage() {
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const { user } = useAuth();
  const { data: buyLogs, isLoading, isError } = useBuyLogs(user.userId, page, fromDate, toDate);

  const formatDateLong = (value) => {
    return new Date(value).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleViewDetails = (purchase) => {
    setSelectedPurchase(purchase);
    setShowModal(true);
  };

  if (isError) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Mis Compras</h1>
        <div className="bg-red-100 rounded-lg p-8 text-center">
          <p className="text-red-600">Error al cargar los datos, intente más tarde.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Mis Compras</h1>

      <DateRangeFilter
        onApply={(from, to) => {
          setFromDate(from);
          setToDate(to);
        }}
      />

      {isLoading ? (
        <Loading />
      ) : buyLogs?.data?.length === 0 ? (
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
                {buyLogs?.data?.docs?.map((purchase) => (
                  <tr key={purchase?._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDateLong(purchase?.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ${purchase.totalCost.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${purchase.status === "Pagado"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                          }`}
                      >
                        {purchase?.isPaid === false ? "Pendiente" : "Pagado"}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium ">
                      <button
                        onClick={() => handleViewDetails(purchase)}
                        className="bg-[#687bd7] hover:bg-[#0d3395] text-white px-4 py-1 rounded mr-2 transition cursor-pointer"
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

      {buyLogs?.data?.docs?.length > 0 && (
        <Paginator
          currentPage={page}
          totalPages={buyLogs?.data?.limit}
          onPageChange={(p) => setPage(p)}
          loading={isLoading}
        />
      )}

      <PurchaseDetailModal
        isOpen={showModal}
        purchase={selectedPurchase}
        onClose={() => {
          setShowModal(false);
          setSelectedPurchase(null);
        }}
      />
    </div>
  );
}
