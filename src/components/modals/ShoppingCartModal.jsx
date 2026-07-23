import Swal from "sweetalert2";
import { useAddProductsToCart, useBuyProducts, useGetCartProducts, useRemoveProductsFromCart } from "../../api/hooks/productsHooks";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import InputNumberShoppingCart from "../UI/InputNumberShoppingCart";
import { useRef } from "react";

const ShoppingCartModal = ({ onClose, isCartOpen, productsNumber }) => {
    const { user } = useAuth();
    const { data: cartProducts } = useGetCartProducts(user?.userId);
    const { mutateAsync: buyProducts } = useBuyProducts();
    const { mutateAsync: removeFromCart } = useRemoveProductsFromCart();
    const { mutateAsync: addToCart } = useAddProductsToCart();
    const debounceRef = useRef(null);

    productsNumber(
        cartProducts?.data?.reduce((count, item) => count + item.quantity, 0)
    )

    console.log(cartProducts?.data)

    const getCartTotal = () => {
        return cartProducts?.data?.reduce(
            (total, item) => total + item?.product_id?.price * item.quantity,
            0,
        );
    }

    const handleRemoveFromCart = async (productId, quantity) => {
        try {
            await removeFromCart({ userId: user.userId, productId, quantity })
        } catch (error) {
            console.error(error)
        }
    }

    const handleAddToCart = async (productId, quantity) => {
        try {
            await addToCart({ productId, quantity, userId: user.userId })
        } catch (error) {
            console.error(error)
        }
    }

    const handleChangeQuantity = (productId, inputValue, currentQuantity) => {
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            if (inputValue > currentQuantity) { // agregamos al carrito
                handleAddToCart(productId, inputValue - currentQuantity)
            } else if (inputValue < currentQuantity) { // quitamos del carrito
                handleRemoveFromCart(productId, currentQuantity - inputValue)
            }
        }, 400);
    }

    const handleConfirmPurchase = async () => {
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
                    return 'Error al realizar la compra, intente más tarde.'
                }
            }
        )
    }

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/50 z-40  transition-all duration-300 ${isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={onClose}
            />
            <div
                className={`fixed top-0 right-0 h-full w-90 bg-white shadow-2xl z-50 transform transition-transform duration-400 ease-in-out ${isCartOpen ? "translate-x-0" : "translate-x-full"
                    }`}
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
                        {cartProducts?.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <p className="text-lg">Tu carrito está vacío</p>
                                <p className="text-sm mt-2">¡Agrega productos para comenzar!</p>
                            </div>
                        ) : (
                            <ul className="space-y-4">
                                {cartProducts?.data.map((item) => (
                                    <li
                                        key={item?._id}
                                        className="flex flex-row items-center relative p-3 rounded-lg shadow-custom gap-2 transition"
                                    >
                                        <button
                                            onClick={() => handleRemoveFromCart(item?.product_id?._id, item.quantity)}
                                            className="pi pi-trash text-gray-500 absolute top-2 right-2 hover:scale-120 hover:text-red-700 cursor-pointer transition ease-in-out duration-150"
                                            title="Quitar del carrito"
                                        ></button>

                                        <div className="w-23 h-23 rounded border border-gray-100 overflow-hidden bg-gray-50">
                                            <img
                                                src={item?.product_id?.image?.url}
                                                alt={item?.product_id?.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-row">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-sm text-gray-800 truncate w-50">
                                                        {item?.product_id?.name}
                                                    </h3>
                                                    <p className="font-semibold text-xs text-gray-500 line-clamp-2 w-53">
                                                        {item?.product_id?.description === " " ? 'Sin descripción.' : item?.product_id?.description}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-row justify-between items-end pr-2">

                                                <div className="flex w-fit flex-col items-center text-xs gap-1">
                                                    <div className="flex items-center gap-1">
                                                        <InputNumberShoppingCart key={item?.quantity} currentQuantity={item?.quantity} stock={item?.product_id?.stock} onChange={(v) => handleChangeQuantity(item?.product_id?._id, v, item?.quantity)} />
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-center">
                                                    <p className="text-xs border-b border-gray-500 w-full text-gray-500">{`$${item?.product_id?.price.toFixed(2)} x ${item?.quantity} U.`}</p>
                                                    <div className="flex flex-row font-bold text-sm gap-1">
                                                        <p className="text-gray-600">Sub.</p>
                                                        <p className="text-green-700"> {`$${(item?.product_id?.price * item?.quantity).toFixed(2)}`}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>


                    {cartProducts?.data.length > 0 && (
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