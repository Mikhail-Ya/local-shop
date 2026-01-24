// src/types/product.ts

export interface ProductFormData {
  id?: string;
  name: string;
  description: string | null;
  price: number; // используем number вместо Decimal
  stock: number;
  imageUrl: string[]; // массив URL, никогда не null (Prisma не позволяет String[]?)
  categoryId: string | null;
  brand: string | null;
  attributes: Record<string, any> | null;
}

export interface CategoryOption {
  id: string;
  name: string;
}