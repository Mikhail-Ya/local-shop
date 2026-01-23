import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 1. Получаем все категории
    const categories = await prisma.category.findMany({
      select:{ id: true, 
         name: true,
      },
    });

    // 2. Получаем все уникальные бренды из товаров
    const brandResults = await prisma.product.groupBy({
      by: ['brand'],
      where: {
        brand: {
          not: null
        }
  },
  orderBy: {
    brand: 'asc'
  }
});

const brands = brandResults
  .map(item => item.brand)
  .filter((brand): brand is string => typeof brand === 'string')||[];

    return NextResponse.json({ categories, brands });
  } catch (error) {
    console.error('Ошибка получения фильтров:', error);
    return NextResponse.json({ error: 'Не удалось загрузить фильтры' }, { status: 500 });
  }
}