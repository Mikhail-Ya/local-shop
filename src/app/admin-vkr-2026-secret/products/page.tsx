// src/app/admin/products/page.tsx
import Link from 'next/link';
import ProductTable from '@/components/admin/ProductTable';

export default function AdminProductsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление товарами</h1>
        <Link
          href="/admin/products/new"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Добавить товар
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <ProductTable />
      </div>
    </div>
  );
}