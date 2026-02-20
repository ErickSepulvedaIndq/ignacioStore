import Swal from "sweetalert2";
import { createRoot } from "react-dom/client";

// Componente React para el contenido del dialog
const DialogContent = ({ img, productName, price, quantity, totalPrice }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-5 my-2">
      {/* Header con imagen y nombre */}
      <div className="flex items-center mb-5 pb-4 border-b-2 border-gray-200">
        <img
          src={img}
          alt={productName}
          className="w-20 h-20 object-contain mr-4 rounded-lg bg-white p-1"
        />
        <div className="text-left flex-1">
          <h3 className="m-0 text-lg text-gray-800 font-semibold">
            {productName}
          </h3>
          <p className="mt-1 mb-0 text-gray-500 text-sm">
            Precio: ${price}
          </p>
        </div>
      </div>

      {/* Detalles de la compra */}
      <div className="text-left text-gray-700">
        <div className="flex justify-between py-2 border-b border-gray-300">
          <span className="font-medium">Cantidad:</span>
          <span className="font-semibold text-[#3041A0]">{quantity}</span>
        </div>
        <div className="flex justify-between py-3 mt-2">
          <span className="font-semibold text-lg">Total a pagar:</span>
          <span className="font-bold text-2xl text-[#3041A0]">
            ${totalPrice}
          </span>
        </div>
      </div>
    </div>
  );
};

// Función helper para mostrar el dialog
export const showBuyConfirmDialog = async ({
  img,
  productName,
  price,
  quantity,
}) => {
  const totalPrice = (parseFloat(price) * quantity).toFixed(2);

  // Crear un contenedor temporal para renderizar el componente React
  const container = document.createElement("div");
  const root = createRoot(container);
  root.render(
    <DialogContent
      img={img}
      productName={productName}
      price={price}
      quantity={quantity}
      totalPrice={totalPrice}
    />
  );

  // Esperar a que React renderice
  await new Promise((resolve) => setTimeout(resolve, 0));

  const result = await Swal.fire({
    title: "Realizar la compra",
    html: container,
    icon: "question",
    iconColor: "#3041A0",
    showCancelButton: true,
    confirmButtonText: "Confirmar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#3041A0",
    cancelButtonColor: "#6B7280",
    reverseButtons: true,
    width: "480px",
    customClass: {
      popup: "rounded-lg",
      title: "text-xl font-semibold",
    },
  });

  // Limpiar
  root.unmount();

  return result;
};