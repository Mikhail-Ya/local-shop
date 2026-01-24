// src/components/admin/ProductForm.tsx
'use client';

import { useState, ChangeEvent } from 'react';
import { ProductFormData, CategoryOption } from '@/types/product';

interface ProductFormProps {
  product?: ProductFormData; // опционально — для редактирования
  categories: CategoryOption[];
}

export default function ProductForm({ product, categories }: ProductFormProps) {
  const initialData: ProductFormData = product || {
    name: '',
    description: null,
    price: 0,
    stock: 0,
    imageUrl: [],
    categoryId: null,
    brand: null,
    attributes: null,
  };

  const [formData, setFormData] = useState<ProductFormData>(initialData);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? null : value,
    }));
  };

  const handleImageUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value.trim();
    setFormData((prev) => ({
      ...prev,
      imageUrl: url ? [url] : [],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Отправка данных:', formData);
    // Здесь будет fetch к /api/products или /api/products/[id]
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <div>
        <label className="block mb-1 font-medium">Название *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Цена (₽) *</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          step="0.01"
          min="0"
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Остаток на складе</label>
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          min="0"
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Бренд</label>
        <input
          type="text"
          name="brand"
          value={formData.brand || ''}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Категория</label>
        <select
          name="categoryId"
          value={formData.categoryId || ''}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Не выбрана</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">URL изображения</label>
        <input
          type="url"
          value={formData.imageUrl[0] || ''}
          onChange={handleImageUrlChange}
          placeholder="https://example.com/image.jpg"
          className="w-full p-2 border rounded"
        />
        <p className="text-sm text-gray-500 mt-1">
          Поддержка нескольких изображений будет добавлена позже.
        </p>
      </div>

      <div>
        <label className="block mb-1 font-medium">Описание</label>
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          rows={4}
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        {product ? 'Сохранить изменения' : 'Создать товар'}
      </button>
    </form>
  );
}