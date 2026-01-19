// src/app/order-success/page.tsx

import Link from 'next/link';

export default function OrderSuccessPage() {
  return (
    <div className="container mx-auto py-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Заказ успешно оформлен!</h1>
      <p className="mb-6">Ваш заказ #4567 находится в обработке.</p>
      <Link href="/" className="text-blue-600 hover:underline">Вернуться на главную</Link>
    </div>
  );
}