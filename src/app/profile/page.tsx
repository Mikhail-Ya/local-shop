// src/app/profile/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Проверяем cookie при загрузке
    const isAdminCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('is_admin='))?.split('=')[1] === 'true';
    setIsAdmin(isAdminCookie || false);
  }, []);

  const handleAdminLogin = async () => {
    const res = await fetch('/api/auth/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', token }),
    });

    if (res.ok) {
      setIsAdmin(true);
      alert('Вы вошли как администратор');
    } else {
      alert('Неверный токен');
    }
  };

  const handleAdminLogout = async () => {
    await fetch('/api/auth/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    setIsAdmin(false);
    alert('Вы вышли из админки');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Личный кабинет</h1>

      {!isAdmin ? (
        <div className="bg-white p-6 rounded-lg shadow max-w-md">
          <h2 className="text-xl font-semibold mb-4">Войти в админку</h2>
          <p className="mb-4 text-gray-600">
            Для управления товарами и заказами введите секретный ключ.
          </p>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Секретный ключ"
            className="w-full p-2 border rounded mb-4"
          />
          <button
            onClick={handleAdminLogin}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Войти
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow max-w-md">
          <h2 className="text-xl font-semibold mb-4">Режим администратора</h2>
          <p className="mb-4 text-green-600">✅ Вы вошли как администратор</p>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/admin')}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Перейти в админку
            </button>
            <button
              onClick={handleAdminLogout}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Выйти
            </button>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">История заказов</h2>
        <p className="text-gray-600">Здесь будет список ваших заказов (после реализации авторизации).</p>
      </div>
    </div>
  );
}