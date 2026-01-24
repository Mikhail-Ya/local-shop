// src/app/admin-vkr-2026-secret/login/page.tsx
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import LoginForm from './LoginForm';

export default function AdminLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Suspense fallback={<div>Загрузка формы...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}