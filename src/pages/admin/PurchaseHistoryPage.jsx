import { useState } from "react";
import Paginator from "../../components/UI/Paginator";
import LoadingComponent from "../../components/UI/LoadingComponent";
import ErrorComponent from "../../components/UI/ErrorComponent";
import FiltersComponent from "../../components/forms/FiltersComponent";
import GenerateReportModal from "../../components/modals/GenerateReportModal";
import ProfilePhotoComponent from "../../components/UI/ProfilePhotoComponent";
import { useUsers } from "../../api/hooks/usersHooks";
import Swal from "sweetalert2";
import UserPaymentHistoryModal from "../../components/modals/UserPaymentHistoryModal";
import confetti from "canvas-confetti";
import toast from "react-hot-toast";
import { useMarkTotalDebtAsPaid } from "../../api/hooks/buyLogsHooks";

export default function PurchaseHistoryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpenReport, setIsOpenModalReport] = useState(false)
  const [isOpenUserPaymentHistory, setIsOpenUserPaymentHistory] = useState(false)
  const { data: users, isLoading, isError, refetch } = useUsers(currentPage, 10);
  const [user, setUser] = useState(null);
  const { mutateAsync: markTotalDebtAsPaid } = useMarkTotalDebtAsPaid();

  const handleFilter = () => {
    // console.log(from, to, uid)
    // setFromDate(from);
    // setToDate(to);
    // setUserId(uid || null);
    // setCurrentPage(1);
  };


  const handleCollectPayment = async (user) => {
    // validar que payment existe
    if (!user) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo obtener los datos de la compra"
      });
      return;
    }

    // confirmación antes de cobrar
    const result = await Swal.fire({
      title: "¿Seguro que quiere cobrar el total?",
      text: `Cobrar $${user?.debt.toFixed(2)} a ${user?.firstName} ${user?.lastName}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3041A0",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar"
    });

    if (!result.isConfirmed) return;

    toast.promise(
      markTotalDebtAsPaid({ userId: user?._id }),
      {
        isLoading: "Cobrando...",
        success: () => {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            zIndex: 9999,
          });
          return "Listo!"
        },
        error: (e) => {
          console.error(e);
          return "Error al cobrar, intente de nuevo más tarde."
        }
      }
    )
  };

  return (
    <div className="flex flex-col w-full h-full gap-2">
      <FiltersComponent
        searchFilter={false}
        userFilter={true}
        stateFilter={true}
        dateRangeFilter={false}
        onApply={handleFilter}
        button={true}
        buttonContent={
          <div className="flex flex-row justify-center items-center gap-2 w-35">
            <i className="pi pi-file-export"></i>
            <p>Generar reporte</p>
          </div>
        }
        buttonOnClick={() => { setIsOpenModalReport(true) }}
      />


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
                  <th className="px-6 py-3 text-center text-xs font-bold uppercase">
                    Deuda total
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-bold uppercase">
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

                    <td className="px-2 py-4 md:px-6 text-center">
                      <span
                        className={`inline-flex font-semibold rounded-full ${item?.debt === 0
                          ? "text-green-500"
                          : "text-red-500"
                          }`}
                      >
                        {`$${item?.debt.toFixed(2)}`}
                      </span>
                    </td>


                    <td className="text-sm font-medium align-middle">
                      <div className="flex flex-row items-center justify-center gap-0">
                        <button
                          className="text-blue-800 mr-3 cursor-pointer hover:scale-140
                            transform transition-all duration-200 ease-in-out pointer-fine:pointer-events-auto"
                          aria-label="View product"
                          title="Ver historial"
                          onClick={() => { setIsOpenUserPaymentHistory(true); setUser(item?._id) }}
                        >
                          <i className="pi pi-eye text-base md:text-lg"></i>
                        </button>
                        <button
                          className={`text-green-600 mr-3 cursor-pointer hover:scale-140
                              transform transition-all duration-200 ease-in-out 
                              pointer-fine:pointer-events-auto ${item?.debt === 0 ? "hidden" : ""}`}

                          title="Cobrar Total"
                          onClick={() => handleCollectPayment(item)}
                        >
                          <i className="pi pi-money-bill text-base md:text-lg"></i>
                        </button>
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

      <UserPaymentHistoryModal isOpen={isOpenUserPaymentHistory} onClose={() => { setIsOpenUserPaymentHistory(false); setUser(null) }} userId={user} />
      <GenerateReportModal isOpen={isOpenReport} onClose={() => setIsOpenModalReport(false)} />
    </div>
  );
}