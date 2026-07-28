import { useAuth } from "../../context/AuthContext";
import { useSearch } from "../../context/SearchContext";
import { useLocation } from "react-router-dom";
import ShoppingCartModal from "../modals/ShoppingCartModal";
import { useState } from "react";

export default function Header() {
  const { searchTerm, setSearchTerm } = useSearch();
  const { toggleSideNav } = useAuth();
  const { pathname } = useLocation();
  const hideSearchInPaths = ["/purchases", "/admin/debtors", "/admin/purchaseHistory", "/changePassword"];
  const hideSearchInPages = hideSearchInPaths.includes(pathname);

  const [openCart, setOpenCart] = useState(false);
  const [productsNumber, setProductsNumber] = useState(null);

  const handleCartProductsNumber = (number) => {
    setProductsNumber(number);
  }

  return (
    <>
      <header className="fixed left-0 right-0 z-10 bg-[#3041A0] text-white md:p-6 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center">
          <button
            onClick={toggleSideNav}
            className="text-white bg-[#2b3b92] hover:bg-[#25327D] p-2 rounded-lg transition mr-4"
          >
            <svg
              className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform"
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
          <h1 className="font-bold text-xl md:text-2xl italic ml-2">INDQNACIO STORE</h1>
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
            <i className="pi pi-search text-xl hover:scale-110 transition-transform cursor-pointer" />
          </div>
        )}
        <div title="Carrito de compras" className="relative w-fit hover:scale-105 transition ease-in-out">
          {productsNumber > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 w-fit h-fit text-white text-xs p-0.75 z-50 rounded-full">
              {productsNumber}
            </span>
          )}
          <i onClick={() => setOpenCart(true)} className="pi pi-shopping-cart cursor-pointer text-3xl "></i>
        </div>
      </header>

      <ShoppingCartModal onClose={() => setOpenCart(false)} isCartOpen={openCart} productsNumber={handleCartProductsNumber} />
    </>
  );
}
