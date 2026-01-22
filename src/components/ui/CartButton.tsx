// src/components/ui/CartButton.tsx
'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartButton() {
  const { totalItems } = useCart();

  return (
    <Link href="/cart" className="relative">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10v8a2 2 0 002 2H5a2 2 0 002-2v-8m7-7a2 2 0 002-2V3a2 2 0 00-2-2H9M9 17h6M9 17v-6h6v6" />
      </svg>
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
          {totalItems}
        </span>
      )}
    </Link>
  );
}