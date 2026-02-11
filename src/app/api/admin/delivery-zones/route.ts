// src/app/api/admin/delivery-zones/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - получить все зоны доставки
export async function GET() {
  try {
    const zones = await prisma.deliveryZone.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(zones);
  } catch (error) {
    console.error('Ошибка загрузки зон доставки:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// POST - создать новую зону доставки
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, deliveryFee, isActive } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Название города обязательно' }, { status: 400 });
    }

    if (deliveryFee === undefined || deliveryFee < 0) {
      return NextResponse.json({ error: 'Стоимость доставки должна быть неотрицательной' }, { status: 400 });
    }

    const zone = await prisma.deliveryZone.create({
      data: {
        name: name.trim(),
        code: name.trim().toLowerCase().replace(/\s+/g, '-'),
        deliveryFee: Number(deliveryFee),
        isActive: isActive ?? true,
      },
    });


    return NextResponse.json(zone, { status: 201 });
  } catch (error: any) {
    console.error('Ошибка создания зоны доставки:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Зона доставки с таким названием уже существует' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}