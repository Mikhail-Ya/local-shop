// src/components/checkout/CheckoutStep1.tsx

'use client';

import { useState } from 'react';
import DeliveryCitySelector from '@/components/checkout/DeliveryCitySelector';

interface Props {
  onContinue: (data: any) => void;
}

export default function CheckoutStep1({ onContinue }: Props) {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    deliveryCity: '',
    deliveryAddress: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleDeliveryCityChange = (cityId: string, cityData: any) => {
    setFormData(prev => ({ ...prev, deliveryCity: cityId }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Имя обязательно';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Телефон обязателен';
    } else if (!/^\+7\(\d{3}\)\s*\d{3}-\d{2}-\d{2}$/.test(formData.phone)) {
      newErrors.phone = 'Неверный формат телефона';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Неверный формат email';
    }

    if (!formData.deliveryCity) {
      newErrors.deliveryCity = 'Необходимо выбрать город доставки';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Здесь можно добавить логику отправки данных на сервер
      // Для демонстрации просто передаем данные дальше
      onContinue({
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email,
        deliveryCity: formData.deliveryCity,
        deliveryAddress: formData.deliveryAddress,
        items: [], // Заглушка
        totalAmount: 0, // Заглушка
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Шаг 1: Контакты и доставка</h2>

      <div className="mb-4">
        <label className="block mb-1">ФИО *</label>
        <input
          type="text"
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${errors.customerName ? 'border-red-500' : ''}`}
        />
        {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>}
      </div>

      <div className="mb-4">
        <label className="block mb-1">Телефон *</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+7 (XXX) XXX-XX-XX"
          className={`w-full p-2 border rounded ${errors.phone ? 'border-red-500' : ''}`}
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>

      <div className="mb-4">
        <label className="block mb-1">Email *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div className="mb-4">
        <label className="block mb-1">Выберите город доставки *</label>
        <DeliveryCitySelector
          value={formData.deliveryCity}
          onChange={handleDeliveryCityChange}
        />
        {errors.deliveryCity && <p className="text-red-500 text-sm mt-1">{errors.deliveryCity}</p>}
      </div>

      <div className="mb-6">
        <label className="block mb-1">Адрес (улица, дом, квартира) или комментарий для курьера</label>
        <textarea
          name="deliveryAddress"
          value={formData.deliveryAddress}
          onChange={handleChange}
          rows={3}
          className="w-full p-2 border rounded"
        ></textarea>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          onClick={() => window.history.back()}
        >
          Назад к корзине
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Далее
        </button>
      </div>
    </form>
  );
}