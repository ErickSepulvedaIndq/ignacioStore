import { createContext, useContext, useState, useEffect } from "react";
import { createBuyLog } from "../api/buyLogsService";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de el poveedor de el carrito");
  }
  return context;
};
//el provider es el que va a envolver toda la aplicacion para que el carrito este disponible en toda la aplicacion
//falta analizarlo por completo todavia 
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

  const addToCart = (product, quantity = 1, stock) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      const effectiveStock =
        typeof stock === "number"
          ? stock
          : typeof existingItem?.stock === "number"
            ? existingItem.stock
            : typeof product?.stock === "number"
              ? product.stock
              : Number(stock);

      if (existingItem) {
        const newQty = existingItem.quantity + quantity;

        if (Number.isFinite(effectiveStock) && newQty > effectiveStock) {
          alert("No hay suficiente stock disponible");
          return prev;
        }

        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: newQty }
            : item
        );
      }

      if (Number.isFinite(effectiveStock) && quantity > effectiveStock) {
        alert("No hay suficiente stock disponible");
        return prev;
      }

      return [...prev, { ...product, quantity, stock: effectiveStock }];
    });
  };


  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.id !== productId) return item;

        if (quantity <= 0) return null;

        if (quantity > item.stock) {
          alert("No hay suficiente stock disponible");
          return item;
        }

        return { ...item, quantity };
      }).filter(Boolean)
    );
  };


  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
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

  // procesar la compra y registrarla en la BD
  const handleCheckout = async () => {
    try {
      const userId = localStorage.getItem("userId");
      
      if (!userId) {
        throw new Error("usuario no autenticado");
      }

      if (cartItems.length === 0) {
        throw new Error("carrito vacio");
      }

      // Necesito verificar por que aqui hay un problema, los productos deben acomplarse en un array y parece que los esta subiendo uno por uno
      const purchaseData = {
        id_user: userId,
        totalCost: getCartTotal(),
        isPaid: false,
        products: cartItems.map(item => ({
          id: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          stock: item.stock
        }))
      };

      const response = await createBuyLog(purchaseData);
      
      // si todo salio bien limpiamos el carrito
      if (response.success) {
        clearCart();
        return { success: true, message: "compra realizada exitosamente" };
      }
      
      throw new Error("error al procesar la compra");
      
    } catch (error) {
      console.error("error en checkout:", error);
      return { 
        success: false, 
        message: error.message || "error al procesar la compra" 
      };
    }
  };

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
    handleCheckout,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
