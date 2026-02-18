import Card from '../components/UI/card';
import Product1 from '../assets/doritos-nachos.png';

// necesitamos traer la informacion de la API para poder plasmarla aqui
// por mientras pues se llena automaticamente
const productosEstaticos = Array.from({ length: 10 }).map((_, i) => ({
    id: `product-${i}`,
    name: `Producto ${i + 1}`,
    price: ((i * 13.2) % 100 + 20).toFixed(2),
    img: Product1,
}));

export default function Product() {
    // TODO: Fetch productos desde API
    const productos = productosEstaticos;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Productos</h1>

            <div className="flex flex-wrap items-center justify-center">
                {productos.map((producto) => (
                    <Card
                        key={producto.id}
                        productId={producto.id}
                        productName={producto.name}
                        price={producto.price}
                        img={producto.img}
                    />
                ))}
            </div>
        </div>
    );
}
