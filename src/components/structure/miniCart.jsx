import { useCart } from "../../context/CartContext";

export default function MiniCart() {
  const {
    cartItems,
    isCartOpen,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    closeCart,
  } = useCart();

  return (
    <>
      {/* Con esto podremos cerrar el mini carrito al hacer click fuera de él */}
      <div
        className={`fixed inset-0 bg-black/50 z-40  transition-all duration-300 ${
          isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
      />

      {/* el carrito que sale de al derecha */}
      {/* Si le quitas el h-full se hara como un desplegable de tamaño ajustable */}
      <div
        className={`fixed top-0 right-0 h-full w-90 bg-white shadow-2xl z-50 transform transition-transform duration-400 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header del carrito */}
          <div className="bg-[#3041A0] text-white p-4 flex justify-between items-center">
            <h2 className="font-bold text-xl">Carrito de Compras</h2>
            <button
              onClick={closeCart}
              className="text-2xl hover:text-red-400 transition"
            >
              ×
            </button>
          </div>

          {/* Contenido del carrito */}
          <div className="flex-1 overflow-x-auto p-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <p className="text-lg">Tu carrito está vacío</p>
                <p className="text-sm mt-2">¡Agrega productos para comenzar!</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {cartItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-4 p-3 border rounded-lg hover:shadow-lg transition"
                  >
                    {/* El tamaño no deberia ser asi, no puede ser tan estatico */}
                    <img
                      src={item.imageUrl || item.img}
                      alt={item.name}
                      className="w-14 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-800">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {/* decimales a mostrar */}
                        ${item.price.toFixed(1)} c/u
                      </p>
                      {/* texto que nos ayuda a borrar la info */}
                      <div className="flex items-center gap-1 mt-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 text-sm"
                        >
                          -
                        </button>
                        <span className="text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-500 text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="font-bold text-sm text-gray-800">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      {/* texto que nos ayuda a borrar la info */}

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        Eliminar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="border-t p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-lg text-gray-800">Total:</span>
                <span className="font-bold text-xl text-[#3041A0]">
                  ${getCartTotal().toFixed(2)}
                </span>
              </div>
              <button className="w-full bg-[#3041A0] text-white py-3 rounded-lg hover:bg-[#25327D] transition font-bold">
                Proceder al Pago
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
