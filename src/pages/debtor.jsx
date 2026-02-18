/*
* componente pensado para tener tener a los usuarios que tienen deudas
* permitirle al admin cobrar la deuda en persona y marcarla como pagada
* la idea es que se junten las compras por dia
? o bien enviar un recordatorio de pago por correo :)
*/
import { useState, useEffect } from 'react';
import { useMemo } from 'react';
import { useSearch } from '../context/SearchContext';
import Paginator from '../components/UI/Paginator';
import { debtorMonthlyPurchasesDemo } from '../models/purchase';

export default function Debtor() {
    const [pendingPayments, setPendingPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const { normalizedSearch } = useSearch();
    //IMPORTANTE PARA EL BACKEND
    //ESTO NO SE SI DEBERIA HACERLO YO AQUI PERO ESTOY SEGURO QUE EL CALCULAR LOS DIAS PARA VENCER SE TIENE QUE HACER
    useEffect(() => {
        // TODO: Fetch pendientes desde API
        setTimeout(() => {
            setPendingPayments(debtorMonthlyPurchasesDemo);
            setLoading(false);
            setCurrentPage(1);
        }, 500);
    }, []);

    const filteredDebtors = useMemo(() => {
        if (!normalizedSearch) {
            return pendingPayments;
        }

        return pendingPayments.filter((payment) => {
            const searchableText = `${payment.userName} ${payment.purchaseDate} ${payment.purchaseAmount} ${payment.totalDebt}`.toLowerCase();
            return searchableText.includes(normalizedSearch);
        });
    }, [pendingPayments, normalizedSearch]);

    const totalPages = Math.ceil(filteredDebtors.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedDebtors = filteredDebtors.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <p className="text-gray-500">Cargando informacion</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Pendientes de Pago</h1>

            {filteredDebtors.length === 0 ? (
                <div className="bg-green-100 rounded-lg p-8 text-center">
                    <p className="text-green-800 font-semibold">
                         No se encontraron usuarios pendientes de pago.
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
                            {paginatedDebtors.map((payment) => (
                                <tr key={payment.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {payment.userName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(payment.purchaseDate).toLocaleDateString(
                                            'es-MX'
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ${payment.purchaseAmount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                        ${payment.totalDebt.toFixed(2)}
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

            {filteredDebtors.length > 0 && (
                <Paginator
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    loading={loading}
                />
            )}
        </div>
    );
}
