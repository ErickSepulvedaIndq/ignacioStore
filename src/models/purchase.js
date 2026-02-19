/**
 * Purchase Model
 * Estructura básica de datos para compra/transaccion
 * Los datos vienen del backend con mongoose-paginate-v2
 */

export const purchaseModel = {
  id: "string|required",
  userId: "string|required",
  date: "string|required",
  total: "number|required",
  status: "enum[pending,paid]|default:pending",
  createdAt: "string|timestamp",
  updatedAt: "string|timestamp",
};

/**
 * Ejemplo de respuesta de la API:
 * {
 *   docs: [
 *     { id: 1, userId: 1, date: "2026-02-15", total: 150.5, status: "paid" },
 *     ...
 *   ],
 *   totalDocs: 100,
 *   limit: 10,
 *   page: 1,
 *   totalPages: 10,
 *   hasNextPage: true,
 *   hasPrevPage: false,
 *   nextPage: 2,
 *   prevPage: null
 * }
 */

export const purchaseExample = {
  id: 1,
  userId: 1,
  date: "2026-02-15",
  total: 150.5,
  status: "paid",
  createdAt: "2026-02-15T11:20:00Z",
  updatedAt: "2026-02-15T11:20:00Z",
};


export const debtorMonthlyPurchasesDemo = [
  {
    id: 1,
    userName: "Juan Pérez",
    purchaseDate: "2026-02-11",
    purchaseAmount: 120.5,
    totalDebt: 290.75,
  },
  {
    id: 2,
    userName: "Juan Pérez",
    purchaseDate: "2026-02-17",
    purchaseAmount: 170.25,
    totalDebt: 290.75,
  },
  {
    id: 3,
    userName: "María González",
    purchaseDate: "2026-02-07",
    purchaseAmount: 95.0,
    totalDebt: 205.5,
  },
  {
    id: 4,
    userName: "María González",
    purchaseDate: "2026-02-21",
    purchaseAmount: 110.5,
    totalDebt: 205.5,
  },
  {
    id: 5,
    userName: "Carlos García",
    purchaseDate: "2026-02-09",
    purchaseAmount: 80.0,
    totalDebt: 315.0,
  },
  {
    id: 6,
    userName: "Carlos García",
    purchaseDate: "2026-02-15",
    purchaseAmount: 135.0,
    totalDebt: 315.0,
  },
  {
    id: 7,
    userName: "Carlos García",
    purchaseDate: "2026-02-23",
    purchaseAmount: 100.0,
    totalDebt: 315.0,
  },
];
