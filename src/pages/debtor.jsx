/*
* componente pensado para tener tener a los usuarios que tienen deudas
* permitirle al admin cobrar la deuda en persona y marcarla como pagada
* la idea es que se junten las compras por dia
? o bien enviar un recordatorio de pago por correo :)
*/
import { useState, useEffect } from 'react';

export default function Debtor() {
    const [debtors, setDebtors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Fetch pendientes desde API
        setTimeout(() => {
            setDebtors([
                {
                    id: 1,
                    usuario: 'Juan Pérez',
                    fechaCompra: '2026-02-12',
                    diasVencimiento: 3,
                    total: 150.50,
                    deudaTotal: 200.50,
                },
                {
                    id: 2,
                    usuario: 'María González',
                    fechaCompra: '2026-02-14',
                    diasVencimiento: 1,
                    total: 85.00,
                    deudaTotal: 85.00,
                },
            ]);
            setLoading(false);
        }, 500);
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <p className="text-gray-500">Cargando pendientes...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Pendientes de Pago</h1>

            {debtors.length === 0 ? (
                <div className="bg-green-100 rounded-lg p-8 text-center">
                    <p className="text-green-800 font-semibold">
                         No hay pagos pendientes
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-[#3041A0] text-white">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                    Usuario
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                    Fecha Compra
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                    Días para Cobro
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                    Monto Compra
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                    Deuda Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {debtors.map((pendiente) => (
                                <tr
                                    key={pendiente.id}
                                    className={`hover:bg-gray-50 ${
                                        pendiente.diasVencimiento === 0
                                            ? 'bg-red-50'
                                            : ''
                                    }`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {pendiente.usuario}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(pendiente.fechaCompra).toLocaleDateString(
                                            'es-MX'
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span
                                            className={`px-2 py-1 rounded-full font-semibold ${
                                                pendiente.diasVencimiento === 0
                                                    ? 'bg-red-100 text-red-800'
                                                    : pendiente.diasVencimiento === 1
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}
                                        >
                                            {pendiente.diasVencimiento === 0
                                                ? '¡HOY!'
                                                : `${pendiente.diasVencimiento} día${
                                                      pendiente.diasVencimiento > 1 ? 's' : ''
                                                  }`}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ${pendiente.total.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                        ${pendiente.deudaTotal.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded mr-2 transition">
                                            Cobrar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
