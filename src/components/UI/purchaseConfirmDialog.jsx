import { useState } from "react";

export default function PurchaseConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  total 
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsProcessing(true);
    await onConfirm();
    setIsProcessing(false);
  };

  return (
    <>
      {/* overlay oscuro de fondo */}
      <div
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        {/* dialogo centrado */}
        <div
          className="bg-white rounded-lg shadow-2xl p-6 w-96 max-w-full mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* icono de pregunta */}
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 rounded-full p-3">
              <svg
                className="w-12 h-12 text-[#3041A0]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* titulo */}
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            ¿Confirmar compra?
          </h2>

          {/* descripcion */}
          <p className="text-center text-gray-600 mb-6">
            Estás por realizar una compra de{" "}
            <span className="font-bold text-[#3041A0]">
              ${total.toFixed(2)}
            </span>
          </p>

          {/* botones de accion */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              className="flex-1 bg-[#3041A0] text-white py-2 px-4 rounded-lg hover:bg-[#25327D] transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Procesando...
                </>
              ) : (
                "Confirmar"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
