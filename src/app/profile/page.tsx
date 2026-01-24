// src/app/profile/page.tsx
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export default async function ProfilePage() {
  // 🔥 cookies() — это Promise, нужно await
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('admin_session');
  const session = sessionCookie?.value;

  if (session !== 'authenticated') {
    redirect('/login');
  }

  const orders = await prisma.order.findMany({
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
          {orders.map(order => (
            <div key={order.id} className="border p-4 rounded">
              <p><strong>Дата:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Статус:</strong> {order.status}</p>
              <p><strong>Сумма:</strong> {Number(order.totalAmount)} ₽</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}