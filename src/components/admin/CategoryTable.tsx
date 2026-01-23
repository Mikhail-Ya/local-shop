// src/components/admin/CategoryTable.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  createdAt: string;
}

export default function CategoryTable() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/admin/categories');
        if (!res.ok) throw new Error('Ошибка загрузки');
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error('Неверный формат данных');
        setCategories(data);
      } catch (error) {
        console.error(error);
        alert('Не удалось загрузить категории');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">ID</th>
            <th className="border p-2 text-left">Название</th>
            <th className="border p-2 text-left">Дата создания</th>
            <th className="border p-2 text-left">Действия</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map(cat => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="border p-2 text-xs">{cat.id}</td>
                <td className="border p-2 font-medium">{cat.name}</td>
                <td className="border p-2">
                  {new Date(cat.createdAt).toLocaleDateString('ru-RU')}
                </td>
                <td className="border p-2">
                  {/* Редактирование можно добавить позже */}
                  <span className="text-gray-400">Редактирование пока недоступно</span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="border p-4 text-center">Категории не найдены</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}