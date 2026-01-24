
import Link from 'next/link';
import CategoryTable from '@/components/admin/CategoryTable';

export default function AdminCategoriesPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление категориями</h1>
        <Link
          href="/admin/categories/new"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Добавить категорию
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <CategoryTable />
      </div>
    </div>
  );
}