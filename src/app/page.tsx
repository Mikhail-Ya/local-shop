
import WeeklyProducts from '@/components/ui/WeeklyProducts';
import Link from 'next/link';
import BannerBox from '@/components/ui/banners/BannerBox';

export default function Home() {
  return (
    <> 
    <BannerBox />
    <section className="categories">
        <div className="container">
            <h2 className="section-title"><i className="fas fa-th-large"></i> Популярные категории</h2>
            <div className="categories-grid">
                <Link href="/catalog" className="category-card">
                    <div className="category-icon">
                        <i className="fas fa-blender"></i>
                    </div>
                    <h3>Кухонная техника</h3>
                    <p>Холодильники, плиты, микроволновки</p>
                    <span className="category-arrow"><i className="fas fa-arrow-right"></i></span>
                </Link>
                <Link href="/catalog" className="category-card">
                    <div className="category-icon">
                        <i className="fas fa-broom"></i>
                    </div>
                    <h3>Для уборки</h3>
                    <p>Пылесосы, роботы-пылесосы</p>
                    <span className="category-arrow"><i className="fas fa-arrow-right"></i></span>
                </Link>
                <Link href="/catalog" className="category-card">
                    <div className="category-icon">
                        <i className="fas fa-fan"></i>
                    </div>
                    <h3>Климатическая</h3>
                    <p>Кондиционеры, обогреватели</p>
                    <span className="category-arrow"><i className="fas fa-arrow-right"></i></span>
                </Link>
                <Link href="/catalog" className="category-card">
                    <div className="category-icon">
                        <i className="fas fa-laptop"></i>
                    </div>
                    <h3>Компьютерная</h3>
                    <p>Ноутбуки, мониторы, аксессуары</p>
                    <span className="category-arrow"><i className="fas fa-arrow-right"></i></span>
                </Link>
                <Link href="/catalog" className="category-card">
                    <div className="category-icon">
                        <i className="fas fa-volume-up"></i>
                    </div>
                    <h3>Аудио-видео</h3>
                    <p>Телевизоры, колонки, наушники</p>
                    <span className="category-arrow"><i className="fas fa-arrow-right"></i></span>
                </Link>
                <Link href="/catalog" className="category-card">
                    <div className="category-icon">
                        <i className="fas fa-lightbulb"></i>
                    </div>
                    <h3>Освещение</h3>
                    <p>Люстры, светильники, лампы</p>
                    <span className="category-arrow"><i className="fas fa-arrow-right"></i></span>
                </Link>
            </div>
        </div>
    </section>

 
    <section className="products-section">
        <div className="container">
            <div className="section-header">
                <h2 className="section-title"><i className="fas fa-fire"></i> Хиты продаж</h2>
                <Link href="/catalog" className="view-all">Все товары <i className="fas fa-arrow-right"></i></Link>
            </div>
            <div className="products-grid">
               <WeeklyProducts />
            </div>
        </div>
    </section>

    <section className="advantages">
        <div className="container">
            <h2 className="section-title"><i className="fas fa-check-circle"></i> Преимущества покупки у нас</h2>
            <div className="advantages-grid">
                <div className="advantage-card">
                    <div className="advantage-icon">
                        <i className="fas fa-shield-alt"></i>
                    </div>
                    <h3>Гарантия качества</h3>
                    <p>Официальная гарантия на всю технику от 1 года</p>
                </div>
                <div className="advantage-card">
                    <div className="advantage-icon">
                        <i className="fas fa-truck"></i>
                    </div>
                    <h3>Быстрая доставка</h3>
                    <p>Доставка по городу в день заказа</p>
                </div>
                <div className="advantage-card">
                    <div className="advantage-icon">
                        <i className="fas fa-headset"></i>
                    </div>
                    <h3>Поддержка 24/7</h3>
                    <p>Консультации и помощь в выборе</p>
                </div>
                <div className="advantage-card">
                    <div className="advantage-icon">
                        <i className="fas fa-undo"></i>
                    </div>
                    <h3>Легкий возврат</h3>
                    <p>Возврат товара в течение 14 дней</p>
                </div>
            </div>
        </div>
    </section>
    </>
  );
}