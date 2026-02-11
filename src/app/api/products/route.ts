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

    // Исправленная логика фильтрации цен
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) {
        const min = parseFloat(minPrice);
        if (!isNaN(min)) where.price.gte = min;
      }
      if (maxPrice) {
        const max = parseFloat(maxPrice);
        if (!isNaN(max)) where.price.lte = max;
      }
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Ошибка при получении товаров:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}