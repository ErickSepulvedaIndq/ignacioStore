/**
 * User Model
 * Estructura básica de datos para usuario
 * Los datos vienen del backend con mongoose-paginate-v2
 */

export const userModel = {
  id: "string|required",
  firstName: "string|required",
  lastName: "string|required",
  role: "enum[admin,user]|default:user",
  debt: "number|default:0",
  status: "enum[active,inactive]|default:active",
  createdAt: "string|timestamp",
  updatedAt: "string|timestamp",
};

/**
 * Ejemplo de respuesta de la API:
 * {
 *   docs: [
 *     { id: 1, firstName: "Edwin", lastName: "Pérez", role: "user", debt: 50.0, status: "active" },
 *     ...
 *   ],
 *   totalDocs: 50,
 *   limit: 10,
 *   page: 1,
 *   totalPages: 5,
 *   hasNextPage: true,
 *   hasPrevPage: false,
 *   nextPage: 2,
 *   prevPage: null
 * }
 */

export const userExample = {
  id: 1,
  firstName: "Edwin",
  lastName: "Pérez",
  role: "user",
  debt: 50.0,
  status: "active",
  createdAt: "2026-02-15T10:30:00Z",
  updatedAt: "2026-02-18T14:22:00Z",
};

export const userDemoRows = [
  {
    id: 1,
    firstName: "Edwin",
    lastName: "Pérez",
    role: "user",
    debt: 50.0,
    status: "active",
  },
  {
    id: 2,
    firstName: "Kristal",
    lastName: "González",
    role: "admin",
    debt: 0,
    status: "active",
  },
  {
    id: 3,
    firstName: "Juan",
    lastName: "López",
    role: "user",
    debt: 120.5,
    status: "active",
  },
  {
    id: 4,
    firstName: "María",
    lastName: "Rodríguez",
    role: "user",
    debt: 0,
    status: "inactive",
  },
  {
    id: 5,
    firstName: "Carlos",
    lastName: "García",
    role: "admin",
    debt: 30.0,
    status: "active",
  },
  {
    id: 6,
    firstName: "Ana",
    lastName: "Martínez",
    role: "user",
    debt: 85.75,
    status: "active",
  },
  {
    id: 7,
    firstName: "Pedro",
    lastName: "Sánchez",
    role: "user",
    debt: 0,
    status: "active",
  },
  {
    id: 8,
    firstName: "Laura",
    lastName: "Jiménez",
    role: "user",
    debt: 200.0,
    status: "active",
  },
  {
    id: 9,
    firstName: "Miguel",
    lastName: "Vargas",
    role: "user",
    debt: 0,
    status: "active",
  },
  {
    id: 10,
    firstName: "Sofia",
    lastName: "Torres",
    role: "user",
    debt: 45.25,
    status: "active",
  },
  {
    id: 11,
    firstName: "Diego",
    lastName: "Navarro",
    role: "user",
    debt: 0,
    status: "inactive",
  },
  {
    id: 12,
    firstName: "Beatriz",
    lastName: "Castro",
    role: "user",
    debt: 95.0,
    status: "active",
  },
];

export const userPurchaseDemoRows = [
  {
    id: 1,
    date: "2026-02-15",
    total: 150.5,
    status: "Pagado",
  },
  {
    id: 2,
    date: "2026-02-10",
    total: 45.0,
    status: "Pendiente",
  },
  {
    id: 3,
    date: "2026-02-12",
    total: 89.75,
    status: "Pagado",
  },
  {
    id: 4,
    date: "2026-02-08",
    total: 200.0,
    status: "Pendiente",
  },
  {
    id: 5,
    date: "2026-02-05",
    total: 65.25,
    status: "Pagado",
  },
  {
    id: 6,
    date: "2026-02-01",
    total: 120.5,
    status: "Pagado",
  },
  {
    id: 7,
    date: "2026-01-28",
    total: 85.0,
    status: "Pagado",
  },
  {
    id: 8,
    date: "2026-01-25",
    total: 210.75,
    status: "Pendiente",
  },
  {
    id: 9,
    date: "2026-01-20",
    total: 95.5,
    status: "Pagado",
  },
  {
    id: 10,
    date: "2026-01-15",
    total: 135.0,
    status: "Pagado",
  },
  {
    id: 11,
    date: "2026-01-10",
    total: 55.25,
    status: "Pagado",
  },
  {
    id: 12,
    date: "2026-01-05",
    total: 175.0,
    status: "Pendiente",
  },
];
