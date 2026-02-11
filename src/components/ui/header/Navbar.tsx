'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import myStyle from './header.module.css';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<{ email: string; role?: string; full_name?: string } | null>(null);
  const pathname = usePathname();
  const { totalItems, totalPrice } = useCart();

  useEffect(() => {
    // Проверяем наличие cookies или делаем запрос к API
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (e) {
        setUser(null);
      }
    };
    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // игнорируем сетевые ошибки при выходе
    } finally {
      setUser(null);
      window.location.href = '/';
    }
  };
 

  return (
    <nav className={myStyle.headerBox}>
        <header className={myStyle.header}>
            <div className={myStyle.headerLogo}>
                    <div className={myStyle.logo}>
                        <Link href={'/'}>
                        <h1><i className={myStyle.k}></i> Магазин Next69</h1>
                        </Link>
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
                    {user != null ? (
                      <div className={myStyle.cartlink}>
                        {user.role !== 'admin' ? (
                          <>
                            <Link href="/profile" className={"block px-4 py-2 hover:bg-gray-100"}>
                              <i className="fas fa-circle-user"></i> Личный кабинет
                            </Link>
                            <button
                              type="button"
                              onClick={handleLogout}
                              className={"block px-4 py-2 hover:bg-gray-100"}
                            >
                              Выйти
                            </button>
                          </>
                        ) : (
                          <>
                            <Link href="/admin-vkr-2026-secret" className={"block px-4 py-2 hover:bg-gray-100"}>
                              Админка
                            </Link>
                            <button
                              type="button"
                              onClick={handleLogout}
                              className={"block px-4 py-2 hover:bg-gray-100"}
                            >
                              Выйти
                            </button>
                          </>
                        )}
                      </div>
                    ) : (
                      <>
                        <Link href="/login" className={myStyle.cartlink}>Вход</Link>
                        <Link href="/register" className={myStyle.cartlink}>Регистрация</Link>
                      </>
                    )}
                        <Link href="/cart" className={myStyle.cartlink}>
                            <i className={"fas fa-shopping-cart"}></i>
                            <span className={myStyle.carttotal}>{totalPrice.toLocaleString('ru-RU')} ₽</span>
                            <span className={myStyle.cartcount}>{totalItems}</span>
                        </Link>
                </div>
            </div>
            { pathname === '/' ? (
                <div className={myStyle.headerbottom}>
                    <div className={myStyle.searchcontainer}>
                        <input type='text' placeholder="Поиск по каталогу бытовой техники..." />
                        <button className={myStyle.searchbtn}><i className={"fas fa-search"}></i> Найти</button>
                    </div>
                    <nav className={myStyle.navbar}>
                        <ul>
                            <li><Link href="/" className={myStyle.active}><i className={"fas fa-home"}></i> Главная</Link></li>
                            <li className={myStyle.dropdown}>
                                <Link href="/catalog"><i className={"fas fa-tv"}></i> Техника <i className={myStyle.fachevrondown}></i></Link>
                                <div className={myStyle.dropdowncontent}>
                                    <Link href="/catalog"><i className={myStyle.h + " fas fa-blender"}></i> Кухонная техника</Link>
                                    <Link href="/catalog"><i className={myStyle.h +" fas fa-broom"}></i> Для уборки</Link>
                                    <Link href="/catalog"><i className={myStyle.h +" fas fa-fan"}></i> Климатическая</Link>
                                    <Link href="/catalog"><i className={myStyle.h +" fas fa-laptop"}></i> Компьютерная</Link>
                                    <Link href="/catalog"><i className={myStyle.h +" fas fa-volume-up"}></i> Аудиовидео</Link>
                                </div>
                            </li>
                            <li className={myStyle.dropdown}>
                                <Link href="/catalog"><i className={"fas fa-home"}></i> Для дома <i className={myStyle.fachevrondown}></i></Link>
                                <div className={myStyle.dropdowncontent}>
                                    <Link href="/catalog"><i className={myStyle.h +" fas fa-lightbulb"}></i> Освещение</Link>
                                    <Link href="/catalog"><i className={myStyle.h +" fas fa-bed"}></i> Текстиль</Link>
                                    <Link href="/catalog"><i className={myStyle.h +" fas fa-couch"}></i> Мебель</Link>
                                    <Link href="/catalog"><i className={myStyle.h +" fas fa-utensils"}></i> Посуда</Link>
                                </div>
                            </li>
                            <li><Link href="/catalog"><i className={"fas fa-percentage"}></i> Акции</Link></li>
                            <li><Link href="/catalog"><i className={"fas fa-star"}></i> Новинки</Link></li>
                            <li><Link href="/catalog"><i className={"fas fa-shipping-fast"}></i> Доставка</Link></li>
                        </ul>
                    </nav>
            </div>) : ( <div> </div> )
            }
        </header>

      {/* Мобильное меню */}
      {isMenuOpen && (
        <div className={myStyle.md}>
          <Link href="/" className={myStyle.block}>Главная</Link>
          <Link href="/catalog" className={myStyle.block }>Каталог</Link>
          <Link href="/profile" className={myStyle.block }>Профиль</Link>
          <Link href="/cart" className={myStyle.block }>Корзина</Link>
        </div>
      )}
    </nav>
  );
}