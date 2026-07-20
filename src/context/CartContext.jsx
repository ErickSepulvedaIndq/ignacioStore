import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { showToast } from "../components/UI/toast";
import { addToCart as addToCartApi, getCartProducts, removeFromCart as removeFromCartApi } from "../services/productService";

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

  // Sirve para recargar los productos desde un componente al contexto actual asignándole una function (se le conoce como inversion de control)
  // desde el componente card se le esta pasando la función reload (la cual recarga la lista), esta función es asignada a reloadProducts permitiendo
  // usarla desde cualquier parte del código.
  const [reloadProducts, setReloadProducts] = useState(null);

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

  const addToCart = async (product, quantity = 1, stock) => {
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
      if (Number.isFinite(effectiveStock) && newQty > effectiveStock) {
        showStockError();
        return false;
      }
    } else {
      if (Number.isFinite(effectiveStock) && safeQuantity > effectiveStock) {
        showStockError();
        return false;
      }
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.userId) {
        // Llamada al backend
        await addToCartApi(product.id, safeQuantity, user.userId);

        // Sincronizar estado local (opcionalmente podrías llamar a getCartItems aquí 
        // para estar 100% seguro de la sincronización con el backend)
        if (existingItem) {
          setCartItems((prev) =>
            prev.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + safeQuantity } : item,
            ),
          );
        } else {
          setCartItems((prev) => [
            ...prev,
            { ...product, quantity: safeQuantity, stock: effectiveStock },
          ]);
        }
        return true;
      } else {
        console.error("No user ID found for addToCart");
        return false;
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      showToast({
        icon: "error",
        title: "Error al agregar al carrito",
        position: "top",
        timer: 1800,
      });
      return false;
    }
  };

  const getCartItems = useCallback(async (userId) => {
    try {
      const response = await getCartProducts(userId);
      if (response && Array.isArray(response.data)) {
        const formattedItems = response.data.map(item => {
          const p = item.product_id;
          return {
            id: p._id,
            name: p.name,
            price: p.price,
            quantity: item.quantity,
            stock: p.stock,
            img: p.image?.url
          };
        });
        setCartItems(formattedItems);
        // console.log("Cart items loaded:", formattedItems);
      }
      return response;
    } catch (error) {
      console.error("Error fetching cart items:", error);
      return [];
    }
  }, []);

  const removeFromCart = async (productId) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;
      const user = { userId };

      if (!user?.userId) {
        console.error("No userId found for removeFromCart");
        return;
      }

      const itemToRemove = cartItems.find(item => item.id === productId);
      if (!itemToRemove) return;

      // console.log("Removing from cart:", user.userId, productId, itemToRemove.quantity);
      await removeFromCartApi(user.userId, productId, itemToRemove.quantity);

      setCartItems((prev) => prev.filter((item) => item.id !== productId));

      showToast({
        icon: "success",
        title: "Producto eliminado del carrito",
        position: "top",
        timer: 1500,
      });
    } catch (error) {
      console.error("Error removing from cart:", error);
      showToast({
        icon: "error",
        title: "Error al eliminar producto",
        position: "top",
        timer: 1800,
      });
    }
  };

  const updateQuantity = async (productId, quantity) => {
    const itemInCart = cartItems.find((item) => item.id === productId);
    if (!itemInCart) return;

    if (quantity > itemInCart.stock) {
      showStockError();
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user?.userId) return;

      if (quantity <= 0) {
        await removeFromCart(productId);
        return;
      }

      const diff = quantity - itemInCart.quantity;

      if (diff > 0) {
        await addToCartApi(productId, diff, user.userId);
        setCartItems((prev) =>
          prev.map((item) => {
            if (item.id !== productId) return item;
            return { ...item, quantity };
          })
        );
      } else if (diff < 0) {
        await removeFromCartApi(user.userId, productId, Math.abs(diff));

        await getCartItems(user.userId);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
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
    getCartItems,
    reloadProducts,
    setReloadProducts
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
