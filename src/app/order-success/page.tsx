// src/app/order-success/page.tsx

import Link from 'next/link';

export default function OrderSuccessPage() {
  return (
    <div className="container mx-auto py-8 text-center">
      <h1 className="section-title mb-4">
        <i className="fas fa-check-circle"></i> Заказ успешно оформлен!
      </h1>
      <p className="mb-6">Ваш заказ находится в обработке. Мы свяжемся с вами в ближайшее время.</p>
      <Link href="/" className="text-blue-600 hover:underline">
        Вернуться на главную
      </Link>
    </div>
  );
}