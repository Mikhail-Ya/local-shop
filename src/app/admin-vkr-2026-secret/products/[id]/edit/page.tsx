// src/app/admin/products/[id]/edit/page.tsx
import { prisma } from '@/lib/prisma';
import ProductForm from '@/components/admin/ProductForm';
import { ProductFormData, CategoryOption } from '@/types/product';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    return <div>Товар не найден</div>;
  }

  const categories = await prisma.category.findMany();
  const categoryOptions: CategoryOption[] = categories.map(cat => ({
    id: cat.id,
    name: cat.name,
  }));

  const productForForm: ProductFormData = {
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    stock: product.stock,
    imageUrl: product.imageUrl, // string[]
    categoryId: product.categoryId,
    brand: product.brand,
    attributes: product.attributes as Record<string, any> | null,
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Редактировать товар</h1>
      <ProductForm product={productForForm} categories={categoryOptions} />
    </div>
  );
}