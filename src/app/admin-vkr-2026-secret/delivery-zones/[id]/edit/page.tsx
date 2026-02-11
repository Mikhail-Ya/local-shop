// src/app/admin-vkr-2026-secret/delivery-zones/[id]/edit/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface DeliveryZone {
  id: string;
  name: string;
  deliveryFee: number;
  isActive: boolean;
}

export default function EditDeliveryZonePage() {
  const [zone, setZone] = useState<DeliveryZone | null>(null);
  const [name, setName] = useState('');
  const [deliveryFee, setDeliveryFee] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchZone = async () => {
      try {
        const res = await fetch(`/api/admin/delivery-zones/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setZone(data);
          setName(data.name);
          setDeliveryFee(String(data.deliveryFee));
          setIsActive(data.isActive);
        }
      } catch (error) {
        console.error(error);
        alert('Ошибка загрузки зоны доставки');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchZone();
    }
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !deliveryFee) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/delivery-zones/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          deliveryFee: parseFloat(deliveryFee),
          isActive,
        }),
      });

      if (res.ok) {
        alert('Зона доставки успешно обновлена!');
        router.push('/admin-vkr-2026-secret/delivery-zones');
      } else {
        const error = await res.json();
        alert(error.error || 'Ошибка при обновлении зоны доставки');
      }
    } catch (err) {
      console.error(err);
      alert('Ошибка сети');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container mx-auto py-8">Загрузка...</div>;
  if (!zone) return <div className="container mx-auto py-8">Зона не найдена</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Редактировать зону доставки</h1>
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
          disabled={saving}
          className={`px-4 py-2 rounded text-white ${
            saving ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {saving ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </form>
    </div>
  );
}