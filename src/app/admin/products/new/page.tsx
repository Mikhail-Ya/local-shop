// src/app/admin/products/new/page.tsx
import ProductForm from '@/components/admin/ProductForm';
import { prisma } from '@/lib/prisma';
import myStyle from './adminNew.module.css';

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Добавить новый товар</h1>
      <ProductForm categories={categories} />
    </div>
  );
}