import { useState } from "react";
// import { useSearch } from "../../context/SearchContext";
import Paginator from "../../components/UI/Paginator";
import LoadingComponent from "../../components/UI/LoadingComponent";
import { useDeleteUser, useUsers } from "../../api/hooks/usersHooks";
import { ConfirmAction } from "../../components/UI/ConfirmAction";
import toast from "react-hot-toast";
import UserFormModal from "../../components/forms/UserFormModal";
import { useAuth } from "../../context/AuthContext"

export default function UserManagementPage() {
  // const { normalizedSearch } = useSearch();
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState();
  const [userSelected, setUserSelected] = useState();
  const { data: users, isLoading } = useUsers(currentPage, 10);
  const { mutateAsync: deleteUser } = useDeleteUser();
  const { user } = useAuth();

  const handleModal = (user, mode) => {
    setModalMode(mode);
    setUserSelected(user);
    setModalOpen(true);
  };

  const handleDelete = async (userId) => {
    ConfirmAction({
      title: "Deshabilitar usuario",
      text: "¿Está seguro de que deseas deshabilitar este usuario? Esta acción no se puede deshacer.",
      icon: "warning",
      confirmButtonText: "Sí, deshabilitar",
      cancelButtonText: "No, cancelar",
      onConfirm: async () => {
        toast.promise(
          deleteUser({ userId }),
          {
            loading: "Deshabilitando usuario...",
            success: "Usuario deshabilitado correctamente!",
            error: (e) => {
              console.error(e);
              return "Error al deshabilitar usuario, inténtelo más tarde."
            }
          }
        )
      },
    });
  };

  if (isLoading) {
    return <LoadingComponent />;
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
          onClick={() => handleModal(null, 'create')}
        >
          + Nuevo Usuario
        </button>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-lg shadow overflow-hidden h-[64vh]">
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
              <th className="px-6 py-3 text-left text-xs font-medium uppercase flex justify-center">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {users?.docs?.map((item) => (
              <tr key={item?._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {item?.firstName} {item?.lastName}
                </td>

                <td className="px-6 py-4 text-sm text-gray-900">
                  {item?.username}
                </td>

                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${item?.role === "admin"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
                      }`}
                  >
                    {item?.role}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm">
                  <span
                    className={`${item?.debt > 0
                      ? "text-red-600 font-semibold"
                      : "text-green-600 font-semibold"
                      }`}
                  >
                    ${item?.debt.toFixed(2)}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${item?.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                      }`}
                  >
                    {item?.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm font-medium flex flex-row justify-center">
                  <button
                    className={`text-[#3041A0] hover:text-[#25327D] mr-3 cursor-pointer hover:scale-140 
                    transform transition-all duration-200 ease-in-out ${item._id === user.userId ? "hidden" : ''}`}
                    onClick={() => handleModal(item, "edit")}
                  >
                    <i className="pi pi-pencil"></i>
                  </button>

                  <button
                    className="text-[#3041A0] hover:text-[#25327D] mr-3 cursor-pointer hover:scale-140
                    transform transition-all duration-200 ease-in-out"
                    onClick={() => handleModal(item, "view")}
                  >
                    <i className="pi pi-eye"></i>
                  </button>

                  <button
                    className={`text-red-600 hover:text-red-800 cursor-pointer hover:scale-140
                    transform transition-all duration-200 ease-in-out ${item._id === user.userId ? "hidden" : ''}`}
                    onClick={() => handleDelete(item?._id)}
                    title="Deshabilitar usuario"
                  >
                    <i className="pi pi-user-minus"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Paginator
        currentPage={currentPage}
        totalPages={users?.totalPages}
        onPageChange={(p) => setCurrentPage(p)}
        loading={isLoading}
      />

      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        user={userSelected}
        mode={modalMode}
      />
    </div>
  );
}
