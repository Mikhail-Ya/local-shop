// src/components/admin/OrdersTable.tsx

'use client';

import { useState, useEffect } from 'react';

interface Order {
  id: string;
  date: string;
  client: string;
  city: string;
  amount: number;
  status: string;
}

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    city: 'all',
    periodStart: '',
    periodEnd: '',
  });

  // Имитация загрузки данных
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000)); // имитация задержки
      setOrders([
        { id: '4567', date: '20.01', client: 'Иванов И.И.', city: 'Осташков', amount: 12480, status: 'Новый' },
        { id: '4566', date: '20.01', client: 'Петров П.П.', city: 'Пено', amount: 5200, status: 'Выполнен' },
      ]);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filters.status === 'all' || order.status === filters.status;
    const matchesCity = filters.city === 'all' || order.city === filters.city;
    // Фильтрация по периоду можно реализовать аналогично
    return matchesStatus && matchesCity;
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex items-center">
          <label className="mr-2">Фильтры:</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="border rounded px-2 py-1"
          >
            <option value="all">Все статусы</option>
            <option value="Новый">Новый</option>
            <option value="Выполнен">Выполнен</option>
          </select>
        </div>
        <div className="flex items-center">
          <select
            value={filters.city}
            onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
            className="border rounded px-2 py-1"
          >
            <option value="all">Все города</option>
            <option value="Осташков">Осташков</option>
            <option value="Селижарово">Селижарово</option>
            <option value="Пено">Пено</option>
          </select>
        </div>
        <div className="flex items-center">
          <label className="mr-2">Период:</label>
          <input
            type="date"
            value={filters.periodStart}
            onChange={(e) => setFilters(prev => ({ ...prev, periodStart: e.target.value }))}
            className="border rounded px-2 py-1 mr-2"
          />
          <span>по</span>
          <input
            type="date"
            value={filters.periodEnd}
            onChange={(e) => setFilters(prev => ({ ...prev, periodEnd: e.target.value }))}
            className="border rounded px-2 py-1 ml-2"
          />
        </div>
        <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
          Поиск
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">№</th>
              <th className="border p-2 text-left">Дата</th>
              <th className="border p-2 text-left">Клиент</th>
              <th className="border p-2 text-left">Город</th>
              <th className="border p-2 text-left">Сумма</th>
              <th className="border p-2 text-left">Статус</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="border p-2">{order.id}</td>
                <td className="border p-2">{order.date}</td>
                <td className="border p-2">{order.client}</td>
                <td className="border p-2">{order.city}</td>
                <td className="border p-2">{order.amount} ₽</td>
                <td className="border p-2">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between">
        <div>
          <label className="mr-2">Действия с выбранным:</label>
          <button className="bg-gray-200 hover:bg-gray-300 py-1 px-2 rounded mr-2">Сменить статус</button>
          <button className="bg-gray-200 hover:bg-gray-300 py-1 px-2 rounded mr-2">Печать</button>
          <button className="bg-gray-200 hover:bg-gray-300 py-1 px-2 rounded">Экспорт</button>
        </div>
      </div>
    </div>
  );
}