import { useState } from "react";

export default function DateRangeFilter({
  onApply,
  fromLabel = "desde",
  toLabel = "hasta",
  applyText = "Aplicar filtro",
  clearText = "Limpiar filtro",
}) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6 border border-gray-100">
      <label className="block text-lg font-semibold text-gray-900 mb-3">
        Buscar por fecha
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2 ml-1.5">
            {fromLabel}
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={(event) => setFromDate(event.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3041A0] focus:border-[#3041A0]"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2 ml-1.5">
            {toLabel}
          </label>
          <input
            type="date"
            value={toDate}
            onChange={(event) => setToDate(event.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3041A0] focus:border-[#3041A0]"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        <button
          onClick={() => onApply(fromDate, toDate)}
          className="bg-[#3041A0] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#25348a] transition cursor-pointer"
        >
          {applyText}
        </button>
        <button
          onClick={() => {
            setFromDate('');
            setToDate('');
            onApply('', '')
          }}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition cursor-pointer"
        >
          {clearText}
        </button>
      </div>
    </div>
  );
}
