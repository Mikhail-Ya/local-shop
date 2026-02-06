'use client';
// src/components/ui/WeeklyProducts.tsx

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface WeeklyProduct {
  id: string;
  name: string;
  price: number;
  imageUrl: string | string[] | null;
}

export default function WeeklyProducts() {
  const [products, setProducts] = useState<WeeklyProduct[]>([]);

  useEffect(() => {
    const fetchWeekly = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) return;
        const all = await res.json();
        // Берём первые 4 товара как "товары недели"
        const mapped: WeeklyProduct[] = (all || []).slice(0, 4).map((p: any) => ({
          id: p.id,
          name: p.name,
          price: Number(p.price),
          imageUrl: p.imageUrl ?? null,
        }));
        setProducts(mapped);
      } catch (e) {
        console.error('Ошибка загрузки товаров недели', e);
      }
    };

    fetchWeekly();
  }, []);

  if (!products.length) {
    return null;
  }

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="section-title">
          <i className="fas fa-star"></i> ТОВАРЫ НЕДЕЛИ
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => {
            const image =
              Array.isArray(product.imageUrl) && product.imageUrl.length > 0
                ? product.imageUrl[0]
                : typeof product.imageUrl === 'string'
                ? product.imageUrl
                : null;

            return (
              <div
                key={product.id}
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
              >
                <div className="w-full h-48 relative bg-gray-100">
                  {image ? (
                    <Image
                      src={image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Нет изображения
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                  <p className="text-lg font-bold text-green-600 mt-2">
                    {product.price} ₽
                  </p>
                  <Link
                    href={`/product/${product.id}`}
                    className="mt-3 inline-block text-blue-600 hover:underline text-sm"
                  >
                    Подробнее
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}