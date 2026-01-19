// src/app/checkout/page.tsx

'use client';

import { useState } from 'react';
import CheckoutStep1 from '@/components/checkout/CheckoutStep1';
import CheckoutStep2 from '@/components/checkout/CheckoutStep2';

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState<'step1' | 'step2'>('step1');
  const [orderData, setOrderData] = useState({
    customerName: '',
    phone: '',
    email: '',
    deliveryCity: '',
    deliveryAddress: '',
    items: [],
    totalAmount: 0,
  });

  const goToStep2 = (data: any) => {
    setOrderData(prev => ({ ...prev, ...data }));
    setCurrentStep('step2');
  };

  const goToStep1 = () => {
    setCurrentStep('step1');
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Оформление заказа</h1>

      {/* Прогресс-бар */}
      <div className="flex items-center mb-8">
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

      {currentStep === 'step1' && (
        <CheckoutStep1 onContinue={goToStep2} />
      )}

      {currentStep === 'step2' && (
        <CheckoutStep2 orderData={orderData} onBack={goToStep1} />
      )}
    </div>
  );
}