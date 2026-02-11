// src/app/api/admin/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: { email: true, full_name: true },
        },
        deliveryZone: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Форматируем данные для таблицы
    const formattedOrders = orders.map(order => ({
      id: order.id,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerEmail: order.customerEmail,
      deliveryZone: order.deliveryZone
        ? { name: order.deliveryZone.name }
        : null,
      deliveryAddress: order.deliveryAddress,
      pickupPoint: order.pickupPoint,
      totalAmount: Number(order.totalAmount),
      status: order.status,
      createdAt: order.createdAt.toISOString(),
    }));

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error('Ошибка при получении заказов:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}