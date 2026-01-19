// src/components/checkout/CheckoutStep2.tsx

'use client';

import { useRouter } from 'next/navigation';

interface Props {
  orderData: any;
  onBack: () => void;
}

export default function CheckoutStep2({ orderData, onBack }: Props) {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет отправка заказа на сервер
    // Для демонстрации просто перенаправляем на страницу успеха
    router.push('/order-success');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Шаг 2: Подтверждение заказа</h2>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Ваш заказ</h3>
        <div className="border rounded p-4">
          <div className="flex justify-between mb-2">
            <span>Палатка "Hiker"</span>
            <span>1 x 7 490 ₽</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Спальник "Tramp"</span>
            <span>1 x 4 900 ₽</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-bold">
            <span>ИТОГО:</span>
            <span>12 480 ₽</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Доставка</h3>
        <div className="border rounded p-4">
          <div className="mb-2">
            <span className="font-medium">Доставка в:</span> {orderData.deliveryCity === 'ostashkov' ? 'Осташков' : orderData.deliveryCity === 'selizharovo' ? 'Селижарово' : 'Пено'}
          </div>
          <div>
            <span className="font-medium">Примерная дата:</span> 30 февраля {/* Заглушка */}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Контактные данные</h3>
        <div className="border rounded p-4">
          <div className="mb-2"><span className="font-medium">Имя:</span> {orderData.customerName}</div>
          <div className="mb-2"><span className="font-medium">Телефон:</span> {orderData.phone}</div>
          <div><span className="font-medium">Email:</span> {orderData.email}</div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Адрес</h3>
        <div className="border rounded p-4">
          {orderData.deliveryAddress || 'Не указан'}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          onClick={onBack}
        >
          Назад
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Подтвердить заказ
        </button>
      </div>
    </div>
  );
}