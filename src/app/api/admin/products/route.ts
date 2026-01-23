// src/app/api/admin/products/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Возвращаем массив — именно то, что ожидает фронтенд
    return NextResponse.json(products);
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

