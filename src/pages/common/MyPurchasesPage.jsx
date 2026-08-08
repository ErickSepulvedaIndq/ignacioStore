import { useState } from "react";
import PurchaseDetailModal from "../../components/UI/purchaseDetailModal";
import Paginator from "../../components/UI/Paginator";
import LoadingComponent from "../../components/UI/LoadingComponent";
import { useBuyLogs } from "../../api/hooks/buyLogsHooks";
import { useAuth } from "../../context/AuthContext";
import ErrorComponent from "../../components/UI/ErrorComponent";
import FiltersComponent from "../../components/forms/FiltersComponent";

export default function MyPurchasesPage() {
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [state, setState] = useState("all")
  const [page, setPage] = useState(1);
  const { user } = useAuth();

  const { data: buyLogs, isLoading, isError, refetch } = useBuyLogs({ userId: user.userId, page, limit: 10, from: fromDate, to: toDate, status: state });

  const formatDateLong = (value) => {
    return new Date(value).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatShortDate = (value) => {
    return new Date(value).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  const handleViewDetails = (purchase) => {
    setSelectedPurchase(purchase);
    setShowModal(true);
  };

  const handleFilter = (from, to, state) => {
    setPage(1);
    setFromDate(from);
    setToDate(to);
    setState(state);
    console.log(from, to, state)
  }

  return (
    <div className="flex flex-col w-full h-full gap-2">
      <FiltersComponent
        searchFilter={false}
        userFilter={false}
        stateFilter={true}
        stateOptions={[
          { value: "all", label: "Todos los estados" },
          { value: "paid", label: "Pagado" },
          { value: "pending", label: "Pendiente" }
        ]}
        dateRangeFilter={true}
        onApply={(from, to, u, state) => { handleFilter(from, to, state) }}
      />

      <div className="bg-white rounded-lg h-full shadow w-full overflow-hidden">
        {/* contenedor para tabla responsive */}
        <div className="overflow-auto w-full h-full">
          {isLoading ? <LoadingComponent /> : isError ? <ErrorComponent refetch={refetch} /> : (
            <table className="min-w-full divide-y divide-gray-200">
              {/* cabecera de la tabla */}
              <thead className="bg-blue-900 text-white sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-center">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 hidden md:block py-3 text-center text-xs font-bold uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>

              {/* cuerpo de la tabla */}
              <tbody className="bg-white divide-y divide-gray-200">
                {buyLogs?.data?.docs?.map((purchase) => (
                  <tr key={purchase?._id} className="hover:bg-gray-50 cursor-pointer md:cursor-default md:pointer-fine:pointer-events-none " onClick={() => handleViewDetails(purchase)}>
                    <td className="px-6 py-4 whitespace-nowrap md:block hidden text-sm text-gray-900 text-center">
                      {formatDateLong(purchase?.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap md:hidden block text-sm text-gray-900 text-center">
                      {formatShortDate(purchase?.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-center">
                      ${purchase.totalCost.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${purchase.isPaid
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                          }`}
                      >
                        {purchase?.isPaid === false ? "Pendiente" : "Pagado"}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center hidden md:table-cell">
                      <button
                        className="text-blue-800 mr-3 cursor-pointer hover:scale-140
                                  transform transition-all duration-200 ease-in-out pointer-fine:pointer-events-auto"
                        aria-label="View product"
                        title="Ver producto"
                        onClick={() => handleViewDetails("view", purchase)}
                      >
                        <i className="pi pi-eye text-base md:text-sm"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Paginator
        currentPage={page}
        totalPages={buyLogs?.data?.totalPages}
        onPageChange={(p) => setPage(p)}
        loading={isLoading}
      />

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
