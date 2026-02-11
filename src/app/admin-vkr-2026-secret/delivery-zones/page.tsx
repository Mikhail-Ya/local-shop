// src/app/admin-vkr-2026-secret/delivery-zones/page.tsx
import Link from 'next/link';
import DeliveryZoneTable from '@/components/admin/DeliveryZoneTable';

export default function AdminDeliveryZonesPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление зонами доставки</h1>
        <Link
          href="/admin-vkr-2026-secret/delivery-zones/new"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Добавить зону
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <DeliveryZoneTable />
      </div>
    </div>
  );
}