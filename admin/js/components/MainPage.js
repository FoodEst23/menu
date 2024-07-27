// js/components/MainPage.js

import { html } from 'https://cdn.skypack.dev/htm/preact';
import { useContext, useState, useEffect, useRef } from 'https://cdn.skypack.dev/preact/hooks';
import { DataContext } from '../contexts/Data.js';


export const MainPage = ({data, preview}) => {
    
    if(preview){
        return  MainPageContents({data,  preview})
    }else{
        return html`
            <html lang="en">
            <head>
                <meta charset="UTF-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title>Food Est</title>
                <link rel="stylesheet" href="styles.css"/>
                <script src="index.js" defer></script>
            </head>
            <body>
            <${MainPageContents} data=${data}  preview=${preview}/>  
            </body>
            </html>
        `;
    }
};

export const MainPageContents = ({data,  preview}) => {
    console.log('MainPageContents data', data)
    
    const menu = data.menus.find(menu => menu.id === data.activeMenu) ?? data.menus[0]
    console.log('MainPageContents menu', menu)
    if(!menu) return html`<div>No active menu found</div>`;
    const products = data.products
    const menuProducts = menu.products.map(menuProduct => {
        let product = products.find(product => product.id === menuProduct.id)
        if(!product) return null
        return Object.assign({}, product, menuProduct)
    }).filter((product) => !!product && product.active)

    console.log('MainPageContents menuProducts', menuProducts)
    const productsCategories = data.productsCategories
    console.log('MainPageContents productsCategories', productsCategories)
    
    const menuProductsCategories = productsCategories.filter((category) => menuProducts.some((product) => product.category === category.id))

    console.log('MainPageContents menuProductsCategories', menuProductsCategories)
    return html`
        <div><header>
            <h1>Food Est</h1>
            <nav>
                <ul>
                    <li><a href="#map">Map</a></li>
                    <li><a href="#menu">Menu</a></li>
                </ul>
            </nav>
            </header>
            <section id="menu">
                <p>${menu.description}</p>
                ${menuProductsCategories.map(category => html`
                <p>${category.name}</p>
                <ul>
                    ${menuProducts.filter((product) => product.category === category.id).map(product => html`<li>${product.name} - ${product.price}</li>`)}
                </ul>
                `)}
            </section>
            <section id="map" >
                <h2>map</h2>
            </section>
            <footer>
            <h4>Food Est</h4>
            <h5>Slow Street Food</h5>
                <p>Disponibile per eventi privati ed aziendali</p>
                <p>Numero di telefono: ${data.phone}</p>
            </footer>
        </div>
    `;
};