export const formatBuyLogsForTable = (buyLogs) => {
  if (!Array.isArray(buyLogs)) {
    return [];
  }

  // convertir cada log individual en una fila de la tabla
  return buyLogs
    .map((log, index) => {
      // calcular total considerando cantidad de cada producto
      const productsTotal = log.products.reduce((sum, product) => {
        const quantity = product.quantity || 1;
        return sum + (product.price * quantity);
      }, 0);

      const total = Number(log.totalCost) > 0 ? Number(log.totalCost) : productsTotal;

      return {
        id: log._id || index,
        date: log.createdAt,
        displayDate: new Date(log.createdAt).toLocaleDateString("es-MX"),
        total: total,
        status: log.isPaid === false ? "Pendiente" : "Pagado",
        products: log.products.map(p => ({
          ...p,
          quantity: p.quantity || 1
        })),
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
};

/**
 * para obtener detalles para un ticket
 */
export const getPurchaseDetails = (purchase) => {
  return {
    date: new Date(purchase.date).toLocaleDateString("es-MX"),
    products: purchase.products,
    total: purchase.total,
    status: purchase.status,
  };
};
