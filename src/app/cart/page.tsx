// src/app/cart/page.tsx
'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold">Ваша корзина пуста</h1>
        <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Корзина</h1>
      <div className="space-y-6">
        {items.map(item => (
          <div key={item.id} className="flex items-center border p-4 rounded-lg">
            <img src={item.image || '/placeholder.jpg'} alt={item.name} className="w-16 h-16 object-cover rounded" />
            <div className="ml-4 flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-green-600 font-bold">{item.price} ₽</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 rounded-full border flex items-center justify-center"
              >
                -
              </button>
              <span className="w-10 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 rounded-full border flex items-center justify-center"
              >
                +
              </button>
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="ml-4 text-red-500 hover:text-red-700"
            >
              Удалить
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t pt-4 flex justify-between items-center">
        <div className="text-xl font-bold">Итого: {totalPrice} ₽</div>
        <Link
          href="/checkout"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Оформить заказ
        </Link>
      </div>
    </div>
  );
}