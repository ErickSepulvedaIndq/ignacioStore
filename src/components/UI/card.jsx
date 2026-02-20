import Plus from "../../assets/plus.png";
import Minus from "../../assets/minus.png";
import { useState } from "react";
import { useCart } from "../../context/CartContext";

export default function Card({ productName, price, img, productId, stock}) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, cartItems } = useCart();

  const currentInCart = cartItems
  .filter(item => item.id === productId)
  .reduce((acc, item) => acc + item.quantity, 0);

  const normalizedStock = typeof stock === "number" ? stock : Number(stock);
  const availableStock = Number.isFinite(normalizedStock)
    ? Math.max(0, normalizedStock - currentInCart)
    : Infinity;


  const handleQuantityChange = (value) => {
    if (value < 1 || value > availableStock) {
      return;
    }
    setQuantity(value);
  };

  const handleAddToCart = () => {

    if (quantity > availableStock) {
      alert("No puedes agregar más productos de los disponibles en stock");
      return;
    }
    // estructura del producto para el carrito normalizada con _id y id
    const product = {
      _id: productId,
      id: productId,
      name: productName,
      price: parseFloat(price),
      img: img,
      imageUrl: img
    };

    addToCart(product, quantity, stock)

    // resetear el valor
    setQuantity(1);
  };

  return (
    <>
      <div className="p-10">
        <div className="group relative bg-[#0000000D] rounded-lg w-64 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-center py-4">
            <img src={img} alt={productName} className="h-50" />
          </div>
          <h2 className="font-bold pb-2 pl-2">{productName}</h2>
          <p className="font-bold pb-2 pl-2 ml-1.5">${price}</p>
          <div className="flex items-center justify-center gap-10 mt-3 mb-7">
            <img
              src={Minus}
              alt="Plus"
              className="h-7 hover:rounded-full hover:scale-125 cursor-pointer mr-1.5 transition-all duration-200"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity === 1}
            />
            <p className="font-bold">{quantity}</p>
            <img
              src={Plus}
              alt="Minus"
              className="h-7 hover:rounded-full hover:scale-125 cursor-pointer transition-all duration-200"
              onClick={() => {
                if (quantity >= availableStock) return;
                handleQuantityChange(quantity + 1);
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
                className="w-full bg-[#3041A0] p-2 text-white rounded-lg cursor-pointer hover:bg-[#25327D]"
                onClick={handleAddToCart}
              >
                Agregar al carrito
              </button>

              <button className="w-full bg-[#FFA41C] p-2 text-white rounded-lg cursor-pointer hover:bg-[#FF8F00]">
                Comprar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
