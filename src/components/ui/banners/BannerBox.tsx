import React from "react";
import Link from 'next/link';
import  my  from './banner.module.css';

export default function BannerBox() {
  
    const bannersInfo =[{
        header:"Распродажа бытовой техники",
        button:{active:true,name:"Смотреть акцию",href:"/catalog"},
        info:"Скидки до 30% на технику для дома",
        icon:"fas fa-tags"},
        { header:"Бесплатная доставка (Осташков, Селижарово, Пено)",
            button:{active:true,name:"Узнать условия",href:"/catalog"},
        info:"При заказе от 5000 ₽",
        icon:"fas fa-truck"},
        {header:"Рассрочка 0%",
            button:{active:true,name:"Узнать условия",href:"/catalog"},
        info:"На 6 месяцев",
        icon:"fas fa-credit-card"},
    ];


  return (
    <section className={my.bannerbox}>
      <div className="container">
            <div className={my.bannergrid}>
                { bannersInfo.map( (banner,i) => (
                    <div className={my.banner +' '+ my.banner+i} key={i}>
                        <h2>{banner.header}</h2>
                        <p>{banner.info}</p>
                        {banner.button?.active && <Link href={banner.button?.href} 
                            className={my.btn +' '+ my.btn+i}>
                                {banner.button.name}</Link>}
                        {banner.icon != "" && <div className={my.bannericon}>
                            <i className={banner.icon}></i>
                        </div>}
                    </div>)
                )}
            </div>
        </div>
    </section>
  );
}
