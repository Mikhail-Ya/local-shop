// src/app/admin/products/[id]/edit/page.tsx
import ProductForm from '@/components/admin/ProductForm';
import { prisma } from '@/lib/prisma';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });
  const categories = await prisma.category.findMany();

  if (!product) {
    return <div>Товар не найден</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Редактировать товар</h1>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}