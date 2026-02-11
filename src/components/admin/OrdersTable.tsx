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
  deliveryAddress: string | null;
  pickupPoint: boolean;
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
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
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

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // Обновляем локальный статус
        setOrders(prev =>
          prev.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        const error = await res.json();
        alert(error.error || 'Ошибка при обновлении статуса');
      }
    } catch (error) {
      console.error(error);
      alert('Ошибка сети');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот заказ?')) {
      return;
    }

    setDeletingOrder(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // Удаляем заказ из локального списка
        setOrders(prev => prev.filter(order => order.id !== orderId));
      } else {
        const error = await res.json();
        alert(error.error || 'Ошибка при удалении заказа');
      }
    } catch (error) {
      console.error(error);
      alert('Ошибка сети');
    } finally {
      setDeletingOrder(null);
    }
  };

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
      <div className="grid grid-cols-3 gap-4">
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
        <table className="min-w-full border-collapse table-orders">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-centr">#</th>
              <th className="border p-2 text-centr">Дата</th>
              <th className="border p-2 text-centr">Клиент</th>
              <th className="border p-2 text-centr">Город</th>
              <th className="border p-2 text-centr">Адресс</th>
              <th className="border p-2 text-centr">Сумма</th>
              <th className="border p-2 text-centr">Статус</th>
              <th className="border p-2 text-centr">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="border p-2 text-centr">{order.id}</td>
                  <td className="border p-2 text-centr">
                    {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="border p-2 text-centr">
                    <div>{order.customerName}</div>
                    <div className="text-xs text-gray-500">{order.customerPhone}</div>
                  </td>
                  <td className="border p-2 text-centr">
                    { order.deliveryZone?.name || 'Не указан'}
                  </td>
                  <td className="border p-2 text-centr">{order.deliveryAddress || 'Самовывоз'}</td>
                  <td className="border p-2 text-centr">{order.totalAmount} ₽</td>
                  <td className="border p-2 text-centr">
                    {updatingStatus === order.id ? (
                      <span className="text-sm text-gray-500">Обновление...</span>
                    ) : (
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`px-2 py-1 rounded text-xs border ${
                          order.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                            : order.status === 'PROCESSING'
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : order.status === 'SHIPPED'
                            ? 'bg-purple-100 text-purple-800 border-purple-300'
                            : order.status === 'DELIVERED'
                            ? 'bg-green-100 text-green-800 border-green-300'
                            : order.status === 'CANCELLED'
                            ? 'bg-red-100 text-red-800 border-red-300'
                            : 'bg-gray-100 text-gray-800 border-gray-300'
                        }`}
                      >
                        <option value="PENDING">Новый</option>
                        <option value="PROCESSING">В обработке</option>
                        <option value="SHIPPED">Отправлен</option>
                        <option value="DELIVERED">Доставлен</option>
                        <option value="CANCELLED">Отменён</option>
                      </select>
                    )}
                  </td>
                  <td className="border p-2 text-centr">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                        title="Просмотр"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        disabled={deletingOrder === order.id}
                        className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                        title="Удалить"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="border p-4 text-center">Заказы не найдены</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Модальное окно просмотра деталей заказа */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Детали заказа #{selectedOrder.id}</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Дата:</label>
                  <p className="mt-1">
                    {new Date(selectedOrder.createdAt).toLocaleString('ru-RU')}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Статус:</label>
                  <p className="mt-1">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        selectedOrder.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : selectedOrder.status === 'DELIVERED'
                          ? 'bg-green-100 text-green-800'
                          : selectedOrder.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {STATUS_LABELS[selectedOrder.status] || selectedOrder.status}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Имя клиента:</label>
                  <p className="mt-1">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Телефон:</label>
                  <p className="mt-1">{selectedOrder.customerPhone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email:</label>
                  <p className="mt-1">{selectedOrder.customerEmail || '—'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Способ доставки:</label>
                  <p className="mt-1">
                    {selectedOrder.pickupPoint
                      ? 'Самовывоз'
                      : selectedOrder.deliveryZone?.name || 'Не указан'}
                  </p>
                </div>
                {selectedOrder.deliveryAddress && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Адрес доставки:</label>
                    <p className="mt-1">{selectedOrder.deliveryAddress}</p>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Сумма заказа:</h3>
                <p className="text-2xl font-bold text-green-600">
                  {selectedOrder.totalAmount} ₽
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}