import PurchaseDetailModal from "../components/UI/purchaseDetailModal";
import DateRangeFilter from "../components/forms/DateRangeFilter";
import { useCallback, useEffect, useState } from "react";
import { getAllUsersNames } from "../api/userService";
import Paginator from "../components/UI/Paginator";
import Loading from "../components/UI/Loading";
import {
  getPurchasedByUserId,
  getAllPurchase,
} from "../api/purchaseHistoryService";

export default function PurchaseHistory() {
  const [selectedPurchased, setSelectedPurchase] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [purchases, setPurchases] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [grayText, setToGrayText] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState(null);
  const pageSize = 10;

  const formatDateLong = (value) => {
    return new Date(value).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const normalizePurchases = (docs = []) => {
    return docs.map((log, index) => {
      const products = Array.isArray(log.products) ? log.products : [];
      const productsTotal = products.reduce((sum, product) => {
        const quantity = Number(product?.quantity) || 1;
        const price = Number(product?.price) || 0;
        return sum + price * quantity;
      }, 0);

      const total =
        Number(log.totalCost) > 0 ? Number(log.totalCost) : productsTotal;
      const user = log.id_user || {};
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

      return {
        id: log._id || index,
        date: log.createdAt,
        total,
        status: log.isPaid === false ? "Pendiente" : "Pagado",
        products: products.map((product) => ({
          ...product,
          quantity: Number(product?.quantity) || 1,
          price: Number(product?.price) || 0,
        })),
        userName: fullName || user.username || "Usuario",
      };
    });
  };

  // Fetch de usuarios para el dropdown
  const getUsersDropdown = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const data = await getAllUsersNames();
      const normalizedUsers = Array.isArray(data)
        ? data.map((user) => ({
            id: user?.id || "",
            fullName: String(user?.fullName || "").trim(),
          }))
        : [];

      setUsers(normalizedUsers.filter((user) => user.id));
    } catch (fetchError) {
      console.error("Error cargando usuarios:", fetchError);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  const getPurchases = useCallback(
    async (page = 1, from = "", to = "", userId = "") => {
      try {
        setLoading(true);

        const response = userId
          ? await getPurchasedByUserId(userId, page, pageSize, from, to)
          : await getAllPurchase(page, pageSize, from, to);

        const docs = response?.docs || [];
        setPurchases(normalizePurchases(docs));
        setCurrentPage(response?.page || page);
        setTotalPages(response?.totalPages || 1);
        setError(null);
      } catch (fetchError) {
        console.error("Error cargando historial:", fetchError);
        setError("No se pudo cargar el historial de compras");
        setPurchases([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    getUsersDropdown();
    getPurchases(1, "", "", "");
  }, [getUsersDropdown, getPurchases]);

  const handleApplyFilters = () => {
    getPurchases(1, fromDate, toDate, selectedUserId);
  };

  const handleClearFilters = () => {
    setFromDate("");
    setToDate("");
    setSelectedUserId("");
    getPurchases(1, "", "", "");
  };

  const handlePageChange = (page) => {
    getPurchases(page, fromDate, toDate, selectedUserId);
  };

  const handelOpenTicket = (purchase) => {
    setSelectedPurchase(purchase);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPurchase(null);
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Historial de Compras
        </h1>
        <div className="bg-red-100 rounded-lg p-8 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => getPurchases(1, fromDate, toDate, selectedUserId)}
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
        Historial de Compras
      </h1>
      {/*Este es el dropdown Users*/}
      <div className="bg-white rounded-lg shadow p-4 mb-6 border border-gray-100">
        <div className="mb-4">
          <label className="block text-lg font-semibold text-gray-700 mb-3">
            Buscar por usuario
          </label>
          <select
            value={selectedUserId}
            onChange={(event) => {
              setSelectedUserId(event.target.value);
              setToGrayText(true);
            }}
            className={`md:w-1/1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3041A0] focus:border-[#3041A0] ${
              !grayText && selectedUserId === "" ? "text-gray-500" : "text-gray-900"
            }`}
            disabled={loadingUsers}
          >
            <option value="">Todos los usuarios</option>
            {users.map((user) => (
              <option className="text-gray-800" key={user.id} value={user.id}>
                {user.fullName || user.username || "Usuario"}
              </option>
            ))}
          </select>
        </div>

        <div className="[&>div]:bg-transparent [&>div]:shadow-none [&>div]:border-0 [&>div]:p-0 [&>div]:mb-0">
          <DateRangeFilter
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
          />
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : purchases.length === 0 ? (
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <p className="text-red-500">
            No se encontraron compras con esos filtros.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#3041A0] text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Usuario
                  </th>
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
              <tbody className="bg-white divide-y divide-gray-200">
                {purchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {purchase.userName}
                    </td>
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
        purchase={selectedPurchased}
        onClose={handleCloseModal}
      />
    </div>
  );
}
