// src/components/catalog/ProductList.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number; // Decimal из Prisma приходит как number в JS
  stock: number;
  imageUrl: string | null;
  brand: string | null;
  category: {
    name: string;
  } | null;
}

interface Props {
  categoryId: string | null;
  brand: string | null;
}

export default function ProductList({ categoryId, brand }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (categoryId) params.append('categoryId', categoryId);
      if (brand) params.append('brand', brand);

      try {
        const url = `/api/products${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Ошибка загрузки');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Ошибка:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, brand]);

  if (loading) {
    return <div>Загрузка товаров...</div>;
  }

  if (products.length === 0) {
    return <div className="text-center py-8">Товары не найдены.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <div
          key={product.id}
          className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="w-full h-48 relative bg-gray-100">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Нет изображения
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-semibold line-clamp-1">{product.name}</h3>
            <p className="text-green-600 font-bold">{product.price} ₽</p>
            <div className="mt-2 text-sm text-gray-600 line-clamp-1">
              {product.category?.name || 'Без категории'} |{' '}
              {product.brand || 'Без бренда'}
            </div>
            <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
              В корзину
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}