import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useSearch } from "../context/SearchContext";

export default function Purchase() {
  const { user } = useAuth();
  const { normalizedSearch } = useSearch();
  const [shopping, setShopping] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch compras desde API
    // Por ahora, datos de ejemplo
    setTimeout(() => {
      setShopping([
        {
          id: 1,
          date: "2026-02-15",
          result: 150.5,
          status: "Pagado",
        },
        {
          id: 2,
          date: "2026-02-10",
          result: 45.0,
          status: "Pendiente",
        },
      ]);
      setLoading(false);
    }, 500);
  }, [user]);

  const filteredPurchases = useMemo(() => {
    if (!normalizedSearch) {
      return shopping;
    }

    return shopping.filter((purchase) => {
      const searchableText = `${purchase.id} ${purchase.date} ${purchase.result} ${purchase.status}`.toLowerCase();
      return searchableText.includes(normalizedSearch);
    });
  }, [shopping, normalizedSearch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-500">Cargando compras...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Mis Compras</h1>

      {filteredPurchases.length === 0 ? (
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <p className="text-gray-500">No se encontraron compras.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
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
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPurchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(purchase.date).toLocaleDateString("es-MX")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ${purchase.result.toFixed(2)}
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
      )}
    </div>
  );
}
