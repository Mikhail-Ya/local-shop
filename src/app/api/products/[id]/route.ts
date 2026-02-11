// src/app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
   { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('Получен ID товара:', id);

    if (!id) {
      return NextResponse.json({ error: 'ID товара не указан' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
    console.log('Найден товар:', product);

    if (!product) {
      return NextResponse.json({ error: 'Товар не найден' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Ошибка при получении товара:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}