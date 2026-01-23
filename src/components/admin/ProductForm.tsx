// src/components/admin/ProductForm.tsx
'use client';

import { useState } from 'react';

interface Category {
  id: string;
  name: string;
}

interface Props {
  categories: Category[];
}

export default function ProductForm({ categories }: Props) {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    brand: '',
    categoryId: '',
    imageUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const priceNum = parseFloat(productData.price);
    const stockNum = parseInt(productData.stock, 10);

    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Некорректная цена');
      return;
    }
    if (isNaN(stockNum) || stockNum < 0) {
      alert('Некорректный остаток');
      return;
    }

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...productData,
          price: priceNum,
          stock: stockNum,
          categoryId: productData.categoryId || null,
        }),
      });

      if (res.ok) {
        alert('Товар добавлен!');
        // Можно перенаправить или очистить форму
      } else {
        alert('Ошибка при создании товара');
      }
    } catch (err) {
      console.error(err);
      alert('Ошибка сети');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1">Название *</label>
        <input
          type="text"
          name="name"
          value={productData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Цена (₽) *</label>
        <input
          type="number"
          name="price"
          value={productData.price} // ← строка, но input type="number" принимает ""
          onChange={handleChange}
          className="w-full p-2 border rounded"
          min="0"
          step="0.01"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Остаток *</label>
        <input
          type="number"
          name="stock"
          value={productData.stock}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          min="0"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Бренд</label>
        <input
          type="text"
          name="brand"
          value={productData.brand}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-1">Категория</label>
        <select
          name="categoryId"
          value={productData.categoryId}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Не выбрано</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1">URL изображения</label>
        <input
          type="url"
          name="imageUrl"
          value={productData.imageUrl}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-1">Описание</label>
        <textarea
          name="description"
          value={productData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows={4}
        />
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Создать товар
      </button>
    </form>
  );
}