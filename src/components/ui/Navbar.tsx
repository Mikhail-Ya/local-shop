// src/components/ui/Navbar.tsx

'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="top-bar">
        <div className="container">
            <div className="top-bar-content">
                <div className="location">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>Доставка по городу и области</span>
                </div>
                <div className="top-links">
                    <Link href="/pages/about.html"><i className="fas fa-info-circle"></i> О компании</Link>
                    <Link href="/pages/delivery.html"><i className="fas fa-truck"></i> Доставка и оплата</Link>
                    <Link href="/pages/contacts.html"><i className="fas fa-phone"></i> Контакты</Link>
                </div>
            </div>
        </div>
      </div>
      <header className="header">
        <div className="container">
            <div className="header-main">
                <div className="logo">
                    <h1><i className="fas fa-store"></i> Магазин Next69</h1>
                    <p className="logo-subtitle">Бытовая техника и товары для дома</p>
                </div>
                
                <div className="header-contacts">
                    <div className="phone-block">
                        <i className="fas fa-phone"></i>
                        <div>
                            <span className="phone-number">+7 (495) 123-45-67</span>
                            <span className="phone-hours">Ежедневно 9:00-21:00</span>
                        </div>
                    </div>
                    <div className="cart-block">
                        <Link href="/pages/cart.html" className="cart-link">
                            <i className="fas fa-shopping-cart"></i>
                            <div>
                                <span className="cart-text">Корзина</span>
                                <span className="cart-total">12 450 ₽</span>
                            </div>
                            <span className="cart-count">3</span>
                        </Link>
                        <Link href="/profile" className="text-white hover:underline">
                             Кабинет
                        </Link>
                    </div>
                </div>
            </div>
            <div className="header-bottom">
                <div className="search-container">
                    <div className="search-box">
                        <button className="search-btn"><i className="fas fa-search"></i> Найти</button>
                    </div>
                </div>
                <nav className="navbar">
                    <ul>
                        <li><Link href="/" className="active"><i className="fas fa-home"></i> Главная</Link></li>
                        <li className="dropdown">
                            <Link href="/"><i className="fas fa-tv"></i> Техника <i className="fas fa-chevron-down"></i></Link>
                            <div className="dropdown-content">
                                <Link href="/"><i className="fas fa-blender"></i> Кухонная техника</Link>
                                <Link href="/"><i className="fas fa-broom"></i> Для уборки</Link>
                                <Link href="/"><i className="fas fa-fan"></i> Климатическая</Link>
                                <Link href="/"><i className="fas fa-laptop"></i> Компьютерная</Link>
                                <Link href="/"><i className="fas fa-volume-up"></i> Аудио-видео</Link>
                            </div>
                        </li>
                        <li className="dropdown">
                            <Link href="/#"><i className="fas fa-home"></i> Для дома <i className="fas fa-chevron-down"></i></Link>
                            <div className="dropdown-content">
                                <Link href="/"><i className="fas fa-lightbulb"></i> Освещение</Link>
                                <Link href="/"><i className="fas fa-bed"></i> Текстиль</Link>
                                <Link href="/"><i className="fas fa-couch"></i> Мебель</Link>
                                <Link href="/"><i className="fas fa-utensils"></i> Посуда</Link>
                            </div>
                        </li>
                        <li><Link href="/"><i className="fas fa-percentage"></i> Акции</Link></li>
                        <li><Link href="/"><i className="fas fa-star"></i> Новинки</Link></li>
                        <li><Link href="/"><i className="fas fa-shipping-fast"></i> Доставка</Link></li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>

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