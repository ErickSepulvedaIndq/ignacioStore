import { useCart } from "../../context/CartContext";
import Carrito from "../../assets/carrito.png";
import MiniCart from "../structure/miniCart";
import LogOut from "../../assets/logOut.png";
import Lupa from "../../assets/lupa.png";

export default function Header() {
  const { getCartCount, toggleCart } = useCart();
  const cartCount = getCartCount();

  return (
    <>
      <header className="bg-[#3041A0] text-white p-6 flex justify-between items-center">
        <h1 className="font-bold text-2xl italic">IGNACIO STORE</h1>
        <div className="flex items-center justify-center gap-2 bg-white text-black p-2 rounded-lg w-1/4">
          <input
            type="text"
            className="bg-white text-black p-2 rounded-lg w-full outline-none"
            placeholder="Buscar producto..."
          />
          <img
            src={Lupa}
            alt="Lupa"
            className="h-9 hover:scale-110 transition-transform cursor-pointer"
          />
        </div>
        <div className="relative w-fit">
          <img
            src={Carrito}
            alt="Carrito"
            className="h-10 hover:scale-110 transition-transform cursor-pointer"
            onClick={toggleCart}
          />

          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-3.5 py-0.5 rounded-full">
              {cartCount}
            </span>
          )}
        </div>
      </header>

      {/* Renderizar el MiniCart aquí para que esté disponible globalmente */}
      <MiniCart />
    </>
  );
}
