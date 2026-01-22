// src/components/ui/Footer.tsx

export default function Footer() {
  return (
    <footer className="footer">
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
                        <li><a href="">Кухонная техника</a></li>
                        <li><a href="">Техника для уборки</a></li>
                        <li><a href="">Климатическая техника</a></li>
                        <li><a href="">Компьютерная техника</a></li>
                    </ul>
                </div>
                
                <div className="footer-column">
                    <h3>Покупателям</h3>
                    <ul>
                        <li><a href="">Доставка и оплата</a></li>
                        <li><a href="">Гарантия</a></li>
                        <li><a href="">Возврат товара</a></li>
                        <li><a href="">Кредит и рассрочка</a></li>
                    </ul>
                </div>
                
                <div className="footer-column">
                    <h3>Компания</h3>
                    <ul>
                        <li><a href="">О компании</a></li>
                        <li><a href="">Контакты</a></li>
                        <li><a href="">Вакансии</a></li>
                        <li><a href="">Отзывы</a></li>
                    </ul>
                </div>
            </div>
            
            <div className="footer-bottom">
                <div className="copyright">
                    © 2024 Торговый Дом Орион. Все права защищены.
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