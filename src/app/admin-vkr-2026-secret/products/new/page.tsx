// src/app/admin/products/new/page.tsx

import { prisma } from '@/lib/prisma';
import ProductForm from '@/components/admin/ProductForm';
import { CategoryOption } from '@/types/product';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const categories = await prisma.category.findMany();

  const categoryOptions: CategoryOption[] = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
  }));

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Добавить новый товар</h1>
      <ProductForm categories={categoryOptions} />
    </div>
  );
}