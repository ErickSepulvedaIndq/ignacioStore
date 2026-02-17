import Carrito from '../../assets/carrito.png'
import Lupa from '../../assets/lupa.png'
import LogOut from '../../assets/logOut.png'

export default function Header({ cartCount}){

    return (
        <header className="bg-[#3041A0] text-white p-6 flex justify-between items-center">
            <h1 className="font-bold text-2xl italic">IGNACIO STORE</h1>
            <div className="flex items-center justify-center gap-2 bg-white text-black p-2 rounded-lg w-1/4">
                <input type="text" className="bg-white text-black p-2 rounded-lg w-full outline-none" placeholder="Buscar producto..." />
                <img src={Lupa} alt="Lupa" className='h-9 hover:scale-110 transition-transform cursor-pointer'/>
            </div>
            <div className="relative w-fit">
                <img
                    src={Carrito}
                    alt="Carrito"
                    className="h-10 hover:scale-110 transition-transform cursor-pointer"
                />

                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-[2px] rounded-full" hidden={cartCount === 0}>
                    {cartCount}
                </span>
                
            </div>
        </header>
    )
}