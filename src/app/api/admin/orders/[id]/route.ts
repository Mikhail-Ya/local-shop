import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Схема валидации для обновления статуса
const updateOrderSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
});

// GET - получение деталей заказа
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        deliveryZone: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Ошибка получения заказа:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// PATCH - обновление статуса заказа
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateOrderSchema.parse(body);

    // Проверяем существование заказа
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 });
    }

    // Обновляем статус заказа
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: validatedData.status,
      },
      include: {
        deliveryZone: true,
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Ошибка обновления заказа:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ошибка валидации', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Ошибка обновления заказа' },
      { status: 500 }
    );
  }
}

// DELETE - удаление заказа (опционально)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Проверяем существование заказа
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 });
    }

    // Удаляем заказ (items удалятся каскадно)
    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Заказ удален' });
  } catch (error) {
    console.error('Ошибка удаления заказа:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Ошибка удаления заказа' },
      { status: 500 }
    );
  }
}
