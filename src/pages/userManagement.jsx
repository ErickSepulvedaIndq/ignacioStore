import { useState, useEffect, useMemo } from "react";
import { useSearch } from "../context/SearchContext";
import Paginator from "../components/UI/Paginator";
import Loading from "../components/UI/Loading";
import RegisterUserForm from "../components/forms/RegisterUser";
import UserDetailsForm from "../components/forms/UserDetailsForm";
import { ConfirmAction } from "../components/UI/ConfirmAction";
import Swal from "sweetalert2";
import { getAllUsers, deleteUser } from "../api/userService";

export default function UserManagement() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" o "edit"
  const [selectedUserId, setSelectedUserId] = useState(null);

  const pageSize = 10;
  const { normalizedSearch } = useSearch();

  const handleCreateModal = () => {
    setModalMode("create");
    setSelectedUserId(null);
    setModalOpen(true);
  };

  const handleEditModal = (userId) => {
    setModalMode("edit");
    setSelectedUserId(userId);
    setModalOpen(true);
  };

  const handleViewModal = (userId) => {
    setModalMode("view");
    setSelectedUserId(userId);
    setModalOpen(true);
  };

  const handleDelete = async (userId) => {
    ConfirmAction({
      title: "Eliminar usuario",
      text: "¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.",
      icon: "warning",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No, cancelar",
      onConfirm: async () => {
        try {
          await deleteUser(userId);
          await fetchUsers(currentPage);
          Swal.fire({
            icon: "success",
            title: "Usuario eliminado",
            text: "El usuario ha sido eliminado exitosamente.",
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Ocurrió un error",
            text: error.message || "Intenta nuevamente",
          });
        }
      },
    });
  };

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);

      const response = await getAllUsers(page, pageSize);

      const data = response?.docs || [];
      setUsuarios(data);
      setTotalPages(response?.totalPages || 1);
      setCurrentPage(response?.page || 1);
    } catch (error) {
      setUsuarios([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, []);

  // filtra segun lo que se escribe en el buscador
  const filteredUsers = useMemo(() => {
    if (!normalizedSearch) return usuarios || [];

    return (usuarios || []).filter((user) => {
      const searchableText =
        `${user.firstName} ${user.lastName} ${user.username} ${user.role} ${user.status} ${user.debt}`.toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [usuarios, normalizedSearch]);

  // cambia la pagina y sube al inicio
  const handlePageChange = (page) => {
    fetchUsers(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Administrar Usuarios
        </h1>

        <button
          className="bg-[#3041A0] hover:bg-[#5060be] text-white px-6 py-2 rounded-lg font-semibold transition cursor-pointer"
          onClick={handleCreateModal}
        >
          + Nuevo Usuario
        </button>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#3041A0] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                Deuda
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((usuario) => (
              <tr key={usuario._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {usuario.firstName} {usuario.lastName}
                </td>

                <td className="px-6 py-4 text-sm text-gray-900">
                  {usuario.username}
                </td>

                <td className="px-6 py-4 text-sm">
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

                <td className="px-6 py-4 text-sm">
                  <span
                    className={`${
                      usuario.debt > 0
                        ? "text-red-600 font-semibold"
                        : "text-green-600 font-semibold"
                    }`}
                  >
                    ${usuario.debt.toFixed(2)}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
                      usuario.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {usuario.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm font-medium">
                  <button
                    className="text-[#3041A0] hover:text-[#25327D] mr-3 cursor-pointer hover:scale-140 
                    transform transition-all duration-200 ease-in-out"
                    onClick={() => handleEditModal(usuario._id)}
                  >
                    <i className="pi pi-pencil"></i>
                  </button>

                  <button
                    className="text-[#3041A0] hover:text-[#25327D] mr-3 cursor-pointer hover:scale-140
                    transform transition-all duration-200 ease-in-out"
                    onClick={() => handleViewModal(usuario._id)}
                  >
                    <i className="pi pi-eye"></i>
                  </button>

                  <button
                    className="text-red-600 hover:text-red-800 cursor-pointer hover:scale-140
                    transform transition-all duration-200 ease-in-out"
                    onClick={() => handleDelete(usuario._id)}
                  >
                    <i className="pi pi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  No se encontraron usuarios
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Paginator
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        loading={loading}
      />

      {/* CREATE */}
      {modalMode === "create" && (
        <RegisterUserForm
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={() => fetchUsers(currentPage)}
        />
      )}

      {/* EDIT / VIEW */}
      {(modalMode === "edit" || modalMode === "view") && (
        <UserDetailsForm
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={() => fetchUsers(currentPage)}
          userId={selectedUserId}
          mode={modalMode}
        />
      )}
    </div>
  );
}
