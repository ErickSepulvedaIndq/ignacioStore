import Plus from '../../assets/plus.png'
import Minus from '../../assets/minus.png'
import { useState } from 'react'

export default function Card({ productName, price, img, setCartCount}) {
    const [quantity, setQuantity] = useState(1)

    const handleQuantityChange = (value) => {
        if (value < 1) {
            return
        }
        setQuantity(value)
    }

    const handleAddToCart = (quantity) => {
        setCartCount(prev => prev + quantity)
    }
    return (
        <>
            <div className="p-10">
                <div className="group relative bg-[#0000000D] rounded-lg w-64 hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-center py-4">
                        <img src={img} alt={productName} className="h-50" />
                    </div>
                    <h2 className="font-bold pb-2 pl-2">{productName}</h2>
                    <p className="font-bold pb-2 pl-2">${price}</p>
                    <div className="flex items-center justify-center gap-10">
                        <img src={Minus} alt="Plus" className="h-6 hover:rounded-full hover:scale-110 hover:bg-[#D8D7D5] cursor-pointer" onClick={() => handleQuantityChange(quantity - 1)} disabled={quantity === 1}/>
                        <p className="font-bold">{quantity}</p>
                        <img src={Plus} alt="Minus" className="h-6 hover:rounded-lg hover:scale-110 hover:bg-[#D8D7D5] cursor-pointer" onClick={() => handleQuantityChange(quantity + 1)}/>
                    </div>
                    <div className="max-h-0 overflow-hidden
                group-hover:max-h-40
                transition-all duration-300 group-hover:pt-4">
                        <div className="flex flex-col gap-2">
                        
                            <button className="w-full bg-[#3041A0] p-2 text-white rounded-lg cursor-pointer hover:bg-[#25327D]"
                            onClick={() => handleAddToCart(quantity)}>
                            Agregar al carrito
                            </button>

                            <button className="w-full bg-[#FFCA1A] p-2 text-white rounded-lg cursor-pointer hover:bg-[#E5B816]">
                            Comprar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
        </>
    )
}
