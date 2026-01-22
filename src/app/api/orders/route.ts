
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

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
}

// 1. Схема валидации входящих данных с помощью Zod
/*const orderSchema = z.object({
  customerName: z.string().min(2, 'Имя слишком короткое'),
  customerPhone: z.string().min(5, 'Некорректный номер телефона'),
  customerEmail: z.string().email().optional().or(z.literal('')),
  deliveryZoneId: z.string().optional(),
  pickupPoint: z.boolean(),
  deliveryAddress: z.string().optional(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
  })),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = orderSchema.parse(body)
    // Проверка товара на наличие и расчет остатков 
    const productIds = validatedData.items.map(item => item.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    })

    let totalAmount = 0
    const itemsWithPrice = validatedData.items.map(item => {
      const product = products.find(p => p.id === item.productId)
      if (!product) {
        throw new Error(`Товар с ID ${item.productId} не найден`)
      }
      if (product.stock < item.quantity) {
        throw new Error(`Недостаточно товара "${product.name}" на складе`)
      }
      const itemTotal = product.price.times(item.quantity)
      totalAmount += itemTotal.toNumber()
      return { ...item, price: product.price }
    })

    // 2. Получение стоимости доставки (если не самовывоз)
    let deliveryFee = 0
    if (!validatedData.pickupPoint && validatedData.deliveryZoneId) {
      const zone = await prisma.deliveryZone.findUnique({
        where: { id: validatedData.deliveryZoneId },
      })
      deliveryFee = zone?.deliveryFee?.toNumber() || 0
      totalAmount += deliveryFee
    }

    // 3. Атомарная транзакция: создание заказа и обновление остатков
    const order = await prisma.$transaction(async (tx) => {
      // Создание заказа
      const newOrder = await tx.order.create({
        data: {
          customerName: validatedData.customerName,
          customerPhone: validatedData.customerPhone,
          customerEmail: validatedData.customerEmail || null,
          deliveryZoneId: validatedData.deliveryZoneId || null,
          pickupPoint: validatedData.pickupPoint,
          deliveryAddress: validatedData.deliveryAddress || null,
          totalAmount,
          status: 'PENDING',
          items: {
            create: itemsWithPrice.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      })

      // Обновление остатков для каждого товара
      for (const item of validatedData.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      }

      return newOrder
    })

    return NextResponse.json(
      { success: true, orderId: order.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Order creation error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ошибка валидации', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Ошибка создания заказа' },
      { status: 500 }
    )
  }
}*/