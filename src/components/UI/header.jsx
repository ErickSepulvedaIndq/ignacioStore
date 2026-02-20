import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useSearch } from "../../context/SearchContext";
import { useLocation } from "react-router-dom";
import Carrito from "../../assets/carrito.png";
import MiniCart from "../structure/miniCart";
import Lupa from "../../assets/lupa.png";

export default function Header() {
  //con el search context podemos acceder al valor del input de busqueda desde cualquier componente
  const { searchTerm, setSearchTerm } = useSearch();
  // con el cart context podemos acceder a la cantidad de productos en el carrito y a la funcion para abrir el carrito
  const { getCartCount, toggleCart } = useCart();
  const { toggleSideNav } = useAuth();
  const { pathname } = useLocation();
  const cartCount = getCartCount();
  // variables para la visibilidad de elementos en el header
  const hideSearchInPaths = ["/purchases", "/admin/debtors"];
  const hideSearchInPages = hideSearchInPaths.includes(pathname);
  const showCartInPages = pathname === "/products";

  return (
    <>
      <header className="bg-[#3041A0] text-white p-4 md:p-6 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center">
          <button
            onClick={toggleSideNav}
            className="text-white bg-[#2b3b92] hover:bg-[#25327D] p-2 rounded-lg transition mr-4"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="font-bold text-xl md:text-2xl italic ml-2">
            IGNACIO STORE
          </h1>
        </div>

        {!hideSearchInPages && (
          <div className="flex items-center justify-center  bg-white text-black p-1 md:p-2 rounded-lg w-80 md:w-1/2 order-1 md:order-0 mx-auto ">
            <input
              type="text"
              className="bg-white text-black p-1 md:p-2 rounded-lg w-full outline-none text-sm"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <img
              src={Lupa}
              alt="Lupa"
              className="h-7 md:h-9 hover:scale-110 transition-transform cursor-pointer"
            />
          </div>
        )}
        {/* este es el carriot cuidado por que se apachurra si mueves mucho el valor del input*/}
        {showCartInPages && (
          <div className="relative w-fit">
            <img
              src={Carrito}
              alt="Carrito"
              className="h-8 md:h-10 hover:scale-110 transition-transform cursor-pointer"
              onClick={toggleCart}
            />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2.5 md:px-3.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </div>
        )}
      </header>

      {/* Renderizar el MiniCart aquí para que esté disponible globalmente */}
      <MiniCart />
    </>
  );
}
