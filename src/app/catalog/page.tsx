// src/app/catalog/page.tsx

import CatalogFilters from '@/components/catalog/CatalogFilters';
import ProductList from '@/components/catalog/ProductList';

export default function CatalogPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Каталог товаров</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Блок фильтров */}
        <div className="lg:w-1/4">
          <CatalogFilters />
        </div>
        {/* Блок товаров */}
        <div className="lg:w-3/4">
          <ProductList />
        </div>
      </div>
    </div>
  );
}