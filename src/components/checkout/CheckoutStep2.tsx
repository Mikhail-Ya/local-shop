// src/components/checkout/CheckoutStep2.tsx
'use client';

import { OrderData } from '@/types/order'; // ← создадим этот тип ниже

interface CheckoutStep2Props {
  orderData: OrderData;
  onBack: () => void;
  onSubmit: () => Promise<void>; // ← добавили!
}

export default function CheckoutStep2({ orderData, onBack, onSubmit }: CheckoutStep2Props) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Шаг 2: Подтверждение заказа</h2>

      {/* Отображение товаров */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Ваш заказ</h3>
        <div className="border rounded p-4">
          {orderData.items.map((item, idx) => (
            <div key={idx} className="flex justify-between mb-2">
              <span>{item.name}</span>
              <span>{item.quantity} × {item.price} ₽</span>
            </div>
          ))}
          <hr className="my-2" />
          <div className="flex justify-between font-bold">
            <span>ИТОГО:</span>
            <span>{orderData.totalAmount} ₽</span>
          </div>
        </div>
      </div>

      {/* Доставка */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Доставка</h3>
        <div className="border rounded p-4">

          {orderData.isPickup ? (
            <div className="text-green-600 font-medium">
              <i className="fas fa-hand-paper mr-2"></i>Самовывоз
              <div className="mb-2">
                <span className="font-medium">Город:</span> {orderData.deliveryCity}
              </div>
            </div>
          ) : (
            <>
              {orderData.deliveryCity && (
                <div>
                  <span className="font-medium">Город:</span> {orderData.deliveryCity}
                </div>
              )}
              {orderData.deliveryAddress && (
                <div>
                  <span className="font-medium">Адрес:</span> {orderData.deliveryAddress}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Контакты */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Контактные данные</h3>
        <div className="border rounded p-4">
          <div className="mb-2"><span className="font-medium">Имя:</span> {orderData.customerName}</div>
          <div className="mb-2"><span className="font-medium">Телефон:</span> {orderData.phone}</div>
          <div><span className="font-medium">Email:</span> {orderData.email}</div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Назад
        </button>
        <button
          type="button"
          onClick={onSubmit} // ← вызываем onSubmit
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Подтвердить заказ
        </button>
      </div>
    </div>
  );
}