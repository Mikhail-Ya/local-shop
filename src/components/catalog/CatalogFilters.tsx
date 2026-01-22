
'use client';

import { useEffect, useState } from 'react';

interface FilterData {
  categories: { id: string; name: string; slug: string }[];
  brands: string[];
}

export default function CatalogFilters() {
  const [filters, setFilters] = useState<FilterData | null>(null);

  useEffect(() => {
    fetch('/api/categories/filters')
      .then(res => res.json())
      .then(data => setFilters(data));
  }, []);

  if (!filters) {
    return <div>Загрузка фильтров... </div>;
  }



  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [products, setProducts] = useState([]);
  const selectedCategoriesArray = Array.from(selectedCategories);

  useEffect(() => {
    const fetchProducts = async () => {
      const params = new URLSearchParams();
      selectedCategoriesArray.forEach(slug => {
        params.append('category', slug);
      });

      const url = `/api/products?${params.toString()}`;

      const res = await fetch(url);
      const data = await res.json();
      setProducts(data);
    };

    fetchProducts();
  }, [selectedCategoriesArray]);


  return (
    <div>
      {/* Категории */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Категории</h3>
        {filters.categories.map(cat => (
          <div key={cat.id} className="flex items-center mb-1">
            <input type="checkbox" id={`cat-${cat.slug}`}
              onChange={}
             />
            <label htmlFor={`cat-${cat.slug}`} className="ml-2">{cat.name}</label>
          </div>
        ))}
      </div>

      {/* Бренды */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Бренды</h3>
        {filters.brands.map(brand => (
          <div key={brand} className="flex items-center mb-1">
            <input type="checkbox" id={`brand-${brand}`} />
            <label htmlFor={`brand-${brand}`} className="ml-2">{brand}</label>
          </div>
        ))}
      </div>
    </div>
  );
}