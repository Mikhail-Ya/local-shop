// src/app/profile/page.tsx
'use client';

import { useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  pickupPoint: boolean;
  deliveryZone: {
    name: string;
  } | null;
  deliveryAddress: string | null;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      imageUrl: string[];
    };
  }[];
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Новый',
  PROCESSING: 'В обработке',
  SHIPPED: 'Отправлен',
  DELIVERED: 'Доставлен',
  CANCELLED: 'Отменён',
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    full_name: '',
    phone: '',
    email: '',
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Загружаем данные пользователя
      const userRes = await fetch('/api/auth/me');
      const userData = await userRes.json();

      if (!userData.user) {
        window.location.href = '/login';
        return;
      }

      setUser(userData.user);
      setEditData({
        full_name: userData.user.full_name || '',
        phone: userData.user.phone || '',
        email: userData.user.email || '',
      });

      // Загружаем заказы пользователя
      const ordersRes = await fetch('/api/orders');
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        setEditing(false);
        alert('Данные успешно обновлены');
      } else {
        const error = await res.json();
        alert(error.error || 'Ошибка обновления данных');
      }
    } catch (error) {
      console.error(error);
      alert('Ошибка сети');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Загрузка...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Личный кабинет</h1>

      {/* Информация о пользователе */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Мои данные</h2>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Редактировать
            </button>
          ) : (
            <div className="space-x-2">
              <button
                onClick={() => {
                  setEditing(false);
                  setEditData({
                    full_name: user.full_name || '',
                    phone: user.phone || '',
                    email: user.email || '',
                  });
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Отмена
              </button>
              <button
                onClick={handleSaveProfile}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Сохранить
              </button>
            </div>
          )}
        </div>

        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">ФИО</label>
              <input
                type="text"
                value={editData.full_name}
                onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Телефон</label>
              <input
                type="text"
                value={editData.phone}
                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p>
              <span className="font-medium">ФИО:</span> {user.full_name || 'Не указано'}
            </p>
            <p>
              <span className="font-medium">Телефон:</span> {user.phone || 'Не указан'}
            </p>
            <p>
              <span className="font-medium">Email:</span> {user.email}
            </p>
          </div>
        )}
      </div>

      {/* История заказов */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">История заказов</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500">У вас пока нет заказов</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleString('ru-RU')}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          order.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.status === 'PROCESSING'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'SHIPPED'
                            ? 'bg-purple-100 text-purple-800'
                            : order.status === 'DELIVERED'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'CANCELLED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </div>

                    <div className="mb-2">
                      {order.pickupPoint ? (
                        <span className="text-green-600 font-medium">
                          <i className="fas fa-hand-paper mr-1"></i>Самовывоз
                        </span>
                      ) : (
                        <span>
                          {order.deliveryZone?.name || 'Не указан'}
                          {order.deliveryAddress && `: ${order.deliveryAddress}`}
                        </span>
                      )}
                    </div>

                    <p className="text-lg font-bold text-green-600">
                      {Number(order.totalAmount)} ₽
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Подробно
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Модальное окно деталей заказа */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Заказ #{selectedOrder.id}</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <span className="text-gray-500">Дата:</span>{' '}
                {new Date(selectedOrder.createdAt).toLocaleString('ru-RU')}
              </div>
              <div>
                <span className="text-gray-500">Статус:</span>{' '}
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
              </div>
              <div>
                <span className="text-gray-500">Способ доставки:</span>{' '}
                {selectedOrder.pickupPoint ? (
                  <span className="text-green-600 font-medium">Самовывоз</span>
                ) : (
                  selectedOrder.deliveryZone?.name || 'Не указан'
                )}
              </div>
              {selectedOrder.deliveryAddress && (
                <div>
                  <span className="text-gray-500">Адрес:</span> {selectedOrder.deliveryAddress}
                </div>
              )}
            </div>

            <h3 className="font-semibold mb-3">Товары в заказе</h3>
            <div className="space-y-3 mb-6">
              {selectedOrder.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 border-b pb-3">
                  {item.product.imageUrl && item.product.imageUrl.length > 0 && (
                    <img
                      src={item.product.imageUrl[0]}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} шт × {Number(item.price)} ₽
                    </p>
                  </div>
                  <p className="font-bold">
                    {Number(item.price) * item.quantity} ₽
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Итого:</span>
                <span className="text-2xl font-bold text-green-600">
                  {Number(selectedOrder.totalAmount)} ₽
                </span>
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
