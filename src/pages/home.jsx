import Carrito from '../assets/carrito.png'
import Card from '../components/card'
import Product1 from '../assets/doritos-nachos.png'

export default function App() {

  return (
    <>
      <header className="bg-[#3041A0] text-white p-6 flex justify-between items-center">
        <h1 className="font-bold text-2xl">Ignacio Store</h1>
        <img src={Carrito} alt="Carrito" className='h-10 hover:scale-110 transition-transform cursor-pointer'/>
      </header>
      <main>
        <Card
         productName="Producto 1"
         price="100"
         img={Product1}
         />
      </main>
    </>
  )
}
