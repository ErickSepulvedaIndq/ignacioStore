import Header from '../components/UI/header.jsx'
import Card from '../components/UI/card'
import Product1 from '../assets/doritos-nachos.png'

export default function App() {
  return (
    <>
      <Header />

      <main className='flex flex-wrap items-center justify-center'>
        {Array.from({ length: 10}).map((_, i) => (
          <Card
           productName="Producto 1"
           price="100"
           img={Product1}
           key={i}
           />
        ))}
      </main>
    </>
  )
}
