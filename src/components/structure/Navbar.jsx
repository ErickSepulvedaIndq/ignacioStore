import { useState } from "react";
import { useLocation } from "react-router-dom";
import ShoppingCartModal from "../modals/ShoppingCartModal";
import { useEffect } from "react";
import CartFlow from "cartflow";
import popSound from "../../assets/sounds/pop.mp3";


export default function Navbar() {
  const [isOpenCart, setIsOpenCart] = useState(false);
  const [productsNumber, setProductsNumber] = useState(null);
  const location = useLocation();

  const handleCartProductsNumber = (number) => {
    setProductsNumber(number);
  }

  useEffect(() => {
    setTimeout(() => {
      new CartFlow({
        cartSelector: "#cart-icon",
        buttonSelector: ".add-to-cart-btn",
        itemSelector: ".product-item",
        imageSelector: "img",
        animationDuration: 700,
        easing: "cubic-bezier(0.55, 0, 1, 0.45)",
        shakeEffect: true,
        soundEffect: popSound,
      });
    }, 1000)
  }, []);

  const getTitulo = () => {
    const titles = {
      '/products': { label: 'Comprar productos', icon: 'pi pi-shopping-bag' },
      '/purchases': { label: 'Mis compras', icon: 'pi pi-credit-card' },
      '/changePassword': { label: 'Cambiar contraseña', icon: 'pi pi-key' },
      '/admin/users': { label: 'Administrar usuarios', icon: 'pi pi-users' },
      '/admin/products': { label: 'Administrar productos', icon: 'pi pi-box' },
      '/admin/purchaseHistory': { label: 'Historial de pagos', icon: 'pi pi-book' },
      '/admin/debtors': { label: 'Pendientes de pago', icon: 'pi pi-exclamation-triangle' },
      '/admin/reports': { label: 'Generar reportes', icon: 'pi pi-file-export' }
    };
    return titles[location.pathname] || 'Página';
  };

  return (
    <div className="bg-blue-900 text-white h-20 md:h-25 flex flex-row justify-between items-center gap-2 px-10">

      {/* Titulo de la pagina actual */}
      <div className="flex flex-row gap-3 items-center">
        <i className={`${getTitulo().icon} text-3xl text-shadow-lg`}></i>
        <h1 className={`text-2xl md:text-3xl font-bold text-shadow-lg`} >{getTitulo().label}</h1>
      </div>

      {/* Botón carrito de compras */}
      <button
        id="cart-icon"
        className={` pi pi-shopping-cart relative text-xl rounded-full bg-amber-50 shadow-custom-xl 
          p-2 text-blue-500 hover:scale-110 cursor-pointer transition ease-in-out  active:scale-100`}
        title="Ver carrito de compras."
        onClick={() => setIsOpenCart(true)}
      >
        <i className={`${productsNumber === 0 ? "hidden!" : ''} absolute -top-1 h-6 w-6 -right-3 p-2 text-xs flex items-center justify-center rounded-full bg-red-500 text-white font-bold`}>{productsNumber}</i>
      </button>

      <ShoppingCartModal onClose={() => setIsOpenCart(false)} isCartOpen={isOpenCart} productsNumber={handleCartProductsNumber} />

    </div >
  );
}
