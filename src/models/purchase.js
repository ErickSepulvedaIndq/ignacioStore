
export const purchaseModel = {
  id: "string|required",
  userId: "string|required",
  date: "string|required",
  total: "number|required",
  status: "enum[pending,paid]|default:pending",
  createdAt: "string|timestamp",
  updatedAt: "string|timestamp",
};
