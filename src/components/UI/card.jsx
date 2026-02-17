export default function Card({ productName, price, img}) {
    return (
        <>
            <div className="p-10">
                <div className="group bg-[#0000000D] rounded-lg w-64 h-70 hover:scale-105 transition-tranform">
                    <img src={img} alt={productName} className="h-50 flex items-center" />
                    <h2>{productName}</h2>
                    <p>{price}</p>
                    <button className="absolute bottom-2 left-0 right-0 opacity-0 bg-[#FFCA1A] p-2 text-white rounded-lg group-hover:opacity-100">Comprar</button>
                </div>
            </div>
            
        </>
    )
}