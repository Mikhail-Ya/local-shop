// src/components/admin/ProductTable.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  brand: string | null;
  imageUrl: string | null;
  category: { name: string } | null;
  createdAt: string;
}

export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]); // Явно указываем тип — массив
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async  () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/admin/products');
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        // 🔥 КРИТИЧЕСКАЯ ПРОВЕРКА: убедитесь, что data — массив
        if (!Array.isArray(data)) {
          throw new Error('API вернул не массив');
        }

        setProducts(data);
      } catch (err: any) {
        console.error('Ошибка:', err);
        setError(err.message || 'Не удалось загрузить товары');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="py-4">Загрузка товаров...</div>;
  }

  if (error) {
    return <div className="py-4 text-red-600">Ошибка: {error}</div>;
  }

  if (products.length === 0) {
    return <div className="py-4">Товары не найдены.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">ID</th>
            <th className="border p-2 text-left">Изображение</th>
            <th className="border p-2 text-left">Название</th>
            <th className="border p-2 text-left">Категория</th>
            <th className="border p-2 text-left">Бренд</th>
            <th className="border p-2 text-left">Цена</th>
            <th className="border p-2 text-left">Остаток</th>
            <th className="border p-2 text-left">Действия</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="border p-2 text-xs">{product.id}</td>
              <td className="border p-2">
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-10 h-10 object-cover rounded"
                  />
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
              <td className="border p-2 font-medium">{product.name}</td>
              <td className="border p-2">{product.category?.name || '—'}</td>
              <td className="border p-2">{product.brand || '—'}</td>
              <td className="border p-2">{product.price} ₽</td>
              <td className="border p-2">
                <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                  {product.stock}
                </span>
              </td>
              <td className="border p-2">
                <Link 
                  href={`/admin-vkr-2026-secret/products/edit/${product.id}`} 
                  className="text-blue-600 hover:underline mr-3"
                >
                  Редактировать
                </Link>
                {/* <button className="text-red-600 hover:underline">Удалить</button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}