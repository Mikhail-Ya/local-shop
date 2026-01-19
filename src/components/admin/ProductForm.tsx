// src/components/admin/ProductForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ProductFormProps {
  product?: any; // Можно уточнить тип
  categories: { id: string; name: string }[];
}

export default function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    sku: product?.sku || '',
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    category_id: product?.category_id || categories[0]?.id || '',
    stock: parseInt(product?.stock) ?? 0,
    images: product?.images?.join('\n') || '',
    attributes: JSON.stringify(product?.attributes || {}, null, 2),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      stock: formData.stock || 0,
      images: formData.images.split('\n').filter(s => s.trim()),
      attributes: JSON.parse(formData.attributes || '{}'),
    };

    try {
      const url = product
        ? `/api/admin/products/${product.id}`
        : '/api/admin/products';
      const method = product ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(product ? 'Товар обновлён!' : 'Товар создан!');
        router.push('/admin/products');
      } else {
        alert('Ошибка сохранения');
      }
    } catch (err) {
      console.error(err);
      alert('Ошибка сети');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <div>
        <label className="block">Артикул (SKU) *</label>
        <input
          name="sku"
          value={formData.sku}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block">Название *</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block">URL (slug)</label>
        <input
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          placeholder="palatka-hiker"
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block">Описание</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block">Цена (₽) *</label>
        <input
          name="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block">Категория *</label>
        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="flex items-center">
          <input
            name="in_stock"
            type="checkbox"
            checked={formData.stock}
            onChange={handleChange}
            className="mr-2"
          />
          В наличии
        </label>
      </div>

      <div>
        <label className="block">Изображения (по одной ссылке на строку)</label>
        <textarea
          name="images"
          value={formData.images}
          onChange={handleChange}
          placeholder="/images/p1.jpg&#10;/images/p2.jpg"
          rows={3}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block">Атрибуты (JSON)</label>
        <textarea
          name="attributes"
          value={formData.attributes}
          onChange={handleChange}
          rows={6}
          className="w-full p-2 border rounded font-mono text-sm"
        />
        <p className="text-sm text-gray-600 mt-1">
          Пример: {"{"}"brand": "Hiker", "purpose": "Отдых"{"]"}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {product ? 'Сохранить' : 'Создать'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}