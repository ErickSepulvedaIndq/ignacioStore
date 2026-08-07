import { useState } from "react";
import { useBuyLogs, useMarkBuyLogAsPaid, useMarkTotalDebtAsPaid } from "../../api/hooks/buyLogsHooks";
import FiltersComponent from "../forms/FiltersComponent";
import CustomButtonComponent from "../UI/CustomButtonComponent";
import ProfilePhotoComponent from "../UI/ProfilePhotoComponent";
import ModalComponent from "./ModalComponent";
import Paginator from "../UI/Paginator";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import LoadingComponent from "../UI/LoadingComponent";
import ErrorComponent from "../UI/ErrorComponent";
import PurchaseDetailModal from "../UI/purchaseDetailModal";
import confetti from "canvas-confetti";
import { useUser } from "../../api/hooks/usersHooks";


const UserPaymentHistoryModal = ({ isOpen, onClose, userId }) => {

    const [page, setPage] = useState(1)
    const { data: user } = useUser(userId)
    const { data: buyLogs, isError, isLoading, refetch } = useBuyLogs(user?._id, page, 10);
    const { mutateAsync: markAsPaid } = useMarkBuyLogAsPaid()
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { mutateAsync: markTotalDebtAsPaid } = useMarkTotalDebtAsPaid();

    const handleCollectTotalPayment = async () => {
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

        confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            zIndex: 9999,
        });

        //tiramos confetti de prueba

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
    }

    const handleCollectPayment = async (payment) => {
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
            text: `Cobrar $${payment.totalCost.toFixed(2)} a ${payment?.userSnapshot?.firstName} ${payment?.userSnapshot?.lastName}`,
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
            markAsPaid({ userId: payment?.id_user, buyLogId: payment?._id, amount: payment?.totalCost }),
            {
                isLoading: 'Cobrando...',
                success: () => {
                    confetti({
                        particleCount: 120,
                        spread: 80,
                        origin: { y: 0.6 },
                        zIndex: 9999,
                    });

                    return 'Listo!'
                },
                error: (e) => {
                    console.error(e);
                    return "Error al cobrar, intente más tarde."
                }
            }
        )


    };

    return (
        <ModalComponent
            isOpen={isOpen}
            onClose={onClose}
            title={"Historial de compras"}
            childrenStyles={'p-0!'}
        >
            <div className="md:max-w-lg max-w-[calc(100svw-30px)] h-[calc(100svh-120px)] overflow-hidden p-1 flex flex-col gap-2">
                <div className="shadow-custom-xs rounded p-2 flex flex-row gap-4 justify-between">
                    <div className="flex flex-row gap-3 items-center">
                        <div className="hidden md:flex justify-center items-center">
                            <ProfilePhotoComponent image={user?.profilePhoto?.url} size={'h-14 w-14 border-2!'} iconStyle={"text-xl"} />
                        </div>

                        <div>
                            <p className="font-semibold text-sm md:text-bases text-gray-800">{`${user?.firstName} ${user?.lastName}`}</p>

                            <h1 className={`rounded p-1 text-xs font-bold text-center w-fit uppercase text-white shadow-custom
                            ${user?.role === "admin" ? "bg-yellow-600 " : "bg-blue-600"}`}>
                                {user?.role}
                            </h1>
                        </div>
                    </div>

                    <div className="flex flex-col items-end">
                        <div className="flex flex-row gap-1 items-center ">
                            <h2 className="font-bold text-gray-600 text-sm">Deuda total:</h2>
                            <p className={`font-semibold text-base ${user?.debt === 0 ? "text-green-600" : "text-red-600"}`} >{`$${user?.debt.toFixed(2)}`}</p>
                        </div>

                        <CustomButtonComponent disabled={user?.debt === 0} onClick={handleCollectTotalPayment} buttonStyles={"bg-green-700 w-full"}>
                            <i className="pi pi-money-bill text-base md:text-lg"></i>
                            <p className="text-xs md:text-base">Cobrar total</p>
                        </CustomButtonComponent>
                    </div>

                </div>
                <div className="shadow-custom-xs rounded p-2 md:p-4 flex flex-col gap-2 flex-1 min-h-0">
                    <h1 className="text-base md:text-lg font-bold text-gray-600">Compras realizadas</h1>
                    <FiltersComponent searchFilter={false} stateFilter={true} dateRangeFilter={true} onApply={() => { }} />

                    {/* tabla */}
                    <div className="bg-white rounded-lg h-full shadow min-w-full overflow-hidden">
                        <div className="overflow-auto w-full h-full">
                            {isLoading ? <LoadingComponent /> : isError ? <ErrorComponent refetch={refetch} /> : (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-blue-900 text-white sticky top-0">
                                        <tr>
                                            <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider hidden md:table-cell">
                                                Fecha Compra
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider">
                                                Monto Compra
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {buyLogs?.data?.docs.map((payment) => (
                                            <tr key={payment?._id} className="hover:bg-gray-50">

                                                <td className="px-6 py-4 text-center text-sm text-gray-900 hidden md:table-cell">
                                                    {new Date(payment?.createdAt).toLocaleDateString("es-MX")}
                                                </td>

                                                <td className="px-6 py-4  text-sm text-gray-900 text-center">
                                                    {`$${payment?.totalCost.toFixed(2)}`}
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span
                                                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${payment?.isPaid
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                            }`}
                                                    >
                                                        {payment?.isPaid ? "PAGADO" : "PENDIENTE"}
                                                    </span>
                                                </td>

                                                <td className="text-sm font-medium align-middle">
                                                    <div className="flex flex-row items-center justify-center gap-0">
                                                        <button
                                                            className="text-blue-800 mr-3 cursor-pointer hover:scale-140
                                                               transform transition-all duration-200 ease-in-out pointer-fine:pointer-events-auto"
                                                            aria-label="View product"
                                                            title="Ver historial"
                                                            onClick={() => { setShowModal(true); setSelectedPurchase(payment) }}
                                                        >
                                                            <i className="pi pi-eye text-base md:text-lg"></i>
                                                        </button>
                                                        <button
                                                            className={`text-green-600 mr-3 cursor-pointer hover:scale-140
                                                               transform transition-all duration-200 ease-in-out 
                                                            pointer-fine:pointer-events-auto ${payment?.isPaid ? "hidden" : ""}`}

                                                            title="Cobrar"
                                                            onClick={() => handleCollectPayment(payment)}
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
                        currentPage={page}
                        totalPages={buyLogs?.data?.totalPages}
                        onPageChange={(p) => setPage(p)}
                        loading={isLoading}
                    />

                    <PurchaseDetailModal
                        isOpen={showModal}
                        purchase={selectedPurchase}
                        onClose={() => {
                            setShowModal(false);
                            setSelectedPurchase(null);
                        }}
                    />
                </div>
            </div>
        </ModalComponent>
    )
}

export default UserPaymentHistoryModal;