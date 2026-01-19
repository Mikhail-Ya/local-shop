// src/app/admin/page.tsx

import OrdersTable from '@/components/admin/OrdersTable';

export default function AdminPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Управление заказами</h1>
      <OrdersTable />
    </div>
  );
}