// src/components/ui/Footer.tsx
import Link from "next/link";
import  my  from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={my.footer}>
        <div className="container">
            <div className="footer-main">
                <div className="footer-column">
                    <h3>Торговый Дом Орион</h3>
                    <p>Продажа бытовой техники и товаров для дома. Работаем с 2010 года.</p>
                    <div className="footer-contacts">
                        <p><i className="fas fa-phone"></i> +7 (495) 123-45-67</p>
                        <p><i className="fas fa-envelope"></i> info@orion-td.ru</p>
                        <p><i className="fas fa-map-marker-alt"></i> г. Москва, ул. Промышленная, 15</p>
                    </div>
                </div>
                
                <div className="footer-column">
                    <h3>Каталог</h3>
                    <ul>
                        <li><Link href="/">Кухонная техника</Link></li>
                        <li><Link href="/">Техника для уборки</Link></li>
                        <li><Link href="/">Климатическая техника</Link></li>
                        <li><Link href="/">Компьютерная техника</Link></li>
                    </ul>
                </div>
                
                <div className="footer-column">
                    <h3>Покупателям</h3>
                    <ul>
                        <li><Link href="">Доставка и оплата</Link></li>
                        <li><Link href="">Гарантия</Link></li>
                        <li><Link href="">Возврат товара</Link></li>
                        <li><Link href="">Кредит и рассрочка</Link></li>
                    </ul>
                </div>
                
                <div className="footer-column">
                    <h3>Компания</h3>
                    <ul>
                        <li><Link href="">О компании</Link></li>
                        <li><Link href="">Контакты</Link></li>
                        <li><Link href="">Вакансии</Link></li>
                        <li><Link href="">Отзывы</Link></li>
                    </ul>
                </div>
            </div>
            
            <div className="footer-bottom">
                <div className="copyright">
                    © 2025 Торговый Дом Орион. Все права защищены.
                </div>
                <div className="payment-methods">
                    <i className="fab fa-cc-visa"></i>
                    <i className="fab fa-cc-mastercard"></i>
                    <i className="fab fa-cc-mir"></i>
                </div>
            </div>
        </div>
    </footer>
  );
}