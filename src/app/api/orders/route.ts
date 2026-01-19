// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// src/app/api/orders/route.ts (добавьте этот метод в тот же файл)
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        deliveryZone: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Ошибка получения заказов:', error);
    return NextResponse.json({ error: 'Не удалось загрузить заказы' }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      phone,
      email,
      deliveryCityName, // передаём НАЗВАНИЕ города, а не ID!
      deliveryAddress,
      items, // [{ productId: string, quantity: number }]
    } = body;

    // Валидация
    if (!customerName || !phone || !email || !deliveryCityName || !items?.length) {
      return NextResponse.json({ error: 'Заполните все обязательные поля' }, { status: 400 });
    }

    // Находим зону по названию
    const deliveryZone = await prisma.deliveryZone.findUnique({
      where: { city_name: deliveryCityName },
    });

    if (!deliveryZone) {
      return NextResponse.json({ error: 'Доставка в этот город недоступна' }, { status: 400 });
    }

    // Рассчитываем общую сумму и проверяем товары
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { price: true, name: true },
      });

      if (!product) {
        return NextResponse.json({ error: `Товар не найден: ${item.productId}` }, { status: 400 });
      }

      const unitPrice = product.price;
      const quantity = item.quantity;
      totalAmount += unitPrice * quantity;

      orderItemsData.push({
        product_id: item.productId,
        quantity,
        unit_price: unitPrice,
      });
    }

    // Создаём заказ
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          customer_name: customerName,
          customer_phone: phone,
          customer_email: email,
          delivery_zone_id: deliveryZone.id,
          delivery_address: deliveryAddress || null,
          total_amount: totalAmount,
          status: 'new',
          delivery_estimated_date: new Date(Date.now() + deliveryZone.delivery_days_max * 24 * 60 * 60 * 1000),
        },
      });

      await tx.orderItem.createMany({
         orderItemsData.map((item) => ({
          ...item,
          order_id: newOrder.id,
        })),
      });

      return newOrder;
    });

    return NextResponse.json(
      { orderId: order.id, estimatedDate: order.delivery_estimated_date },
      { status: 201 }
    );
  } catch (error) {
    console.error('Ошибка создания заказа:', error);
    return NextResponse.json({ error: 'Не удалось создать заказ' }, { status: 500 });
  }
}