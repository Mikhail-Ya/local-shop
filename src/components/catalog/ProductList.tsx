// src/components/catalog/ProductList.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: {
    name: string;
  };
  attributes: {
    purpose?: string;
    brand?: string;
  };
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Ошибка при загрузке товаров');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Ошибка:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
            <div className={"p-4"}>
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-lg font-bold text-green-600">{product.price} ₽</p>
              <div className="mt-2 text-sm text-gray-600">
                <span>{product.category.name}</span> | <span>{product.attributes.brand || 'Без бренда'}</span>
              </div>
              <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                В корзину
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}