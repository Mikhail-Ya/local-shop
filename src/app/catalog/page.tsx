// src/app/catalog/page.tsx
'use client';

import { useState } from 'react';
import CatalogFilters from '@/components/catalog/CatalogFilters';
import ProductList from '@/components/catalog/ProductList';

export default function CatalogPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  return (
    <section className="catalog-page">
      <div className="container mx-auto py-8">
        <h1 className="section-title">
          <i className="fas fa-th-large"></i> Каталог товаров
        </h1>
        <div className="flex flex-col lg:flex-row gap-8 mt-6">
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
    </section>
  );
}