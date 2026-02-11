// src/app/admin-vkr-2026-secret/delivery-zones/new/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewDeliveryZonePage() {
  const [name, setName] = useState('');
  const [deliveryFee, setDeliveryFee] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !deliveryFee) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/delivery-zones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          deliveryFee: parseFloat(deliveryFee),
          isActive,
        }),
      });

      if (res.ok) {
        alert('Зона доставки успешно создана!');
        router.push('/admin-vkr-2026-secret/delivery-zones');
      } else {
        const error = await res.json();
        alert(error.error || 'Ошибка при создании зоны доставки');
      }
    } catch (err) {
      console.error(err);
      alert('Ошибка сети');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Добавить новую зону доставки</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2 font-medium">Город/Зона *</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Например: Москва, Санкт-Петербург"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="deliveryFee" className="block mb-2 font-medium">Стоимость доставки (₽) *</label>
          <input
            type="number"
            id="deliveryFee"
            value={deliveryFee}
            onChange={(e) => setDeliveryFee(e.target.value)}
            min="0"
            step="0.01"
            className="w-full p-2 border rounded"
            placeholder="Например: 350"
            required
          />
        </div>
        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4"
            />
            <span>Активна</span>
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${
            loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? 'Создание...' : 'Создать зону'}
        </button>
      </form>
    </div>
  );
}