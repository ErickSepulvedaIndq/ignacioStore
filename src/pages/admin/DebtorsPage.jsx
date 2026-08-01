import { useState } from "react";
import Swal from "sweetalert2";
import DateRangeFilter from "../../components/forms/DateRangeFilter";
import Paginator from "../../components/UI/Paginator";
import LoadingComponent from "../../components/UI/LoadingComponent";
import { useMarkBuyLogAsPaid, usePendingBuyLogs } from "../../api/hooks/buyLogsHooks";
import toast from "react-hot-toast";

export default function DebtorsPage() {
  const [payingId, setPayingId] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1)
  const { data: pendingBuyLogs, isError, isLoading } = usePendingBuyLogs(page, 10, fromDate, toDate);
  const { mutateAsync: markAsPaid } = useMarkBuyLogAsPaid()

  const handleCollectPayment = async (buyLogId, payment) => {
    // validar que payment existe
    if (!payment) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo obtener los datos de la compra"
      });
      return;
    }

    // confirmación antes de cobrar
    const result = await Swal.fire({
      title: "¿Seguro que quieres cobrar esta compra?",
      text: `Cobrar $${payment.purchaseAmount.toFixed(2)} a ${payment.userName}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3041A0",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar"
    });

    if (!result.isConfirmed) return;

    // si pasa los filtros, marcamos como pagado
    toast.promise(
      markAsPaid({ userId: payment?.id_user?._id, buyLogId, amount: payment.purchaseAmount }),
      {
        isLoading: 'Cobrando...',
        success: 'Listo!',
        error: (e) => {
          console.error(e);
          return "Error al cobrar, intente más tarde."
        }
      }
    )

    setPayingId(null);
  };

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Pendientes de Pago
        </h1>
        <div className="bg-red-100 rounded-lg p-8 text-center">
          <p className="text-red-600">Error al obtener los datos, intente más tarde</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Pendientes de Pago
      </h1>

      <DateRangeFilter
        onApply={(from, to) => {
          setFromDate(from);
          setToDate(to);
        }}
      />

      {isLoading ? (
        <LoadingComponent />
      ) : pendingBuyLogs?.data?.docs.length === 0 ? (
        <div className="bg-green-100 rounded-lg p-8 text-center">
          <p className="text-green-800 font-semibold">
            No se encontraron usuarios pendientes de pago.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#3041A0] text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Fecha Compra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Monto Compra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Deuda Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingBuyLogs?.data?.docs.map((payment) => (
                <tr key={payment?._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {payment?.userName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(payment?.createdAt).toLocaleDateString("es-MX")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${payment?.purchaseAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ${payment?.totalDebt.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleCollectPayment(payment?._id, payment)}
                      disabled={payingId === payment?._id}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-1 rounded mr-2 transition cursor-pointer"
                    >
                      {payingId === payment._id ? "Cobrando..." : "Cobrar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pendingBuyLogs?.data?.docs.length > 0 && (
        <Paginator
          currentPage={page}
          totalPages={pendingBuyLogs?.data?.totalPages}
          onPageChange={(p) => setPage(p)}
          loading={isLoading}
        />
      )}
    </div>
  );
}
