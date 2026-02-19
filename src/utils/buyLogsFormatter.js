export const formatBuyLogsForTable = (buyLogs) => {
  if (!Array.isArray(buyLogs)) {
    return [];
  }

  // Agrupar por fecha 
  const groupedByDate = buyLogs.reduce((acc, log) => {
    const date = new Date(log.createdAt).toLocaleDateString("es-MX");
    
    if (!acc[date]) {
      acc[date] = {
        date: log.createdAt,
        displayDate: date,
        totalAmount: 0,
        products: [],
        status: "Pagado", // por defecto sera "Pagado" pero pueden modificarlo en un futuro pero tambien deben moverle a la API
      };
    }

    // Sumar total y agregar productos
    log.products.forEach((product) => {
      acc[date].totalAmount += product.price;
      acc[date].products.push(product);
    });

    return acc;
  }, {});

  // Convertir a array y ordenar por fecha
  return Object.values(groupedByDate)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map((item, index) => ({
      id: index, // ID único para la tabla
      date: item.date,
      displayDate: item.displayDate,
      total: item.totalAmount,
      status: item.status,
      products: item.products,
    }));
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
