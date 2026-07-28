import { useState } from "react";
import DateRangeFilter from "../../components/forms/DateRangeFilter";
import Paginator from "../../components/UI/Paginator";
import Loading from "../../components/UI/Loading";
import PurchaseDetailModal from "../../components/UI/purchaseDetailModal";
import { usePurchasesByUser, usePurchases } from "../../api/hooks/purchasesHooks";

export default function PurchaseHistoryPage() {
  const [selectedPurchased, setSelectedPurchase] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [userId, setUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: allPurchases,
    isFetching: isFetchingAll,
    isError: allError,
  } = usePurchases(currentPage, 10, fromDate, toDate, {
    enabled: !userId,
  });

  const {
    data: userPurchasesData,
    isFetching: isFetchingUser,
    isError: userError,
  } = usePurchasesByUser(userId, currentPage, 10, fromDate, toDate, {
    enabled: !!userId,
  });

  const purchases = userId ? userPurchasesData : allPurchases;
  const isLoading = userId ? isFetchingUser : isFetchingAll;
  const hasError = userId ? userError : allError;

  const formatDateLong = (value) =>
    new Date(value).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const handleFilter = (from, to, uid) => {
    setFromDate(from);
    setToDate(to);
    setUserId(uid || null);
    setCurrentPage(1);
  };

  const handelOpenTicket = (purchase) => {
    setSelectedPurchase(purchase);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPurchase(null);
  };

  if (hasError) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Historial de Compras</h1>
        <div className="bg-red-100 rounded-lg p-8 text-center">
          <p className="text-red-600">Error al cargar los datos, intente más tarde.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Historial de Compras</h1>
      <DateRangeFilter userFilter={true} onApply={handleFilter} />

      {isLoading ? (
        <Loading />
      ) : !purchases?.docs?.length ? (
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <p className="text-red-500">No se encontraron compras con esos filtros.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#3041A0] text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Usuario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left t{/*  */}ext-xs font-medium uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {purchases.docs.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {purchase.userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDateLong(purchase.updatedAt)}
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
                        {purchase.isPaid === false ? "Pendiente" : "Pagado"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handelOpenTicket(purchase)}
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

      <Paginator
        currentPage={currentPage}
        totalPages={purchases?.totalPages}
        onPageChange={(p) => setCurrentPage(p)}
        loading={isLoading}
      />

      <PurchaseDetailModal isOpen={showModal} purchase={selectedPurchased} onClose={handleCloseModal} />
    </div>
  );
}