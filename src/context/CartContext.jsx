import { createContext, useContext, useState, useEffect } from "react";
import { showToast } from "../components/UI/toast";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de el poveedor de el carrito");
  }
  return context;
};
//el provider es el que va a envolver toda la aplicacion para que el carrito este disponible en toda la aplicacion
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Cargar desde localStorage al iniciar
    const savedCart = localStorage.getItem("cart_INDQ");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Guardar en localStorage cada vez que cambie el carrito
  useEffect(() => {
    localStorage.setItem("cart_INDQ", JSON.stringify(cartItems));
  }, [cartItems]);

  // este toast se usa cuando intentas pasar el limite de stock
  const showStockError = () => {
    showToast({
      icon: "error",
      title: "no se pudo agregar porque ya no hay stock",
      position: "top",
      timer: 1800,
    });
  };

  const addToCart = (product, quantity = 1, stock) => {
    const parsedQuantity = Number(quantity);
    const safeQuantity =
      Number.isFinite(parsedQuantity) && parsedQuantity > 0 ? parsedQuantity : 1;

    const existingItem = cartItems.find((item) => item.id === product.id);
    const effectiveStock =
      typeof stock === "number"
        ? stock
        : typeof existingItem?.stock === "number"
          ? existingItem.stock
          : typeof product?.stock === "number"
            ? product.stock
            : Number(stock);

    if (existingItem) {
      const newQty = existingItem.quantity + safeQuantity;

      // aqui revisamos si sumar mas rompe el limite de stock
      if (Number.isFinite(effectiveStock) && newQty > effectiveStock) {
        showStockError();
        return false;
      }

      setCartItems((prev) =>
        prev.map((item) =>
          item.id === product.id ? { ...item, quantity: newQty } : item,
        ),
      );

      return true;
    }

    // aqui revisamos cuando el producto es nuevo en carrito
    if (Number.isFinite(effectiveStock) && safeQuantity > effectiveStock) {
      showStockError();
      return false;
    }

    setCartItems((prev) => [
      ...prev,
      { ...product, quantity: safeQuantity, stock: effectiveStock },
    ]);

    return true;
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };
// maneja cuando en el carrito cambiamos la cantidad de productos
  const updateQuantity = (productId, quantity) => {
    const itemInCart = cartItems.find((item) => item.id === productId);
    if (!itemInCart) return;

    // aqui valida cuando subes cantidad desde el mini carrito
    if (quantity > itemInCart.stock) {
      showStockError();
      return;
    }

    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id !== productId) return item;

          if (quantity <= 0) return null;

          return { ...item, quantity };
        })
        .filter(Boolean),
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    // esta funcion calcula el total del carrito sumando el precio por la cantidad de cada producto, se usa en el mini carrito y en el proceso de compra
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };
  // lo tenia mal el handleBuyNow en card.jsx porque ahi tenemos todo en buy product
  // el backend al parecer registra automáticamente la deuda en buyLogs.createLog

  const value = {
    cartItems,
    isCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    toggleCart,
    closeCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
