// src/app/api/brands/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Получаем уникальные бренды, исключая null и пустые строки
    const brands = await prisma.product.findMany({
      where: {
        brand: { not: null },
        stock: { gt: 0 },
      },
      select: {
        brand: true,
      },
      distinct: ['brand'],
    });

    // Преобразуем в плоский массив строк
    const brandList = brands
      .map(b => b.brand)
      .filter(brand => brand && brand.trim() !== '')
      .sort();

    return NextResponse.json(brandList);
  } catch (error) {
    console.error('Ошибка при получении брендов:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}