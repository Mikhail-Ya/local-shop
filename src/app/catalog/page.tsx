// src/app/catalog/page.tsx
'use client';

import { useState } from 'react';
import CatalogFilters from '@/components/catalog/CatalogFilters';
import ProductList from '@/components/catalog/ProductList';

export default function CatalogPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Каталог товаров</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <CatalogFilters
            selectedCategoryId={selectedCategoryId}
            selectedBrand={selectedBrand}
            onCategoryChange={setSelectedCategoryId}
            onBrandChange={setSelectedBrand}
          />
        </div>
        <div className="lg:w-3/4">
          <ProductList categoryId={selectedCategoryId} brand={selectedBrand} />
        </div>
      </div>
    </div>
  );
}