// src/components/ui/Navbar.tsx

'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Логотип */}
        <Link href="/" className="text-xl font-bold">ЛОГО</Link>

        {/* Меню для десктопа */}
        <div className="hidden md:flex space-x-6">
          <Link href="/">Гл</Link>
          <Link href="/catalog">Кат</Link>
          <Link href="/about">О нас</Link>
          <Link href="/delivery">Дост</Link>
        </div>

        {/* Иконки */}
        <div className="flex items-center space-x-4">
          <button aria-label="Поиск"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></button>
          <button aria-label="Избранное"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.682l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></button>
          <button aria-label="Корзина"><span className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10v8a2 2 0 002 2H5a2 2 0 002-2v-8m7-7a2 2 0 002-2V3a2 2 0 00-2-2H9M9 17h6M9 17v-6h6v6" /></svg>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">3</span>
          </span></button>
        </div>

        {/* Меню для мобильных устройств */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Меню"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Мобильное меню */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-gray-700">
          <Link href="/" className="block px-4 py-2">Гл</Link>
          <Link href="/categories" className="block px-4 py-2">Кат</Link>
          <Link href="/about" className="block px-4 py-2">О нас</Link>
          <Link href="/delivery" className="block px-4 py-2">Дост</Link>
        </div>
      )}
    </nav>
  );
}