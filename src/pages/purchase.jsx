/**
 * MIS COMPRAS
 * Esta página muestra un historial de compras del usuario, con detalles como fecha, total y estado.
 * las columnas mas o menos son, luego se me olvidan
 * - Fecha
 * - Total
 * - Estado
 * - Acciones
 *
 */
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useSearch } from "../context/SearchContext";
import Paginator from "../components/UI/Paginator";
import { userPurchaseDemoRows } from "../models/user";

export default function Purchase() {
  const { user } = useAuth();
  const { normalizedSearch } = useSearch();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    // TODO: Fetch compras desde API
    // Por ahora, datos de ejemplo
    setTimeout(() => {
      setPurchases(userPurchaseDemoRows);
      setLoading(false);
      setCurrentPage(1);
    }, 500);
  }, [user]);

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
                      <button className="bg-[#687bd7] hover:bg-[#0d3395] text-white px-4 py-1 rounded mr-2 transition">
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
    </div>
  );
}
