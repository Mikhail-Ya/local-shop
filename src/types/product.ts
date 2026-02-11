// src/types/product.ts

export interface ProductFormData {
  id?: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  imageUrl: string[];
  categoryId: string | null;
  brand: string | null;
  attributes: Record<string, any> | null;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  imageUrl: string[];
  categoryId: string | null;
  brand: string | null;
  category: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryOption {
  id: string;
  name: string;
}