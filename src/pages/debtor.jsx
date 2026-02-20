import { useState, useEffect } from "react";
import DateRangeFilter from "../components/forms/DateRangeFilter";
import Paginator from "../components/UI/Paginator";
import Loading from "../components/UI/Loading";
import Swal from "sweetalert2";
import {
    getPendingBuyLogs,
    markBuyLogAsPaid,
} from "../api/buyLogsService";
import { subtractUserDebtController } from "../api/userService";

export default function Debtor() {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [payingId, setPayingId] = useState(null);
  const pageSize = 10;

  const fetchPendingPayments = async (page = 1, from = "", to = "") => {
    try {
      setLoading(true);
      const response = await getPendingBuyLogs(page, pageSize, from, to);
      const logs = response.data?.docs || [];

      const normalizedLogs = logs.map((log, index) => ({
        id: log._id || index,
        id_user: log.id_user?._id || log.id_user, 
        userName: log.userName || "Usuario",
        purchaseDate: log.createdAt,
        purchaseAmount: Number(log.purchaseAmount || 0),
        totalDebt: Number(log.totalDebt || 0),
      }));

      setPendingPayments(normalizedLogs);
      setCurrentPage(response.data?.page || page);
      setTotalPages(response.data?.totalPages || 1);
      setError(null);
    } catch (err) {
      console.error("Error al cargar pendientes:", err);
      setError("No se pudieron cargar los pendientes de pago");
      setPendingPayments([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingPayments(1, "", "");
  }, []);

  const handlePageChange = (page) => {
    fetchPendingPayments(page, fromDate, toDate);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleApplyDateFilter = () => {
    fetchPendingPayments(1, fromDate, toDate);
  };

  const handleClearDateFilter = () => {
    setFromDate("");
    setToDate("");
    fetchPendingPayments(1, "", "");
  };

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

        // confirmacion antes de cobrar
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

        try {
            setPayingId(buyLogId);
            
            // obtener ID del usuario autenticado para el log
            const userId = localStorage.getItem("userId");
            
            // marcar como pagado
            await markBuyLogAsPaid(buyLogId);
            
            // restar deuda del usuario
            await subtractUserDebtController(payment.id_user || userId, payment.purchaseAmount, userId);
            
            // refrescar tabla
            await fetchPendingPayments(currentPage, fromDate, toDate);
            
            Swal.fire({
                icon: "success",
                title: "Compra cobrada exitosamente",
                timer: 900,
                showConfirmButton: false
            });
        } catch (err) {
            console.error("Error cobrando venta:", err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo cobrar la venta seleccionada"
            });
        } finally {
            setPayingId(null);
        }
    };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Pendientes de Pago
        </h1>
        <div className="bg-red-100 rounded-lg p-8 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => fetchPendingPayments(1, fromDate, toDate)}
            className="mt-4 bg-[#3041A0] text-white px-4 py-2 rounded hover:bg-[#25348a] transition"
          >
            Reintentar
          </button>
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
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onApply={handleApplyDateFilter}
        onClear={handleClearDateFilter}
      />

      {loading ? (
        <Loading />
      ) : pendingPayments.length === 0 ? (
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
              {pendingPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {payment.userName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(payment.purchaseDate).toLocaleDateString("es-MX")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${payment.purchaseAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ${payment.totalDebt.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleCollectPayment(payment.id, payment)}
                      disabled={payingId === payment.id}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-1 rounded mr-2 transition cursor-pointer"
                    >
                      {payingId === payment.id ? "Cobrando..." : "Cobrar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pendingPayments.length > 0 && (
        <Paginator
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          loading={loading}
        />
      )}
    </div>
  );
}
