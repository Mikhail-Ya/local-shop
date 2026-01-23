// src/app/api/categories/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { id: true }, // только корневые
      include: {
        name: true,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Ошибка получения категорий:', error);
    return NextResponse.json({ error: 'Не удалось загрузить категории' }, { status: 500 });
  }
}