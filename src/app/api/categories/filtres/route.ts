import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 1. Получаем все категории
    const categories = await prisma.category.findMany({
      select: { id: true, name: true, slug: true },
    });

    // 2. Получаем все уникальные бренды из товаров
    const productsWithBrands = await prisma.product.findMany({
      where: {
        attributes: { not: null },
        stock: { gt: 0 }, // только товары в наличии
      },
      select: {
        attributes: true,
      },
    });

    // Извлекаем бренды и делаем их уникальными
    const brands = Array.from(
      new Set(
        productsWithBrands
          .map(p => p.attributes?.brand)
          .filter(brand => typeof brand === 'string' && brand.trim() !== '')
      )
    ).sort();

    return NextResponse.json({ categories, brands });
  } catch (error) {
    console.error('Ошибка получения фильтров:', error);
    return NextResponse.json({ error: 'Не удалось загрузить фильтры' }, { status: 500 });
  }
}