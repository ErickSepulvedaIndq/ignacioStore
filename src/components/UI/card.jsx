//tal vez el handleBuyNow deberia ir en otro componente para no mezclar responsabilidades el handleBuyNow
import Plus from "../../assets/plus.png";
import Minus from "../../assets/minus.png";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { buyProduct } from "../../services/productService";
import { Toast, showToast } from "./toast";
import { showBuyConfirmDialog } from "./buyConfirmDialog";

export default function Card({
  productName,
  description,
  price,
  img,
  productId,
  stock,
}) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, cartItems } = useCart();

  const currentInCart = cartItems
    .filter((item) => item.id === productId)
    .reduce((acc, item) => acc + item.quantity, 0);

  const normalizedStock = typeof stock === "number" ? stock : Number(stock);
  const availableStock = Number.isFinite(normalizedStock)
    ? Math.max(0, normalizedStock - currentInCart)
    : Infinity;

  const isOutOfStock = availableStock === 0;

  const handleButtonChange = (value) => {
    const numValue = Number(value);
    if (isNaN(numValue) || numValue < 1) {
      setQuantity(1);
      return;
    }
    if (numValue > availableStock) {
      setQuantity(availableStock);
      return;
    }
    setQuantity(numValue);
  };

  const handleInputValidation = (value) => {
    if (value === "" || value < 1) {
      setQuantity(1);
      return;
    }
    const numValue = Number(value);
    if (numValue > availableStock) {
      setQuantity(availableStock);
      return;
    }
    setQuantity(numValue);
  };

  const handleAddToCart = () => {
    const safeQuantity = Number(quantity) || 1;

    // este mensaje sale si quieres meter mas piezas de las que hay en tienda estando en el carrito
    if (safeQuantity > availableStock) {
      showToast({
        icon: "error",
        title: "no se puede agregar porque no hay stock",
        position: "top",
        timer: 1200,
      });
      return;
    }
    // estructura del producto para el carrito normalizada con _id y id
    const product = {
      _id: productId,
      id: productId,
      name: productName,
      price: parseFloat(price),
      img: img,
      imageUrl: img,
    };

    const wasAdded = addToCart(product, safeQuantity, stock);

    if (!wasAdded) {
      return;
    }

    // este mensaje sale cuando si se guardo en el carrito
    showToast({
      icon: "success",
      title: `${safeQuantity} ${productName} agregado al carrito`,
      position: "top",
      timer: 1200,
    });

    // resetear el valor
    setQuantity(1);
  };

  const handleBuyNow = async () => {
    const safeQuantity = Number(quantity) || 1;

    // este mensaje sale si quieres comprar algo sin piezas disponibles
    if (safeQuantity > availableStock) {
      Toast.fire({
        icon: "error",
        title: "no se puede comprar porque no hay stock",
        position: "top",
        timer: 900,
      });
      return;
    }
    // mostrar dialog de confirmación con detalles del producto
    const confirm = await showBuyConfirmDialog({
      img,
      productName,
      price,
      quantity: safeQuantity,
    });

    if (!confirm.isConfirmed) return;

    try {
      await buyProduct([{ id: productId, quantity: safeQuantity }]);

      // este mensaje sale cuando la compra termino bien
      Toast.fire({
        icon: "success",
        title: "Compra realizada exitosamente",
        position: "top",
        timer: 1000,
      });

      setQuantity(1);
    } catch (error) {

      // este mensaje sale si la api responde con error al comprar
      Toast.fire({
        icon: "error",
        title:
          error.response?.data?.message || "No se pudo completar la compra",
        position: "top",
        timer: 900,
      });
    }
  };

  return (
    <>
      <div className="p-10 ">
        <div
          className={`group relative bg-[#0000000D] rounded-lg w-69 hover:scale-105 transition-all duration-300 ${stock === 0 ? " border-2 border-red-200" : stock > 0 && stock < 10 ? "border-2 border-yellow-100" : ""}`}
        >
          <div className="flex items-center justify-center py-3 px-1">
            <img
              src={img}
              alt={productName}
              className="h-40 w-50 object-contain"
            />
          </div>
          <h2 className="font-bold pb-2 pl-2">{productName}</h2>
          <p className="font-bold pb-2 pl-2 ml-1.5">${price}</p>
          <p className="hidden group-hover:[display:-webkit-box] text-sm leading-5 font-medium text-gray-600 px-4 pb-2 overflow-hidden [-webkit-line-clamp:3] [-webkit-box-orient:vertical]">
            {description || "Sin descripción"}
          </p>
          <div className="flex items-center justify-center gap-10 mt-3 mb-7">
            <img
              src={Minus}
              alt="Plus"
              className="h-7 hover:rounded-full hover:scale-125 cursor-pointer mr-1.5 transition-all duration-200"
              onClick={() => handleButtonChange(quantity - 1)}
              disabled={isOutOfStock}
            />
            <input
              type="number"
              value={quantity ? (isOutOfStock ? 0 : quantity) : 1}
              onChange={(e) => setQuantity(e.target.value)}
              onBlur={(e) => handleInputValidation(e.target.value)}
              className="w-6 text-center font-bold bg-transparent border-0 focus:outline-none focus:bg-white/20 rounded-md transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              min="1"
              max={availableStock}
            />
            <img
              src={Plus}
              alt="Minus"
              className="h-7 hover:rounded-full hover:scale-125 cursor-pointer transition-all duration-200"
              onClick={() => {
                if (quantity >= availableStock) return;
                handleButtonChange(quantity + 1);
              }}
              style={{ opacity: quantity >= availableStock ? 0.5 : 1 }}
            />
          </div>
          <div
            className="max-h-0 overflow-hidden
                group-hover:max-h-40
                transition-all duration-300 group-hover:pt-4"
          >
            <div className="flex flex-col gap-2">
              <button
                className="w-full bg-[#3041A0] p-2 text-white rounded-lg cursor-pointer hover:bg-[#25327D] disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                Agregar al carrito
              </button>

              <button
                className="w-full bg-[#FFA41C] p-2 text-white rounded-lg cursor-pointer hover:bg-[#FF8F00] disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
              >
                Comprar
              </button>
              {isOutOfStock && (
                <p className="text-red-500 text-center font-semibold">
                  Agotado
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
