import Card from '../components/UI/card'
import Product1 from '../assets/doritos-nachos.png'

export default function App() {
  return (
    <main className='flex flex-wrap items-center justify-center p-6'>
      {Array.from({ length: 10}).map((_, i) => (
        <Card
         productName="Producto 1"
         price="100"
         img={Product1}
         key={i}
         productId={`temp-${i}`}
         />
      ))}
    </main>
  )
}
