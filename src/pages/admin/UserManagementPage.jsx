import { useState } from "react";
import Paginator from "../../components/UI/Paginator";
import LoadingComponent from "../../components/UI/LoadingComponent";
import { useDeleteUser, useUsers } from "../../api/hooks/usersHooks";
import { ConfirmAction } from "../../components/UI/ConfirmAction";
import toast from "react-hot-toast";
import UserFormModal from "../../components/forms/UserFormModal";
import { useAuth } from "../../context/AuthContext"
import ErrorComponent from "../../components/UI/ErrorComponent";
import ProfilePhotoComponent from "../../components/UI/ProfilePhotoComponent";
import FiltersComponent from "../../components/forms/FiltersComponent";
import { useDebounce } from "../../api/hooks/useDebounce";

export default function UserManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState();
  const [userSelected, setUserSelected] = useState();
  const { mutateAsync: deleteUser } = useDeleteUser();
  const [search, setSearch] = useState("")
  const [state, setState] = useState("")
  const [role, setRole] = useState("")
  const debouncedSearch = useDebounce(search, 400)

  const { data: users, isLoading, isError, refetch } = useUsers({
    page: currentPage,
    limit: 10,
    status: state,
    search: debouncedSearch,
    role,
    debt: "all"
  });

  const { user } = useAuth();

  const handleFilter = (state, search, rol) => {
    setCurrentPage(1);
    setSearch(search);
    setState(state);
    setRole(rol);
    // console.log(state, search, rol)
  }

  const handleModal = (user, mode) => {
    setModalMode(mode);
    setUserSelected(user);
    setModalOpen(true);
  };

  const handleDelete = async (userId) => {
    ConfirmAction({
      title: "Deshabilitar usuario",
      text: "¿Está seguro de que deseas deshabilitar este usuario?",
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

  return (
    <div className="flex flex-col w-full h-full gap-2">

      {/* HEADER */}
      <FiltersComponent
        onApply={(f, t, u, state, search, rol) => { handleFilter(state, search, rol) }}
        button={true}
        buttonContent={
          <div className="flex flex-row justify-center items-center gap-2 w-35">
            <i className="pi pi-user-plus"></i>
            <p>Crear usuario</p>
          </div>
        }
        stateFilter={true}
        stateOptions={[
          { value: "all", label: "Todos los estados" },
          { value: "active", label: "Activo" },
          { value: "inactive", label: "Inactivo" }
        ]}
        rolFilter={true}
        buttonOnClick={() => handleModal(null, 'create')}
      />

      {/* TABLA */}
      <div className="bg-white rounded-lg h-full shadow w-full overflow-hidden">
        <div className="overflow-auto w-full h-full">
          {isLoading ? <LoadingComponent /> : isError ? <ErrorComponent refetch={refetch} /> : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-900 text-white sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-center text-xs font-bold uppercase">
                    Foto
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-bold uppercase">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-bold uppercase hidden md:table-cell">
                    Nombre de usuario
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-bold uppercase">
                    Rol
                  </th>
                  {/* <th className="px-6 py-3 text-center text-xs font-bold uppercase">
                    Deuda
                  </th> */}
                  <th className="px-6 py-3 text-center text-xs font-bold uppercase">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-bold uppercase flex justify-center">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {users?.docs?.map((item) => (

                  <tr key={item?._id} className="hover:bg-gray-50">

                    <td className="px-6 py-4 flex justify-center items-center">
                      <ProfilePhotoComponent iconStyle={'text-xl'} size={'h-10 w-10 border-2!'} image={item?.profilePhoto?.url} />
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-gray-900 text-center">
                      {item?.firstName} {item?.lastName}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900 hidden md:table-cell text-center">
                      {item?.username}
                    </td>

                    <td className="px-1 md:px-6 py-4 text-sm text-center">
                      <span
                        className={`px-2 py-1 rounded-full font-semibold text-xs ${item?.role === "admin"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                          }`}
                      >
                        {item?.role === 'admin' ? "ADMIN" : "USUARIO"}
                      </span>
                    </td>

                    {/* <td className="px-6 py-4 text-sm text-center">
                        <span
                          className={`${item?.debt > 0
                            ? "text-red-600 font-semibold"
                            : "text-green-600 font-semibold"
                            }`}
                        >
                          ${item?.debt.toFixed(2)}
                        </span>
                      </td> */}

                    <td className="px-2 py-4 md:px-6 text-center">
                      <span
                        className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${item?.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {item?.status === 'inactive' ? "INACTIVO" : "ACTIVO"}
                      </span>
                    </td>

                    <td className="text-sm font-medium align-middle">
                      <div className="flex flex-row items-center justify-center gap-0">
                        <button
                          className="text-blue-800 mr-3 cursor-pointer hover:scale-140
                                  transform transition-all duration-200 ease-in-out"
                          onClick={() => handleModal(item, "view")}
                          title="Ver usuario"
                        >
                          <i className="pi pi-eye text-base md:text-sm"></i>
                        </button>

                        {item?._id === user.userId ? "" : (
                          <>
                            <button
                              className={`text-blue-800 mr-3 cursor-pointer hover:scale-140
                            transform transition-all duration-200 ease-in-out`}
                              onClick={() => handleModal(item, "edit")}
                              title="Editar usuario"
                            >
                              <i className="pi pi-pencil text-base md:text-sm"></i>
                            </button>

                            <button
                              className={`text-red-600 hover:text-red-800 cursor-pointer hover:scale-140
                          transform transition-all duration-200 ease-in-out`}
                              onClick={() => handleDelete(item?._id)}
                              title="Deshabilitar usuario"
                            >
                              <i className="pi pi-user-minus text-base md:text-sm"></i>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>

                ))}
              </tbody>
            </table>
          )}
        </div>
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
