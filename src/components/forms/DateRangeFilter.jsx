// props rapidas por si luego se me olvida
// fromDate toDate valores actuales
// onFromDateChange onToDateChange setters
// onApply onClear acciones
export default function DateRangeFilter({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  onApply,
  onClear,
  fromLabel = "desde",
  toLabel = "hasta",
  applyText = "Aplicar filtro",
  clearText = "Limpiar filtro",
}) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {fromLabel}
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={(event) => onFromDateChange(event.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3041A0] focus:border-[#3041A0]"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {toLabel}
          </label>
          <input
            type="date"
            value={toDate}
            onChange={(event) => onToDateChange(event.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3041A0] focus:border-[#3041A0]"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        <button
          onClick={onApply}
          className="bg-[#3041A0] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#25348a] transition cursor-pointer"
        >
          {applyText}
        </button>
        <button
          onClick={onClear}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition cursor-pointer"
        >
          {clearText}
        </button>
      </div>
    </div>
  );
}
