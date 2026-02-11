
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { parse } from 'cookie';

const USER_SESSION_COOKIE_NAME = 'user_session';

export async function GET(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie');
  const cookies = cookieHeader ? parse(cookieHeader) : {};
  const userId = cookies[USER_SESSION_COOKIE_NAME];

  try {
    // Если пользователь авторизован, возвращаем только его заказы
    if (userId) {
      const orders = await prisma.order.findMany({
        where: { userId },
        include: {
          deliveryZone: true,
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json(orders);
    }

    // Если не авторизован, возвращаем ошибку
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  } catch (error) {
    console.error('Ошибка получения заказов:', error);
    return NextResponse.json({ error: 'Не удалось загрузить заказы' }, { status: 500 });
  }
}

/*
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, phone, email, deliveryCity, deliveryAddress, items, totalAmount } = body;

    // Валидация
    if (!customerName || !phone || !email || !deliveryCity || !items?.length) {
      return NextResponse.json({ error: 'Все обязательные поля должны быть заполнены' }, { status: 400 });
    }

    // Найти зону доставки
    const zone = await prisma.deliveryZone.findUnique({
      where: { city_name: deliveryCity, is_active: true },
    });

    if (!zone) {
      return NextResponse.json({ error: 'Доставка в этот город недоступна' }, { status: 400 });
    }

    // Рассчитать дату доставки
    const today = new Date();
    const estimatedDate = new Date(today);
    estimatedDate.setDate(today.getDate() + zone.delivery_days_max);

    // Создать заказ в транзакции
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          customer_name: customerName,
          customer_phone: phone,
          customer_email: email,
          delivery_zone_id: zone.id,
          delivery_address: deliveryAddress || null,
          delivery_estimated_date: estimatedDate,
          total_amount: totalAmount,
          status: 'new',
        },
      });

      await Promise.all(
        items.map((item: any) =>
          tx.orderItem.create({
            data: {
              order_id: newOrder.id,
              product_id: item.productId,
              quantity: item.quantity,
              unit_price: item.unitPrice,
            },
          })
        )
      );

      return newOrder;
    });

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error('Ошибка создания заказа:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}*/

// Схема валидации входящих данных для создания заказа
const orderSchema = z.object({
  customerName: z.string().min(2, 'Имя слишком короткое'),
  phone: z.string().min(5, 'Некорректный номер телефона'),
  email: z.string().email().optional().or(z.literal('')),
  deliveryCity: z.string().optional(),
  deliveryAddress: z.string().optional(),
  isPickup: z.boolean().optional(),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.coerce.number().int().positive(),
      unitPrice: z.coerce.number(),
    })
  ),
  totalAmount: z.coerce.number().positive(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = orderSchema.parse(body);

    // Получаем userId из куки, если пользователь авторизован
    const cookieHeader = request.headers.get('cookie');
    const cookies = cookieHeader ? parse(cookieHeader) : {};
    const userId = cookies[USER_SESSION_COOKIE_NAME];

    // Проверка товара на наличие и расчет остатков 
    const productIds = validatedData.items.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    // Проверяем наличие товаров
    for (const item of validatedData.items) {
      const product = products.find(p => p.id === item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Товар с ID ${item.productId} не найден` },
          { status: 400 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Недостаточно товара "${product.name}" на складе` },
          { status: 400 }
        );
      }
    }

    // Найти зону доставки по названию города, если указан и не самовывоз
    let deliveryZoneId: string | null = null;
    const isPickup = validatedData.isPickup || false;

    if ( validatedData.deliveryCity) {
      // Ищем зону доставки по названию
      const deliveryZone = await prisma.deliveryZone.findFirst({
        where: {
          name: validatedData.deliveryCity,
          isActive: true,
        },
      });

      if (!deliveryZone) {
        return NextResponse.json(
          { error: `Доставка в город "${validatedData.deliveryCity}" недоступна` },
          { status: 400 }
        );
      }

      deliveryZoneId = deliveryZone.id;
    }

    // Атомарная транзакция: создание заказа и обновление остатков
    const order = await prisma.$transaction(async (tx) => {
      // Создание заказа
      const newOrder = await tx.order.create({
        data: {
          userId: userId || null, // Привязываем к пользователю, если авторизован
          customerName: validatedData.customerName,
          customerPhone: validatedData.phone,
          customerEmail: validatedData.email || null,
          deliveryZoneId: deliveryZoneId,
          deliveryAddress: validatedData.deliveryAddress || null,
          pickupPoint: isPickup,
          totalAmount: validatedData.totalAmount,
          status: 'PENDING',
          items: {
            create: validatedData.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.unitPrice,
            })),
          },
        },
      });

      // Обновление остатков для каждого товара
      for (const item of validatedData.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return newOrder;
    });

    return NextResponse.json(
      { success: true, orderId: order.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Order creation error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ошибка валидации', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Ошибка создания заказа' },
      { status: 500 }
    );
  }
}