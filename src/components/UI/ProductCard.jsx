import Plus from "../../assets/plus.png";
import Minus from "../../assets/minus.png";
import { useState } from "react";
import { showBuyConfirmDialog } from "./buyConfirmDialog";
import { useAddProductsToCart, useBuyProducts } from "../../api/hooks/productsHooks";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function ProductCard({ product }) {
  const isOutOfStock = product?.stock === 0;
  const [quantity, setQuantity] = useState(1);
  const { mutateAsync: buyProduct } = useBuyProducts();
  const { mutateAsync: addToCart } = useAddProductsToCart();
  const { user } = useAuth();

  const handleAddToCart = async () => {
    toast.promise(
      addToCart({ productId: product?._id, quantity: quantity, userId: user.userId }),
      {
        loading: 'Agregando...',
        success: 'Productos agregados!',
        error: (err) => {
          console.error(err);
          return 'Error al agregar productos al carrito, intente más tarde.'
        }
      }
    )
    setQuantity(1);
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
      buyProduct({ products: [{ id: product?._id, quantity: quantity }] }),
      {
        loading: 'Comprando...',
        success: 'Compra realizada exitosamente!',
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
        className={`group relative bg-white z-10 hover:z-50 shadow rounded-lg hover:rounded-t-lg w-69 hover:scale-105 transition-all hover:duration-100 duration-300 ${!isOutOfStock ? "hover:rounded-b-none" : ''} `}
      >
        {/* Datos principales */}
        <div className="p-2 px-4">
          <div className="flex items-center justify-center py-3 px-1">
            <img
              src={product?.image?.url}
              alt={product?.name}
              className="h-40 w-50 object-contain"
            />
          </div>
          {isOutOfStock && (
            <p className="text-red-500 text-center font-bold">
              Agotado
            </p>
          )}
          <h2 className="font-bold pb-2">{product?.name}</h2>
          <p className="font-bold pb-2">Precio: <strong className="text-green-600">${product?.price}</strong></p>
          <p className="text-sm leading-5 font-medium text-gray-600 pb-2 overflow-hidden [-webkit-line-clamp:3] [-webkit-box-orient:vertical]">
            {product?.description || "Sin descripción"}
          </p>
        </div>
        <div
          className={`h-0 absolute flex justify-center items-center shadow rounded-b-lg bg-white w-full overflow-hidden
                group-hover:h-20
                transition-all duration-150 ${isOutOfStock ? "hidden" : ""}`}
        >
          <div className="flex m-2 flex-row gap-2 justify-between items-center">
            <div className="flex flex-col justify-center items-center h-full gap-2">
              <p className="text-gray-500 font-semibold text-[0.9rem]">Cantidad</p>
              <div className="flex flex-row justify-between items-center">
                <button
                  className="cursor-pointer text-lg font-bold h-7 w-7 disabled:text-gray-500 bg-gray-200 hover:bg-gray-300 transition ease-in-out rounded flex justify-center items-center"
                  onClick={() => {
                    setQuantity(quantity === 1 ? quantity : quantity - 1)
                  }}
                  disabled={isOutOfStock}
                >-</button>
                <p
                  className="w-6 text-center font-bold"
                >{quantity ? (isOutOfStock ? 0 : quantity) : 1}</p>
                <button
                  className="cursor-pointer text-lg font-bold h-7 w-7 disabled:text-gray-500 bg-gray-200 hover:bg-gray-300 transition ease-in-out rounded flex justify-center items-center"
                  onClick={() => {
                    setQuantity(quantity === product?.stock ? quantity : quantity + 1)
                  }}
                  disabled={isOutOfStock}
                >+</button>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <button
                className="w-full h-7 text-xs flex flex-row items-center justify-center gap-2 bg-[#3041A0] py-1 px-4 text-white rounded-lg cursor-pointer hover:bg-[#25327D] disabled:cursor-not-allowed"
                onClick={handleAddToCart}
              >
                <i className="pi pi-shopping-cart text-base" />
                <span className="font-medium">Agregar al carrito</span>
              </button>

              <button
                className="w-full h-7 text-xs flex flex-row items-center justify-center gap-2 bg-yellow-500 py-1 px-4 text-white rounded-lg cursor-pointer hover:bg-yellow-600 disabled:cursor-not-allowed"
                onClick={handleBuyNow}
              >
                <i className="text-base" >$</i>
                <span className="font-bold">Comprar</span>
              </button>
            </div>

          </div>
        </div>
      </div>

    </>
  );
}
