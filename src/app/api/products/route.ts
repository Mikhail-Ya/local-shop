// src/app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const where: any = { in_stock: true };

    if (categoryId) {
      where.category_id = categoryId;
    }

    if (minPrice) {
      where.price = { ...where.price, gte: parseFloat(minPrice) };
    }

    if (maxPrice) {
      where.price = { ...where.price, lte: parseFloat(maxPrice) };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Ошибка получения товаров:', error);
    return NextResponse.json({ error: 'Не удалось загрузить товары' }, { status: 500 });
  }
}