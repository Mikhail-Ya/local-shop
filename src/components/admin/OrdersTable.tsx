// src/components/admin/OrdersTable.tsx
'use client';

import { useEffect, useState } from 'react';

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  deliveryZone: {
    name: string;
  } | null;
  totalAmount: number;
  status: string;
  createdAt: string;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Новый',
  PROCESSING: 'В обработке',
  SHIPPED: 'Отправлен',
  DELIVERED: 'Доставлен',
  CANCELLED: 'Отменён',
};

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    city: 'all',
  });

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/orders');
        if (!res.ok) throw new Error('Ошибка загрузки');
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filters.status === 'all' || order.status === filters.status;
    const matchesCity =
      filters.city === 'all' ||
      (order.deliveryZone?.name === filters.city);
    return matchesStatus && matchesCity;
  });

  if (loading) return <div>Загрузка заказов...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="mr-2">Статус:</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="border rounded px-2 py-1"
          >
            <option value="all">Все</option>
            <option value="PENDING">Новые</option>
            <option value="PROCESSING">В обработке</option>
            <option value="SHIPPED">Отправлены</option>
            <option value="DELIVERED">Доставлены</option>
            <option value="CANCELLED">Отменены</option>
          </select>
        </div>
        <div>
          <label className="mr-2">Город:</label>
          <select
            value={filters.city}
            onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
            className="border rounded px-2 py-1"
          >
            <option value="all">Все</option>
            <option value="Осташков">Осташков</option>
            <option value="Селижарово">Селижарово</option>
            <option value="Пено">Пено</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">#</th>
              <th className="border p-2 text-left">Дата</th>
              <th className="border p-2 text-left">Клиент</th>
              <th className="border p-2 text-left">Город</th>
              <th className="border p-2 text-left">Сумма</th>
              <th className="border p-2 text-left">Статус</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="border p-2">{order.id}</td>
                  <td className="border p-2">
                    {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="border p-2">
                    <div>{order.customerName}</div>
                    <div className="text-xs text-gray-500">{order.customerPhone}</div>
                  </td>
                  <td className="border p-2">
                    {order.deliveryZone?.name || 'Самовывоз'}
                  </td>
                  <td className="border p-2">{order.totalAmount} ₽</td>
                  <td className="border p-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        order.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === 'DELIVERED'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="border p-4 text-center">Заказы не найдены</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}