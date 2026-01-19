// src/app/api/delivery-zones/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const zones = await prisma.deliveryZone.findMany({
      where: { is_active: true },
      orderBy: { city_name: 'asc' },
    });
    return NextResponse.json(zones);
  } catch (error) {
    console.error('Ошибка получения зон доставки:', error);
    return NextResponse.json({ error: 'Не удалось загрузить города' }, { status: 500 });
  }
}