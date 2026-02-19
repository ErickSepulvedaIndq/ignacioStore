export const productModel = {
  id: "string|required",
  name: "string|required",
  price: "number|required",
  stock: "number|default:0",
  status: "enum[active,inactive]|default:active",
  createdAt: "string|timestamp",
  updatedAt: "string|timestamp",
};

export const productExample = {
  id: 1,
  name: "Doritos Nachos",
  price: 25.5,
  stock: 15,
  status: "active",
  createdAt: "2026-02-10T09:15:00Z",
  updatedAt: "2026-02-18T16:45:00Z",
};
