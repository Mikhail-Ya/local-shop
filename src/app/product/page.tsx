// src/app/product/[slug]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Product } from '@prisma/client';

export default function ProductPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${slug}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError('Товар не найден');
          } else {
            setError('Ошибка загрузки товара');
          }
          return;
        }
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError('Не удалось подключиться к серверу');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    // Пока просто alert — позже можно подключить контекст корзины
    alert(`Товар "${product?.name}" добавлен в корзину!`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-300 rounded"></div>
              <div>
                <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-gray-300 rounded w-1/3 mb-6"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                </div>
                <div className="mt-6 h-12 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">{error || 'Товар не найден'}</h1>
        <Link href="/catalog" className="text-blue-600 hover:underline">
          ← Вернуться в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="text-sm mb-6">
        <Link href="/" className="text-blue-600 hover:underline">Главная</Link>
        {' > '}
        <Link href="/catalog" className="text-blue-600 hover:underline">Каталог</Link>
        {' > '}
        <span className="text-gray-600">{product.name}</span>
      </nav>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Изображение */}
          <div className="border rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
            {product.imageUrl && product.imageUrl.length > 0 ? (
              <img
                src={product.imageUrl[0]}
                alt={product.name}
                className="w-full h-auto object-contain p-4"
              />
            ) : (
              <div className="text-gray-500 py-12">Изображение отсутствует</div>
            )}
          </div>

          {/* Информация о товаре */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            

            <div className="mb-4">
              <span className="text-2xl font-bold text-green-600">{Number(product.price).toFixed(2)} ₽</span>
              {product.stock > 0 ? (
                <span className="ml-3 text-green-600">✓ В наличии</span>
              ) : (
                <span className="ml-3 text-red-600">✗ Нет в наличии</span>
              )}
            </div>

            {product.description && (
              <div className="mb-6">
                <h2 className="font-semibold mb-2">Описание</h2>
                <p className="text-gray-800">{product.description}</p>
              </div>
            )}

            {/* Атрибуты (если есть) */}
            {product.attributes && Object.keys(product.attributes).length > 0 && (
              <div className="mb-6">
                <h2 className="font-semibold mb-2">Характеристики</h2>
                <ul className="text-sm space-y-1">
                  {Object.entries(product.attributes).map(([key, value]) => (
                    <li key={key} className="flex">
                      <span className="font-medium w-32 capitalize">{key}:</span>
                      <span>{typeof value === 'object' ? JSON.stringify(value) : value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Кнопка */}
            <button
              onClick={handleAddToCart}
              disabled={!product.stock}
              className={`px-6 py-3 rounded-lg font-semibold ${
                product.stock
              }`}
            >
              {product.stock > 0 ? 'Добавить в корзину' : 'Нет в наличии'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}