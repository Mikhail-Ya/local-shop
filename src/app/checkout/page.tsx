'use client';

import { useState } from 'react';
import CheckoutStep1 from '@/components/checkout/CheckoutStep1';
import CheckoutStep2 from '@/components/checkout/CheckoutStep2';
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState<'step1' | 'step2'>('step1');
  const [orderData, setOrderData] = useState({
    customerName: '',
    phone: '',
    email: '',
    deliveryCity: '',
    deliveryAddress: '',
  });

  const goToStep2 = (data: any) => {
    setOrderData(data);
    setCurrentStep('step2');
  };

  const submitOrder = async () => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: orderData.customerName,
          phone: orderData.phone,
          email: orderData.email,
          deliveryCity: orderData.deliveryCity,
          deliveryAddress: orderData.deliveryAddress,
          items: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            unitPrice: item.price,
          })),
          totalAmount: totalPrice,
        }),
      });

      if (response.ok) {
        clearCart();
        window.location.href = '/order-success'; // или router.push
      } else {
        alert('Ошибка при создании заказа');
      }
    } catch (err) {
      console.error(err);
      alert('Ошибка сети');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="section-title mb-6">
        <i className="fas fa-receipt"></i> Оформление заказа
      </h1>

      {/* Прогресс */}
      <div className="flex mb-8">
        <div className={`flex-1 ${currentStep === 'step1' ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">1</div>
          <div className="mt-2">Контакты и доставка</div>
        </div>
        <div className="w-12 h-0.5 bg-gray-300"></div>
        <div className={`flex-1 ${currentStep === 'step2' ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">2</div>
          <div className="mt-2">Подтверждение</div>
        </div>
      </div>

      {currentStep === 'step1' && <CheckoutStep1 onContinue={goToStep2} />}
      {currentStep === 'step2' && (
        <CheckoutStep2
          orderData={{ ...orderData, items, totalAmount: totalPrice }}
          onBack={() => setCurrentStep('step1')}
          onSubmit={submitOrder}
        />
      )}
    </div>
  );
}