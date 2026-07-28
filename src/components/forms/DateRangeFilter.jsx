import { useState } from "react";
import { useUsersNames } from "../../api/hooks/usersHooks";

export default function DateRangeFilter({
  onApply,
  fromLabel = "Desde",
  toLabel = "Hasta",
  applyText = "Aplicar filtro",
  clearText = "Limpiar filtro",
  userFilter = false
}) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [userId, setUserId] = useState("");
  const { data: userNames, isLoading: isLoadingUsersNames } = useUsersNames();

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6 border border-gray-100 flex flex-col gap-4">

      {/* Apartado para buscar por usuario */}
      <div className={`${userFilter ? "block" : "hidden"} flex flex-col gap-2`}>
        <label className="block text-lg font-semibold text-gray-900">
          Buscar por usuario
        </label>
        <select
          value={userId}
          onChange={(event) => {
            setUserId(event.target.value);
          }}
          className={`md:w-1/1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3041A0] focus:border-[#3041A0] cursor-pointer`}
          disabled={isLoadingUsersNames}
        >
          <option value="">Todos los usuarios</option>
          {userNames?.map((user) => (
            <option className="text-gray-800" key={user.id} value={user.id}>
              {user.fullName || user.username || "Usuario"}
            </option>
          ))}
        </select>
      </div>

      {/* Apartado para buscar por fecha */}
      <div className="flex flex-col gap-2">
        <label className="block text-lg font-semibold text-gray-900">
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
            onClick={() => onApply(fromDate, toDate, userId)}
            className="bg-[#3041A0] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#25348a] transition cursor-pointer"
          >
            {applyText}
          </button>
          <button
            onClick={() => {
              setFromDate('');
              setToDate('');
              setUserId('');
              onApply('', '')
            }}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition cursor-pointer"
          >
            {clearText}
          </button>
        </div>
      </div>
    </div>
  );
}
