// src/app/admin-vkr-2026-secret/products/page.tsx
import Link from 'next/link';
import ProductTable from '@/components/admin/ProductTable';
import ProductsCsvImportButton from '@/components/admin/ProductsCsvImportButton';

export default function AdminProductsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Управление товарами</h1>
        <div className="flex flex-col items-start md:items-end gap-2">
          <Link
            href="/admin-vkr-2026-secret/products/new"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Добавить товар
          </Link>
          <ProductsCsvImportButton />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <ProductTable />
      </div>
    </div>
  );
}