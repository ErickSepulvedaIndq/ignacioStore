import { useState } from "react";
import PurchaseDetailModal from "../../components/UI/purchaseDetailModal";
import DateRangeFilter from "../../components/forms/DateRangeFilter";
import Paginator from "../../components/UI/Paginator";
import Loading from "../../components/UI/Loading";
import { useBuyLogs } from "../../api/hooks/buyLogsHooks";
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

  // if (isError) {
  //   return (
  //     <div className="container mx-auto p-4">
  //       <h1 className="text-3xl font-bold mb-6 text-gray-800">Mis Compras</h1>
  //       <div className="bg-red-100 rounded-lg p-8 text-center">
  //         <p className="text-red-600">Error al cargar los datos, intente más tarde.</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col w-full h-full gap-2">
      <DateRangeFilter
        onApply={(from, to) => {
          setFromDate(from);
          setToDate(to);
        }}
      />

      {/* {isLoading ? (
        <Loading />
      ) : buyLogs?.data?.length === 0 ? (
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <p className="text-gray-500">No se encontraron compras.</p>
        </div>
      ) : ( */}
      <div className="bg-white rounded-lg h-full shadow w-full overflow-hidden">
        {/* contenedor para tabla responsive */}
        <div className="overflow-auto w-full h-full">
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
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${purchase.status === "Pagado"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {purchase?.isPaid === false ? "Pendiente" : "Pagado"}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium hidden md:flex md:justify-center md:items-center  ">
                    <button
                      onClick={() => handleViewDetails(purchase)}
                      className="bg-blue-800 font-bold hover:bg-blue-900 pointer-fine:pointer-events-auto text-white px-4 py-1 rounded mr-2 transition cursor-pointer flex flex-row gap-1 justify-center items-center"
                    >
                      <i className="pi pi-eye"></i>
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* )} */}

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
