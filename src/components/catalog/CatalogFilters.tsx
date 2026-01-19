// src/components/catalog/CatalogFilters.tsx

'use client';

import { useState } from 'react';

export default function CatalogFilters() {
  const [selectedPurpose, setSelectedPurpose] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  const purposes = ['Отдых', 'Дача', 'Дом'];
  const brands = ['Tramp', 'Hiker', 'Палатки'];

  const handlePurposeChange = (purpose: string) => {
    if (selectedPurpose.includes(purpose)) {
      setSelectedPurpose(selectedPurpose.filter(p => p !== purpose));
    } else {
      setSelectedPurpose([...selectedPurpose, purpose]);
    }
  };

  const handleBrandChange = (brand: string) => {
    if (selectedBrand.includes(brand)) {
      setSelectedBrand(selectedBrand.filter(b => b !== brand));
    } else {
      setSelectedBrand([...selectedBrand, brand]);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setPriceRange([value, priceRange[1]]);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setPriceRange([priceRange[0], value]);
  };

  const resetFilters = () => {
    setSelectedPurpose([]);
    setSelectedBrand([]);
    setPriceRange([0, 10000]);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Фильтры</h2>

      {/* Назначение */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Назначение</h3>
        {purposes.map(purpose => (
          <div key={purpose} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={`purpose-${purpose}`}
              checked={selectedPurpose.includes(purpose)}
              onChange={() => handlePurposeChange(purpose)}
              className="mr-2"
            />
            <label htmlFor={`purpose-${purpose}`}>{purpose}</label>
          </div>
        ))}
      </div>

      {/* Бренд */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Бренд</h3>
        {brands.map(brand => (
          <div key={brand} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={`brand-${brand}`}
              checked={selectedBrand.includes(brand)}
              onChange={() => handleBrandChange(brand)}
              className="mr-2"
            />
            <label htmlFor={`brand-${brand}`}>{brand}</label>
          </div>
        ))}
      </div>

      {/* Цена */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Цена, ₽</h3>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
            className="border rounded px-2 py-1 w-20"
          />
          <span>-</span>
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="border rounded px-2 py-1 w-20"
          />
        </div>
      </div>

      <button
        onClick={resetFilters}
        className="w-full bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded"
      >
        Сбросить
      </button>
    </div>
  );
}