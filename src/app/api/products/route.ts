// src/app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
/*
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    

    const where: any = {};

    if(where.cate){

    }

    if (where.stock > 0) {
        where.stock = { gt: 0 }; // "greater than 0"
    } 

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
}*/

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const categoryId = searchParams.get('categoryId')

  try {
    const products = await prisma.product.findMany({
      where: {
        ...(categoryId && { categoryId }),
        stock: { gt: 0 }, // Фильтрация товаров в наличии
      },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(products)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Ошибка при загрузке товаров' },
      { status: 500 }
    )
  }
}