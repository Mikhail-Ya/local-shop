// src/app/api/delivery-zones/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const zones = await prisma.deliveryZone.findMany({
      where: { isActive: true }, // ✅ camelCase, как в схеме
      orderBy: { name: 'asc' }, // также: city_name → name
    });
    return NextResponse.json(zones);
  } catch (error) {
    console.error('Ошибка получения зон доставки:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}