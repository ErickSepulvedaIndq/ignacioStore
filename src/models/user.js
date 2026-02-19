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