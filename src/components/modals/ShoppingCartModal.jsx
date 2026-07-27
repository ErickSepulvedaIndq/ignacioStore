import Swal from "sweetalert2";
import { useBuyProducts, useGetCartProducts } from "../../api/hooks/productsHooks";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import InputNumberShoppingCart from "../UI/InputNumberShoppingCart";
import CartProductCard from "../UI/CartProductCard";

const ShoppingCartModal = ({ onClose, isCartOpen, productsNumber }) => {
    const { user } = useAuth();
    const { data: cartProducts } = useGetCartProducts(user?.userId);
    const { mutateAsync: buyProducts } = useBuyProducts();

    productsNumber(
        cartProducts?.data?.reduce((count, item) => count + item.quantity, 0)
    )

    const getCartTotal = () => {
        return cartProducts?.data?.filter((p) => p.product_id.stock !== 0).reduce(
            (total, item) => total + item?.product_id?.price * item.quantity,
            0,
        );
    }

    const handleConfirmPurchase = async () => {
        if (getCartTotal() === 0) return toast.error('No puede comprar productos agotados, agregue productos para realizar una compra.');

        const confirm = await Swal.fire({
            title: "Confirmar compra",
            text: "Realizar la compra?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Confirmar",
            cancelButtonText: "Cancelar",
        });

        if (!confirm.isConfirmed) return;

        const products = cartProducts?.data?.map(item => ({
            id: item?.product_id?._id,
            quantity: item?.quantity
        }))

        toast.promise(
            buyProducts({ products }),
            {
                loading: 'Comprando...',
                success: 'Compra hecha!',
                error: (err) => {
                    console.error(err);
                    if (err.response.data.message === 'Supera el stock') {
                        return (
                            <div className="flex flex-col">
                                <p className="font-semibold">Supera la cantidad máxima de stock.</p>
                                <p>Verifique su carrito de compras.</p>
                            </div>
                        )
                    } else return 'Error al realizar la compra, intente más tarde.'
                }
            }
        )
    }

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/50 z-40  transition-all duration-300 ${isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={onClose}
            />
            <div
                className={`fixed top-0 right-0 h-full w-90 bg-white shadow-2xl z-50 transform 
                    transition-transform duration-400 ease-in-out ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex flex-col h-full">
                    {/* Header del carrito */}
                    <div className="bg-[#3041A0] text-white p-4 flex justify-between items-center shadow">
                        <h2 className="flex items-center gap-2 font-bold text-xl text-shadow-lg">
                            <i className="pi pi-shopping-cart text-2xl"></i>
                            Carrito de Compras
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-2xl cursor-pointer transition-all duration-200 ease-in-out hover:scale-145 hover:text-red-400 active:scale-100"
                        >
                            ×
                        </button>
                    </div>

                    {/* Contenido del carrito */}
                    <div className="flex-1 overflow-x-auto p-4">
                        {cartProducts?.data?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <p className="text-lg">Tu carrito está vacío</p>
                                <p className="text-sm mt-2">¡Agrega productos para comenzar!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cartProducts?.data.map((item) => (
                                    <CartProductCard product={item} />
                                ))}
                            </div>
                        )}
                    </div>

                    {(cartProducts?.data.length > 0) && (
                        <div className="border-t p-4 bg-gray-50">
                            <div className="flex justify-between items-center mb-4">
                                <span className="font-bold text-lg text-gray-800">Total:</span>
                                <span className="font-bold text-xl text-[#3041A0]">
                                    ${getCartTotal().toFixed(2)}
                                </span>
                            </div>
                            <button className="w-full bg-[#3041A0] text-white py-3 rounded-lg hover:bg-[#25327D] transition font-bold cursor-pointer"
                                onClick={handleConfirmPurchase}
                            >
                                Proceder al Pago
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    )


}

export default ShoppingCartModal;