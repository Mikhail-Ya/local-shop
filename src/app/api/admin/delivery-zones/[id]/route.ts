// src/app/api/admin/delivery-zones/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - получить одну зону доставки
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const zone = await prisma.deliveryZone.findUnique({
      where: { id },
    });

    if (!zone) {
      return NextResponse.json({ error: 'Зона не найдена' }, { status: 404 });
    }

    return NextResponse.json(zone);
  } catch (error) {
    console.error('Ошибка получения зоны доставки:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// PUT - обновить зону доставки
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, deliveryFee, isActive } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Название города обязательно' }, { status: 400 });
    }

    if (deliveryFee === undefined || deliveryFee < 0) {
      return NextResponse.json({ error: 'Стоимость доставки должна быть неотрицательной' }, { status: 400 });
    }

    const zone = await prisma.deliveryZone.update({
      where: { id },
      data: {
        name: name.trim(),
        deliveryFee: Number(deliveryFee),
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(zone);
  } catch (error: any) {
    console.error('Ошибка обновления зоны доставки:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Зона доставки с таким названием уже существует' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// DELETE - удалить зону доставки
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.deliveryZone.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка удаления зоны доставки:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}