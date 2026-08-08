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

  return (
    <div className="flex h-fit items-center justify-center w-full">

      <div className="w-full px-2 flex items-center">
        <h1 className="font-bold text-gray-600 text-sm">
          {`Página ${currentPage} de ${totalPages ? totalPages : 0}`}
        </h1>
      </div>

      <div className="flex flex-row divide-x divide-gray-300">

        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1 || loading}
          className={`px-2 py-1 rounded-l-2xl font-semibold transition ${currentPage === 1 || loading
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-blue-900 text-white hover:bg-blue-950 cursor-pointer"
            }`}
        >
          <i className="pi pi-angle-left"></i>
        </button>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages || loading}
          className={`px-2 py-1 rounded-r-2xl font-semibold transition ${currentPage === totalPages || loading
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-blue-900 text-white hover:bg-blue-900 cursor-pointer"
            }`}
        >
          <i className="pi pi-angle-right"></i>
        </button>

      </div>
    </div>
  );
}
