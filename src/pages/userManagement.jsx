import { useState, useEffect, useMemo } from "react";
import { useSearch } from "../context/SearchContext";
import Paginator from "../components/UI/Paginator";
import { userDemoRows } from "../models/user";

export default function UserManagement() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const { normalizedSearch } = useSearch();

  useEffect(() => {
    // TODO: Fetch usuarios desde API
    setTimeout(() => {
      setUsuarios(userDemoRows);
      setLoading(false);
      setCurrentPage(1);
    }, 500);
  }, []);

  // filtra segun lo que se escribe en el buscador
  const filteredUsers = useMemo(() => {
    if (!normalizedSearch) {
      return usuarios;
    }

    return usuarios.filter((userItem) => {
      const searchableText =
        `${userItem.firstName} ${userItem.lastName} ${userItem.role} ${userItem.status} ${userItem.debt}`.toLowerCase();
      return searchableText.includes(normalizedSearch);
    });
  }, [usuarios, normalizedSearch]);

  // calcula las paginas disponibles
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  // define el rango de datos de la pagina actual
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // cambia la pagina y sube al inicio
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-500">Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* titulo y boton principal */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Administrar Usuarios
        </h1>
        <button className="bg-[#3041A0] hover:bg-[#25327D] text-white px-6 py-2 rounded-lg font-semibold transition">
          + Nuevo Usuario
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* encabezado de la tabla */}
            <thead className="bg-[#3041A0] text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Deuda
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
              {paginatedUsers.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {usuario.firstName} {usuario.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        usuario.role === "admin"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {usuario.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${usuario.debt.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        usuario.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {usuario.status}
                    </span>
                  </td>
                  {/* aqui va el dialog de editar */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-[#3041A0] hover:text-[#25327D] mr-3"
                      aria-label="Edit user"
                      title="Edit user"
                    >
                      <i className="pi pi-pencil"></i>
                    </button>
                    {/* aqui va el dialog de desactivar */}
                    <button
                      className="text-red-600 hover:text-red-900"
                      aria-label="Deactivate user"
                      title="Deactivate user"
                    >
                      <i className="pi pi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    No se encontraron usuarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Paginator
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        loading={loading}
      />
    </div>
  );
}
