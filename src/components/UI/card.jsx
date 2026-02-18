import Plus from "../../assets/plus.png";
import Minus from "../../assets/minus.png";
import { useState } from "react";
import { useCart } from "../../context/CartContext";

export default function Card({ productName, price, img, productId }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleQuantityChange = (value) => {
    if (value < 1) {
      return;
    }
    setQuantity(value);
  };

  const handleAddToCart = () => {
    // por default estamos manejando el caso de que el producto no tenga un id, pero esto no debe pasar por eso mismo debemos evitar este posible caso
    const product = {
      id: productId || `product-${Date.now()}-${Math.random()}`,
      name: productName,
      price: parseFloat(price),
      img: img,
      imageUrl: img,
    };

    // añadir la cantidad de productos al carrito
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

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
              className="h-7 hover:rounded-full hover:scale-110 hover:bg-[#D8D7D5] cursor-pointer mr-1.5"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity === 1}
            />
            <p className="font-bold">{quantity}</p>
            <img
              src={Plus}
              alt="Minus"
              className="h-7 hover:rounded-full hover:scale-110 hover:bg-[#D8D7D5] cursor-pointer"
              onClick={() => handleQuantityChange(quantity + 1)}
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

              <button className="w-full bg-[#FFCA1A] p-2 text-white rounded-lg cursor-pointer hover:bg-[#E5B816]">
                Comprar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
