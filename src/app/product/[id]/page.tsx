// src/app/product/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  imageUrl: string | null;
  brand: string | null;
  category: {
    id: string;
    name: string;
  } | null;
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${params.id}`);
        if (!res.ok) throw new Error('Товар не найден');
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.imageUrl || undefined,
      });
    }
  };

  if (loading) return <div className="container mx-auto py-8">Загрузка...</div>;
  if (!product) return <div className="container mx-auto py-8">Товар не найден</div>;

  return (
    <div className="container mx-auto py-8">
      <nav className="mb-6">
        <Link href="/" className="text-blue-600 hover:underline">Главная</Link> {'>'}{' '}
        {product.category && (
          <Link href={`/catalog?categoryId=${product.category.id}`} className="text-blue-600 hover:underline">
            {product.category.name}
          </Link>
        )} {'>'}{' '}
        <span>{product.name}</span>
      </nav>

      <h1 className="section-title mb-4">
        <i className="fas fa-box-open"></i> {product.name}
      </h1>

      <div className="flex flex-col md:flex-row gap-8 mt-4">
        {/* Изображение */}
        <div className="md:w-1/2">
          <div className="w-full h-96 relative bg-gray-100 rounded-lg overflow-hidden">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Нет изображения
              </div>
            )}
          </div>
        </div>

        {/* Информация */}
        <div className="md:w-1/2">
          <div className="mb-4">
            <span className="text-green-600 font-bold text-2xl">{product.price} ₽</span>
            {product.stock > 0 ? (
              <span className="ml-4 text-green-600">В наличии</span>
            ) : (
              <span className="ml-4 text-red-600">Нет в наличии</span>
            )}
          </div>

          {product.brand && (
            <p className="mb-2"><strong>Бренд:</strong> {product.brand}</p>
          )}

          {product.description && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Описание</h2>
              <p className="whitespace-pre-line">{product.description}</p>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`px-6 py-3 rounded font-semibold ${
              product.stock > 0
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {product.stock > 0 ? 'Добавить в корзину' : 'Нет в наличии'}
          </button>
        </div>
      </div>
    </div>
  );
}