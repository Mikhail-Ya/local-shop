// src/components/ui/WeeklyProducts.tsx

import Link from 'next/link';

export default function WeeklyProducts() {
  // Здесь будут реальные товары из БД, пока заглушка
  

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-6">ТОВАРЫ НЕДЕЛИ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/*products.map(product => (
            <div key={product.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-lg font-bold text-green-600">{product.price} ₽</p>
                <Link href={`/product/${product.slug}`} className="mt-2 inline-block text-blue-600 hover:underline">Подробнее</Link>
              </div>
            </div>
          ))*/}
        </div>
      </div>
    </section>
  );
}