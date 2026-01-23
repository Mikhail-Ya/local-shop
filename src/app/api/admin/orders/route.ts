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
      date: order.createdAt.toLocaleDateString('ru-RU'),
      client: order.customerName || order.user?.full_name || order.customerEmail || 'Гость',
      city: order.deliveryZone?.name || '—',
      amount: Number(order.totalAmount),
      status: order.status,
    }));

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error('Ошибка при получении заказов:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}