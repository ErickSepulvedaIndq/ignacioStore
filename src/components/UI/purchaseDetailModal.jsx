/**
 * modal para ver el detalle de una compra
 * props:
 * - isOpen: controla visibilidad
 * - purchase: compra seleccionada
 * - onClose: cierra el modal
 */
export default function PurchaseDetailModal({ isOpen, purchase, onClose }) {
	if (!isOpen || !purchase) return null;

	const formattedDate = new Date(purchase.date).toLocaleDateString("es-MX", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});

	return (
		<div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
			<div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-bold text-gray-800">Detalles de Compra</h2>
					<button
						onClick={onClose}
						className="text-3xl cursor-pointer transition-all duration-200 ease-in-out hover:scale-175 hover:text-red-500 active:scale-100"
					>
						×
					</button>
				</div>
				<div className="space-y-4">
					<div>
						<p className="text-sm text-gray-500">Fecha</p>
						<p className="text-base font-semibold text-gray-900">
							{formattedDate}
						</p>
					</div>			
                        <div>
						<p className="text-sm text-gray-500 mt-1 mb-2">Estado</p>
						<span
							className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mb-3 ${
								purchase.status === "Pagado"
									? "bg-green-100 text-green-800"
									: "bg-yellow-100 text-yellow-800"
							}`}
						>
							{purchase.status}
						</span>
					</div>                

					<div>
						<p className="text-sm text-gray-500 mb-2">Productos</p>
						<div className="bg-gray-50 rounded p-3 space-y-2 max-h-48 overflow-y-auto">
							{purchase.products.map((product, idx) => (
								<div key={idx} className="flex justify-between text-sm">
									<div className="flex-1">
										<span className="text-gray-700">{product.name}</span>
										<span className="text-gray-500 ml-2">x{product.quantity || 1}</span>
									</div>
									<span className="font-semibold text-gray-900">
										${((product.price || 0) * (product.quantity || 1)).toFixed(2)}
									</span>
								</div>
							))}
						</div>
					</div>
					<div className="pt-4 border-t border-gray-200 ">
						<div className="flex justify-between items-center">
							<span className="text-lg font-bold text-gray-800">Total</span>
							<span className="text-2xl font-bold text-[#3041A0]">
								${purchase.total.toFixed(2)}
							</span>
						</div>
					</div>
				</div>
                

				<button
					onClick={onClose}
					className="w-full mt-6 bg-[#3041A0] text-white py-2 rounded font-semibold hover:bg-[#25348a] hover:shadow-lg hover:scale-104 transition"
				>
					Cerrar
				</button>
			</div>
		</div>
	);
}
