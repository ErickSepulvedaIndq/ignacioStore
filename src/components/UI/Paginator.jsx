/**
 * con esto podemos tener navegación entre páginas de la tabla
 * propiedades
 *   - currentPage: numero de pagina donde esta
 *   - totalPages: total de paginas
 *   - onPageChange: una funcion para cuando cambiemos de paginas
 *   - loading: esto solo es para saber cuando cargar
 */

export default function Paginator({
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
}) {
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between mt-4 px-6">
      <div className="text-sm text-gray-600">
        Página <span className="font-semibold  text-base">{currentPage}</span> de{" "}
        <span className="font-semibold text-base">{totalPages}</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1 || loading}
          className={`px-4 py-2 rounded-lg font-semibold transition ${currentPage === 1 || loading
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-[#3041A0] text-white hover:bg-[#3d55d7] cursor-pointer"
            }`}
        >
          Anterior
        </button>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages || loading}
          className={`px-4 py-2 rounded-lg font-semibold transition ${currentPage === totalPages || loading
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-[#3041A0] text-white hover:bg-[#3d55d7] cursor-pointer"
            }`}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
