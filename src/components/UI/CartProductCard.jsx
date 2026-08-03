import { useRef } from "react";
import InputNumberShoppingCart from "../UI/inputs/InputNumberShoppingCart";
import { useAddProductsToCart, useRemoveProductsFromCart } from "../../api/hooks/productsHooks";
import { useAuth } from "../../context/AuthContext";

const CartProductCard = ({ product }) => {
    const { mutateAsync: removeFromCart } = useRemoveProductsFromCart();
    const { mutateAsync: addToCart } = useAddProductsToCart();
    const debounceRef = useRef(null);
    const { user } = useAuth();
    const isOutOfStock = product?.product_id?.stock === 0;

    // console.log(product?.product_id?.name)
    // console.log(product);
    // console.log("fuera de stock?", isOutOfStock);

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

    return (
        <div
            className="flex flex-row items-center relative p-3 rounded-lg shadow-custom gap-2 transition"
        >
            <button
                onClick={() => handleRemoveFromCart(product?.product_id?._id, product.quantity)}
                className="pi pi-trash z-50 text-gray-500 absolute top-2 right-2 hover:scale-120 hover:text-red-700 cursor-pointer transition ease-in-out duration-150"
                title="Quitar del carrito"
            ></button>

            <div className="w-23 h-23 rounded border border-gray-100 overflow-hidden bg-gray-50">
                <img
                    src={product?.product_id?.image?.url}
                    alt={product?.product_id?.name}
                    className={`w-full h-full object-cover ${isOutOfStock ? "grayscale" : " "} `}
                />
            </div>

            <div className="flex flex-col gap-1<">
                <div className="absolute pointer-events-none w-full top-0 z-50 overflow-hidden right-0 h-30">
                    <div className={`absolute top-7 shadow-custom-xl p-1 -right-8 bg-purple-700 rotate-45 flex justify-center w-35 ${isOutOfStock ? "block" : "hidden"}`}>
                        <p className={`text-white text-center text-xs font-bold `}>
                            Agotado
                        </p>
                    </div>
                </div>
                <div className="flex flex-row">
                    <div className="flex-1">
                        <h3 className={`font-semibold text-sm ${isOutOfStock ? "text-gray-500" : "text-gray-800"} truncate w-50`}>
                            {product?.product_id?.name}
                        </h3>
                        <p className="font-semibold text-xs text-gray-500 line-clamp-2 w-53">
                            {product?.product_id?.description === " " ? 'Sin descripción.' : product?.product_id?.description}
                        </p>
                        <p className={`font-semibold text-xs pt-1 h-5 text-gray-600 line-clamp-2 w-53 ${isOutOfStock ? "opacity-0" : "opacity-100"}`}>
                            {`${product?.product_id?.stock} ${product?.product_id?.stock === 1 ? "disponible." : "disponibles."}`}
                        </p>
                    </div>
                </div>
                <div className="flex flex-row justify-between items-end pr-2">
                    <div className="flex w-fit flex-col items-center text-xs gap-1">
                        <div className="flex items-center gap-1">
                            <InputNumberShoppingCart key={product?.quantity} currentQuantity={product?.quantity} stock={product?.product_id?.stock} onChange={(v) => handleChangeQuantity(product?.product_id?._id, v, product?.quantity)} />
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="text-xs border-b border-gray-500 w-full text-gray-500">{`$${product?.product_id?.price.toFixed(2)} x ${product?.quantity} U.`}</p>
                        <div className="flex flex-row font-bold text-sm gap-1 ">
                            <p className="text-gray-600">Sub.</p>
                            <p className={` ${isOutOfStock ? "text-gray-500 line-through" : "text-green-600"}`} > {`$${(product?.product_id?.price * product?.quantity).toFixed(2)}`}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}


export default CartProductCard;