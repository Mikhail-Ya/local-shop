// src/app/profile/page.tsx
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

const USER_SESSION_COOKIE_NAME = 'user_session';

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(USER_SESSION_COOKIE_NAME);
  const userId = sessionCookie?.value;

  if (!userId) {
    redirect('/login');
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: userId,
    },
    include: {
      items: { include: { product: true } },
      deliveryZone: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Мои заказы</h1>
      {orders.length === 0 ? (
        <p>У вас пока нет заказов.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border p-4 rounded">
              <p>
                <strong>Дата:</strong> {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Статус:</strong> {order.status}
              </p>
              <p>
                <strong>Сумма:</strong> {Number(order.totalAmount)} ₽
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
