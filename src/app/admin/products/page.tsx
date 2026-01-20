// src/app/admin/products/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product } from '@prisma/client';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [importResult, setImportResult] = useState<{ success: number; errors: any[] } | null>(null);
    const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/products')
      .then(res => res.json())
      .then(setProducts);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить товар?')) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    setProducts(products.filter(p => p.id !== id));
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv') {
      alert('Пожалуйста, выберите CSV-файл');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    setImportResult(null);

    try {
      const res = await fetch('/api/admin/products/import', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        setImportResult(result);
        // Обновляем список товаров после импорта
        // (можно вызвать повторную загрузку через ваш useEffect или refetch)
        alert(`Импорт завершён: ${result.success} товаров`);
      } else {
        alert('Ошибка импорта: ' + (result.error || 'неизвестно'));
      }
    } catch (err) {
      console.error(err);
      alert('Ошибка сети при импорте');
    } finally {
      setIsUploading(false);
    }
  };
console.log()
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Товары</h1>
        <div className="flex gap-3">
          {/* Кнопка импорта */}
          <label className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer">
            {isUploading ? 'Загрузка...' : 'Импорт CSV'}
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
            <a
                href="/products-template.csv"
                download
                className="text-sm text-blue-600 hover:underline ml-2"
                >
                Скачать шаблон CSV
            </a>
          {/* Кнопка создания */}
          <Link
            href="/admin/products/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Добавить товар
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Артикул</th>
              <th className="border p-2">Название</th>
              <th className="border p-2">Цена</th>
              <th className="border p-2">Категория</th>
              <th className="border p-2">В наличии</th>
              <th className="border p-2">Действия</th>
            </tr>
          </thead>
          <tbody>     
            { products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="border p-2">{p.sku}</td>
                <td className="border p-2">{p.name}</td>
                <td className="border p-2">{p.price} ₽</td>
                <td className="border p-2">{p.category?.name || '—'}</td>
                <td className="border p-2">{p.stock}</td>
                <td className="border p-2 space-x-2">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    Редактировать
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-600 hover:underline"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
            
          </tbody>
        </table>
      </div>
    </div>
  );
}