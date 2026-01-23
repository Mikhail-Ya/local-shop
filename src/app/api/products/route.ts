import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const brand = searchParams.get('brand');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const where: any = {
      stock: { gt: 0 },
    };

    if (categoryId) where.categoryId = categoryId;
    if (brand) where.brand = brand;
    if (minPrice) where.price = { ...where.price, gte: parseFloat(minPrice) };
    if (maxPrice) where.price = { ...where.price, lte: parseFloat(maxPrice) };

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc", // ✅ Правильное имя поля
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Ошибка при получении товаров:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}