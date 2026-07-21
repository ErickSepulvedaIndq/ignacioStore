//tal vez el handleBuyNow deberia ir en otro componente para no mezclar responsabilidades el handleBuyNow
import Plus from "../../assets/plus.png";
import Minus from "../../assets/minus.png";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { buyProduct } from "../../api/productService";
import { Toast, showToast } from "./toast";
import { showBuyConfirmDialog } from "./buyConfirmDialog";
import { useEffect } from "react";

export default function Card({
  productName,
  description,
  price,
  img,
  productId,
  stock,
  reload
}) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, cartItems, setReloadProducts } = useCart();

  // le asignamos al contexto la función para recargar la lista productos en cuanto cargue el componente
  useEffect(() => {
    setReloadProducts(() => reload)
  }, [])

  // variable que filtra y cuenta la cantidad que hay de un mismo producto en el carrito
  const currentInCart = cartItems
    .filter((item) => item.id === productId)
    .reduce((acc, item) => acc + item.quantity, 0);

  // variable que normaliza el stock traído de la bd
  const normalizedStock = typeof stock === "number" ? stock : Number(stock);

  // variable que cambia dinámicamente restando lo actual en el carrito al stock (aquí esta el problema, ya que al hacer la compra y eliminar del carrito al cambiar dinamicamente vuelvo a tener el mismo stock )
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

  const handleAddToCart = async () => {
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

    const wasAdded = await addToCart(product, safeQuantity, stock);

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
      reload();
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
      <div
        className={`group relative bg-white z-10 hover:z-50 shadow rounded-lg hover:rounded-t-lg w-69 hover:scale-105 transition-all hover:duration-100 duration-300 ${!isOutOfStock ? "hover:rounded-b-none" : ''} `}
      >
        {/* Datos principales */}
        <div className="p-2 px-4">
          <div className="flex items-center justify-center py-3 px-1">
            <img
              src={img}
              alt={productName}
              className="h-40 w-50 object-contain"
            />
          </div>
          {isOutOfStock && (
            <p className="text-red-500 text-center font-bold">
              Agotado
            </p>
          )}
          <h2 className="font-bold pb-2">{productName}</h2>
          <p className="font-bold pb-2">Precio: <strong className="text-green-600">${price}</strong></p>
          <p className="text-sm leading-5 font-medium text-gray-600 pb-2 overflow-hidden [-webkit-line-clamp:3] [-webkit-box-orient:vertical]">
            {description || "Sin descripción"}
          </p>
        </div>
        <div
          className={`h-0 absolute flex justify-center items-center shadow rounded-b-lg bg-white w-full overflow-hidden
                group-hover:h-20
                transition-all duration-150 ${isOutOfStock ? "hidden" : ""}`}
        >
          <div className="flex m-2 flex-row gap-2 justify-between items-center">
            <div className="flex flex-col justify-center items-center h-full gap-2">
              <p className="text-gray-500 font-semibold text-[0.9rem]">Cantidad</p>
              <div className="flex flex-row justify-between items-center">
                <button
                  className="cursor-pointer text-lg font-bold h-7 w-7 disabled:text-gray-500 bg-gray-200 hover:bg-gray-300 transition ease-in-out rounded flex justify-center items-center"
                  onClick={() => handleButtonChange(quantity - 1)}
                  disabled={isOutOfStock}
                >-</button>
                <p
                  className="w-6 text-center font-bold"
                >{quantity ? (isOutOfStock ? 0 : quantity) : 1}</p>
                <button
                  className="cursor-pointer text-lg font-bold h-7 w-7 disabled:text-gray-500 bg-gray-200 hover:bg-gray-300 transition ease-in-out rounded flex justify-center items-center"
                  onClick={() => {
                    if (quantity >= availableStock) return;
                    handleButtonChange(quantity + 1);
                  }}
                  disabled={isOutOfStock}
                >+</button>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <button
                className="w-full h-7 text-xs flex flex-row items-center justify-center gap-2 bg-[#3041A0] py-1 px-4 text-white rounded-lg cursor-pointer hover:bg-[#25327D] disabled:cursor-not-allowed"
                onClick={handleAddToCart}
              >
                <i className="pi pi-shopping-cart text-base" />
                <span className="font-medium">Agregar al carrito</span>
              </button>

              <button
                className="w-full h-7 text-xs flex flex-row items-center justify-center gap-2 bg-yellow-500 py-1 px-4 text-white rounded-lg cursor-pointer hover:bg-yellow-600 disabled:cursor-not-allowed"
                onClick={handleBuyNow}
              >
                <i className="text-base" >$</i>
                <span className="font-bold">Comprar</span>
              </button>
            </div>

          </div>
        </div>
      </div>

    </>
  );
}
