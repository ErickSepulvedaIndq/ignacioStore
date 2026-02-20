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

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);

      if (existingItem) {
        //si el producto ya existe en el carrito, en vez de agregarlo como un nuevo item, simplemente aumentamos la cantidad de ese producto en el carrito al parecer
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      // Si no existe agregamos con cantidad 1
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      ),
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
          quantity: item.quantity
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
