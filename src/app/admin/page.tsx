// src/app/admin/page.tsx
import OrdersTable from '@/components/admin/OrdersTable';
import Link from 'next/link';
export const dynamic = 'force-dynamic';
export default function AdminPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Админ-панель</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Управление заказами</h2>
        <OrdersTable />
      </div>
      {/* Здесь можно добавить ссылки на управление товарами, категориями и т.д. */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/products" className="block p-4 bg-blue-50 rounded hover:bg-blue-100 text-center">
          Управление товарами
        </Link>
        <Link href="/admin/categories" className="block p-4 bg-green-50 rounded hover:bg-green-100 text-center">
          Управление категориями
        </Link>
        <Link href="/admin/delivery-zones" className="block p-4 bg-purple-50 rounded hover:bg-purple-100 text-center">
          Зоны доставки
        </Link>
      </div>
    </div>
  );
}