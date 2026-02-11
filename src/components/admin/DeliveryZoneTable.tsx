// src/components/admin/DeliveryZoneTable.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DeliveryZone {
  id: string;
  name: string;
  deliveryFee: number;
  isActive: boolean;
  createdAt: string;
}

export default function DeliveryZoneTable() {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const res = await fetch('/api/admin/delivery-zones');
        if (!res.ok) throw new Error('Ошибка загрузки');
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error('Неверный формат данных');
        setZones(data);
      } catch (error) {
        console.error(error);
        alert('Не удалось загрузить зоны доставки');
      } finally {
        setLoading(false);
      }
    };

    fetchZones();
  }, []);

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">ID</th>
            <th className="border p-2 text-left">Город</th>
            <th className="border p-2 text-left">Стоимость доставки</th>
            <th className="border p-2 text-left">Статус</th>
            <th className="border p-2 text-left">Дата создания</th>
            <th className="border p-2 text-left">Действия</th>
          </tr>
        </thead>
        <tbody>
          {zones.length > 0 ? (
            zones.map(zone => (
              <tr key={zone.id} className="hover:bg-gray-50">
                <td className="border p-2 text-xs">{zone.id}</td>
                <td className="border p-2 font-medium">{zone.name}</td>
                <td className="border p-2">{zone.deliveryFee} ₽</td>
                <td className="border p-2">
                  <span className={zone.isActive ? 'text-green-600' : 'text-red-600'}>
                    {zone.isActive ? 'Активна' : 'Неактивна'}
                  </span>
                </td>
                <td className="border p-2">
                  {new Date(zone.createdAt).toLocaleDateString('ru-RU')}
                </td>
                <td className="border p-2">
                  <Link
                    href={`/admin-vkr-2026-secret/delivery-zones/${zone.id}/edit`}
                    className="text-blue-600 hover:underline mr-3"
                  >
                    Редактировать
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="border p-4 text-center">Зоны доставки не найдены</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}