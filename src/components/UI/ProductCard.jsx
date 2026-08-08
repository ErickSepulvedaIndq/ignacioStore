import { useState } from "react";
import { showBuyConfirmDialog } from "./buyConfirmDialog";
import { useAddProductsToCart, useBuyProduct } from "../../api/hooks/productsHooks";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useRef } from "react";
import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function ProductCard({ product }) {
  const isOutOfStock = product?.stock === 0;
  const [quantity, setQuantity] = useState(1);
  const [isFocus, setIsFocus] = useState(false);
  const { mutateAsync: buyProduct } = useBuyProduct();
  const { mutateAsync: addToCart } = useAddProductsToCart();
  const { user } = useAuth();
  const cardRef = useRef(null);
  const flyBtnRef = useRef(null);


  useEffect(() => {
    function handleClickOutside(event) {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setIsFocus(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddToCart = async () => {
    try {
      await toast.promise(
        addToCart({ productId: product?._id, quantity: quantity, userId: user.userId }),
        {
          loading: 'Agregando...',
          success: 'Productos agregados!',
          error: (err) => {
            console.error(err);
            if (err?.response?.data?.message === "Supera el stock") {
              return (
                <div className="flex flex-col">
                  <p className="font-semibold">Supera la cantidad máxima de stock.</p>
                  <p>Verifique su carrito de compras.</p>
                </div>
              )
            }
            return 'Error al agregar productos al carrito, intente más tarde.'
          }
        }
      )

      flyBtnRef.current?.click();
      setQuantity(1);
    } catch {
      return;
    }
  };

  const handleBuyNow = async () => {
    const confirm = await showBuyConfirmDialog({
      img: product?.image?.url,
      productName: product?.name,
      price: product?.price,
      quantity: quantity,
    });

    if (!confirm.isConfirmed) return;

    toast.promise(
      buyProduct({ productId: product?._id, quantity }),
      {
        loading: 'Comprando...',
        success: () => {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            zIndex: 9999,
          });
          return 'Compra realizada exitosamente!'
        },
        error: (err) => {
          console.error(err);
          return 'Error al realizar la compra, intente mas tarde.';
        }
      }
    )
  };

  return (
    <>
      <div
        ref={cardRef}
        onClick={() => setIsFocus(!isFocus)}
        className={`product-item relative group bg-white z-10 ${isFocus ? isOutOfStock ? "scale-100" : "z-55 scale-105 md:scale-100 rounded-b" : "z-10"} hover:z-50 shadow-custom-xs rounded-lg rounded-b hover:rounded-b w-full max-h-90  hover:scale-105 transition-all hover:duration-100 duration-300 ${!isOutOfStock ? "hover:rounded-b-none" : ''} `}
      >
        <button
          ref={flyBtnRef}
          type="button"
          aria-hidden="true"
          tabIndex={-1}
          className="add-to-cart-btn absolute top-0 left-0 w-0 h-0 opacity-0 pointer-events-none"
        />

        {/* Datos principales */}
        <div className="p-2 px-4 ">
          <div className="flex items-center justify-center py-3 px-1">
            <img
              src={product?.image?.url}
              alt={product?.name}
              className="img h-40 w-50 object-contain"
            />
          </div>

          <button className={`absolute pi pi-thumbtack top-2 left-2 md:hidden! -rotate-45 ${isFocus ? "text-blue-500" : "text-gray-300"} ${isOutOfStock ? "hidden!" : "block"}`}></button>

          <div className="absolute top-0 overflow-hidden right-0 w-full h-30">
            <div className={`absolute top-7 shadow-custom-xl p-1 -right-8 bg-purple-700 rotate-45 flex justify-center w-35 ${isOutOfStock ? "block" : "hidden"}`}>
              <p className={`text-white text-center text-xs font-bold `}>
                Agotado
              </p>
            </div>

            <div className={`absolute top-7 p-1 shadow-custom-xl -right-8 bg-red-500 rotate-45 flex justify-center w-35 ${product?.stock === 1 ? "block" : "hidden"}`}>
              <p className={`text-white text-center text-xs font-bold `}>
                ¡Última unidad!
              </p>
            </div>

            <div className={`absolute top-7 p-1 shadow-custom-xl -right-8 bg-orange-500 rotate-45 flex justify-center w-35 ${product?.stock > 1 && product?.stock <= 5 ? "block" : "hidden"}`}>
              <p className={`text-white text-center text-xs font-bold`}>
                {`¡Solo quedan ${product?.stock}!`}
              </p>
            </div>
          </div>

          <h2 className="font-bold pb-2">{product?.name}</h2>
          <p className="font-bold pb-2">Precio: <strong className="text-green-600">${product?.price}</strong></p>


          <p
            title={product?.description === ' ' ? "Sin descripción" : product?.description}
            className={`text-sm font-medium cursor-pointer text-gray-600 mb-2 
              wrap-break-word line-clamp-2 overflow-hidden transition-all h-10`}
          >
            {product?.description === ' ' ? "Sin descripción" : product?.description}
          </p>


          {/* Mensaje de unidades */}
          <p className={`font-semibold text-gray-600 `}>
            {`${product?.stock} ${product?.stock === 1 ? "disponible." : "disponibles."}`}
          </p>
        </div>
        <div
          className={`h-0 absolute flex justify-center items-center shadow rounded-b-lg bg-white w-full overflow-hidden
                ${isFocus ? "h-20 md:h-0" : "h-0"} group-hover:h-20
                transition-all duration-150 ${isOutOfStock ? "hidden" : ""}`}
        >
          <div className="flex m-2 flex-row gap-2 justify-between items-center">
            <div className="flex flex-col justify-center items-center h-full gap-2">
              <p className="text-gray-500 font-semibold text-[0.9rem]">Cantidad</p>
              <div className="flex flex-row justify-between items-center">
                <button
                  className="cursor-pointer text-lg font-bold h-7 w-7 disabled:text-gray-500 bg-gray-200 hover:bg-gray-300 transition ease-in-out rounded flex justify-center items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuantity(quantity === 1 ? quantity : quantity - 1);
                  }}
                  disabled={isOutOfStock}
                >-</button>
                <p className="w-6 text-center font-bold">
                  {quantity ? (isOutOfStock ? 0 : quantity) : 1}
                </p>
                <button
                  className="cursor-pointer text-lg font-bold h-7 w-7 disabled:text-gray-500 bg-gray-200 hover:bg-gray-300 transition ease-in-out rounded flex justify-center items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuantity(quantity === product?.stock ? quantity : quantity + 1);
                  }}
                  disabled={isOutOfStock}
                >+</button>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <button
                className="w-full h-7 text-xs flex flex-row items-center justify-center gap-2 2xl:gap-1 bg-blue-800 py-1 px-4 2xl:px-1  text-white rounded-lg cursor-pointer hover:bg-blue-900 disabled:cursor-not-allowed"
                onClick={handleAddToCart}
              >
                <i className="pi pi-shopping-cart text-base" />
                <span className="font-medium hidden xl:block ">Agregar al carrito</span>
              </button>

              <button
                className="w-full h-7 text-xs flex flex-row items-center justify-center gap-2 bg-yellow-500 py-1 px-4 text-white rounded-lg cursor-pointer hover:bg-yellow-600 disabled:cursor-not-allowed"
                onClick={handleBuyNow}
              >
                <i className="text-base" >$</i>
                <span className="font-bold hidden xl:block ">Comprar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}