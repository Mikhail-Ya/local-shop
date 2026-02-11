// src/components/checkout/DeliveryCitySelector.tsx
'use client';

import { useEffect, useState } from 'react';
import { DeliveryZone } from '@prisma/client';

interface Props {
  value: string;
  onChange: (zoneName: string, zoneData: DeliveryZone) => void;
}

export default function DeliveryCitySelector({ value, onChange }: Props) {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Загружаем данные через API
    fetch('/api/delivery-zones')
      .then(res => res.json())
      .then(data => {
        setZones(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка загрузки зон:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Загрузка городов...</div>;
  }

  return (
    <div className="space-y-4">
      {zones.map(zone => (
        <div key={zone.id} className="flex items-start space-x-3 border rounded-lg p-4 cursor-pointer">
          <input
            type="radio"
            id={`city-${zone.id}`}
            name="deliveryCity"
            value={zone.name}
            checked={value === zone.name}
            onChange={() => onChange(zone.name, zone)}
            className="mt-1"
          />
          <label htmlFor={`city-${zone.id}`} className="flex-1 cursor-pointer space-y-1">
            <div className="font-medium">{zone.name}</div>
            <div className="text-sm text-gray-600">
              {zone.deliveryFee && Number(zone.deliveryFee) > 0
                ? `Доставка: ${Number(zone.deliveryFee)} ₽`
                : 'Бесплатная доставка'}
            </div>
          </label>
        </div>
      ))}
    </div>
  );
}