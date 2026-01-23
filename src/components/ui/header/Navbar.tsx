// src/components/ui/Navbar.tsx

'use client';

import Link from 'next/link';
import { useState } from 'react';
import myStyle from './header.module.css'
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const pathname = usePathname();
  // Показываем Navbar ТОЛЬКО на главной и в каталоге
  const showNavbar = pathname === '/' || pathname === '/catalog';

  if (!showNavbar) {
    return null;
  }

  return (
    <nav className={myStyle.headerBox}>
        <header className={myStyle.header}>
            <div className={myStyle.headerLogo}>
                    <div className={myStyle.logo}>
                        <h1><i className={myStyle.k}></i> Магазин Next69</h1>
                        <p className={myStyle.logosubtitle}>Бытовая техника и товары для дома</p>
                    </div>
                <div className={myStyle.phoneblock}>
                    <i className={'fas fa-phone'}></i>
                    <div className={myStyle.phoneTime}>
                        <span className={myStyle.phonenumber}>+7 (495) 1234567</span>
                        <span className={myStyle.phonehours}>Ежедневно 9:00 - 21:00</span>
                    </div>
                </div>
                <div className={myStyle.userCabinet}>
                    <Link href="/profile" className={myStyle.cartlink}>
                        <i className={"fas fa-circle-user"}></i>
                        <div>
                            <span className={myStyle.carttext}>Личный кабинет</span>
                        </div>
                    </Link>
                    <Link href="/cart" className={myStyle.cartlink}>
                        <i className={"fas fa-shopping-cart"}></i>
                        <div>
                            <span className={myStyle.carttext}>Корзина</span>
                            <span className={myStyle.carttotal}>12 450 ₽</span>
                        </div>
                        <span className={myStyle.cartcount}>3</span>
                    </Link>
                </div>
            </div>
            <div className={myStyle.headerbottom}>
                    <div className={myStyle.searchcontainer}>
                        <input type='text' placeholder="Поиск по каталогу бытовой техники..." />
                        <button className={myStyle.searchbtn}><i className={"fas fa-search"}></i> Найти</button>
                    </div>
                    <nav className={myStyle.navbar}>
                        <ul>
                            <li><Link href="/" className={myStyle.active}><i className={"fas fa-home"}></i> Главная</Link></li>
                            <li className={myStyle.dropdown}>
                                <Link href="/"><i className={"fas fa-tv"}></i> Техника <i className={myStyle.fachevrondown}></i></Link>
                                <div className={myStyle.dropdowncontent}>
                                    <Link href="/"><i className={myStyle.h + " fas fa-blender"}></i> Кухонная техника</Link>
                                    <Link href="/"><i className={myStyle.h +" fas fa-broom"}></i> Для уборки</Link>
                                    <Link href="/"><i className={myStyle.h +" fas fa-fan"}></i> Климатическая</Link>
                                    <Link href="/"><i className={myStyle.h +" fas fa-laptop"}></i> Компьютерная</Link>
                                    <Link href="/"><i className={myStyle.h +" fas fa-volume-up"}></i> Аудиовидео</Link>
                                </div>
                            </li>
                            <li className={myStyle.dropdown}>
                                <Link href="/"><i className={"fas fa-home"}></i> Для дома <i className={myStyle.fachevrondown}></i></Link>
                                <div className={myStyle.dropdowncontent}>
                                    <Link href="/"><i className={myStyle.h +" fas fa-lightbulb"}></i> Освещение</Link>
                                    <Link href="/"><i className={myStyle.h +" fas fa-bed"}></i> Текстиль</Link>
                                    <Link href="/"><i className={myStyle.h +" fas fa-couch"}></i> Мебель</Link>
                                    <Link href="/"><i className={myStyle.h +" fas fa-utensils"}></i> Посуда</Link>
                                </div>
                            </li>
                            <li><Link href="/"><i className={"fas fa-percentage"}></i> Акции</Link></li>
                            <li><Link href="/"><i className={"fas fa-star"}></i> Новинки</Link></li>
                            <li><Link href="/"><i className={"fas fa-shipping-fast"}></i> Доставка</Link></li>
                        </ul>
                    </nav>
            </div>
        </header>

      {/* Мобильное меню */}
      {isMenuOpen && (
        <div className={myStyle.md}>
          <Link href="/" className={myStyle.block}>Гл</Link>
          <Link href="/categories" className={myStyle.block }>Кат</Link>
          <Link href="/about" className={myStyle.block }>О нас</Link>
          <Link href="/delivery" className={myStyle.block }>Дост</Link>
        </div>
      )}
    </nav>
  );
}