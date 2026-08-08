import ModalComponent from "../modals/ModalComponent";


export default function PurchaseDetailModal({ isOpen, purchase, onClose }) {

	const formattedDate = new Date(purchase?.createdAt).toLocaleDateString("es-MX", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});

	return (

		<ModalComponent
			isOpen={isOpen}
			onClose={onClose}
			title={"Detalles de compra"}
		>

			<div className="space-y-4 min-w-70 md:min-w-90">
				<div>
					<p className="text-sm font-bold text-gray-500">Fecha</p>
					<p className="text-base font-semibold text-gray-900">
						{formattedDate}
					</p>
				</div>
				<div>
					<p className="text-sm font-bold text-gray-500 mt-1 mb-2">Estado</p>
					<span
						className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${purchase?.isPaid
							? "bg-green-100 text-green-800"
							: "bg-red-100 text-red-800"
							}`}
					>
						{purchase?.isPaid ? "PAGADO" : "PENDIENTE"}
					</span>
				</div>

				<div>
					<p className="text-sm font-bold text-gray-500 mb-2">Productos</p>
					<div className="bg-gray-100 rounded p-3 space-y-2 max-h-48 overflow-y-auto">
						{purchase?.products?.map((product, idx) => (
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
							${purchase?.totalCost?.toFixed(2)}
						</span>
					</div>
				</div>
			</div>

		</ModalComponent>
	);
}
