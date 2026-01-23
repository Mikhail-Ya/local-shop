// src/components/catalog/CatalogFilters.tsx
'use client';

import { useEffect, useState } from 'react';

interface Category {
  id: string;
  name: string;
}

interface Props {
  selectedCategoryId: string | null;
  selectedBrand: string | null;
  onCategoryChange: (id: string | null) => void;
  onBrandChange: (brand: string | null) => void;
}

export default function CatalogFilters({
  selectedCategoryId,
  selectedBrand,
  onCategoryChange,
  onBrandChange,
}: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilters = async () => {
      setLoading(true);
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/brands'),
        ]);

        if (categoriesRes.ok) {
          const cats = await categoriesRes.json();
          setCategories(cats);
        }

        if (brandsRes.ok) {
          const brs = await brandsRes.json();
          setBrands(brs);
        }
      } catch (error) {
        console.error('Ошибка загрузки фильтров:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, []);

  const handleReset = () => {
    onCategoryChange(null);
    onBrandChange(null);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Фильтры</h2>

      {/* Категории */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Категория</h3>
        <div className="space-y-2">
          <button
            onClick={() => onCategoryChange(null)}
            className={`block w-full text-left px-2 py-1 rounded hover:bg-gray-100 ${
              !selectedCategoryId ? 'bg-blue-100 font-medium' : ''
            }`}
          >
            Все категории
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`block w-full text-left px-2 py-1 rounded hover:bg-gray-100 ${
                selectedCategoryId === category.id ? 'bg-blue-100 font-medium' : ''
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Бренды */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Бренд</h3>
        <div className="space-y-2">
          <button
            onClick={() => onBrandChange(null)}
            className={`block w-full text-left px-2 py-1 rounded hover:bg-gray-100 ${
              !selectedBrand ? 'bg-blue-100 font-medium' : ''
            }`}
          >
            Все бренды
          </button>
          {brands.map(brand => (
            <button
              key={brand}
              onClick={() => onBrandChange(brand)}
              className={`block w-full text-left px-2 py-1 rounded hover:bg-gray-100 ${
                selectedBrand === brand ? 'bg-blue-100 font-medium' : ''
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Цена */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Цена, ₽</h3>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="от"
            min="0"
            className="border rounded px-2 py-1 w-20"
            onChange={(e) => {
              // Логика для цены будет добавлена позже, если нужно
            }}
          />
          <span>-</span>
          <input
            type="number"
            placeholder="до"
            min="0"
            className="border rounded px-2 py-1 w-20"
            onChange={(e) => {
              // Логика для цены будет добавлена позже, если нужно
            }}
          />
        </div>
      </div>

      <button
        onClick={handleReset}
        className="w-full bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded"
      >
        Сбросить
      </button>
    </div>
  );
}