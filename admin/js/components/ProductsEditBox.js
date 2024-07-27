// js/components/ProductsEditBox.js

import { useContext, useState } from 'https://cdn.skypack.dev/preact/hooks';
import { html } from 'https://cdn.skypack.dev/htm/preact';
import { DataContext } from '../contexts/Data.js';

export const ProductsEditBox = () => {
    const { data, setData } = useContext(DataContext);
    const [newProductName, setNewProductName] = useState('');
    const [newProductCategory, setNewProductCategory] = useState('');
    const [newProductPrice, setNewProductPrice] = useState('');
    const [newProductDescription, setNewProductDescription] = useState('');
    const [newProductPhoto, setNewProductPhoto] = useState('');
    const [newProductIngredients, setNewProductIngredients] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setNewProductName(product.name);
        setNewProductCategory(product.category);
        setNewProductPrice(product.price);
        setNewProductDescription(product.description);
        setNewProductPhoto(product.photo);
        setNewProductIngredients(product.ingredients.join(', '));
    };

    const handleSaveEditProduct = () => {
        const updatedProduct = {
            ...editingProduct,
            name: newProductName,
            category: newProductCategory,
            price: parseFloat(newProductPrice),
            description: newProductDescription,
            photo: newProductPhoto,
            ingredients: newProductIngredients.split(',').map(ingredient => ingredient.trim())
        };

        const updatedProducts = data.products.map(product =>
            product.id === editingProduct.id ? updatedProduct : product
        );

        const updatedData = {
            ...data,
            products: updatedProducts
        };
        setData(updatedData);
        setEditingProduct(null);
        clearForm();
    };

    const handleCloseEdit = () => {
        setEditingProduct(null);
        clearForm();
    };

    const handleAddProduct = () => {
        const newProduct = {
            id: newProductName.replace(/\s+/g, '').toLowerCase(),
            name: newProductName,
            category: newProductCategory,
            price: parseFloat(newProductPrice),
            description: newProductDescription,
            photo: newProductPhoto,
            ingredients: newProductIngredients.split(',').map(ingredient => ingredient.trim())
        };

        const updatedData = {
            ...data,
            products: [...data.products, newProduct]
        };
        setData(updatedData);
        clearForm();
    };

    const handleDeleteProduct = (productId) => {
        if (confirm('Are you sure you want to delete this product?')) {
            const updatedProducts = data.products.filter(product => product.id !== productId);
            const updatedData = {
                ...data,
                products: updatedProducts
            };
            setData(updatedData);
            if (editingProduct && editingProduct.id === productId) {
                setEditingProduct(null);
                clearForm();
            }
        }
    };

    const clearForm = () => {
        setNewProductName('');
        setNewProductCategory('');
        setNewProductPrice('');
        setNewProductDescription('');
        setNewProductPhoto('');
        setNewProductIngredients('');
    };

    return html`
        <div>
            <h2>Products</h2>
            <ul>
                ${data && data.products.map(product => html`
                    <li key=${product.id}>
                        ${product.name}
                        <button onClick=${() => handleEditProduct(product)}>Edit</button>
                        <button onClick=${() => handleDeleteProduct(product.id)}>Delete</button>
                    </li>
                `)}
            </ul>
            ${editingProduct && html`
                <div>
                    <h3>Edit Product</h3>
                    <label>
                        Name:
                        <input type="text" value=${newProductName} onInput=${(e) => setNewProductName(e.target.value)} />
                    </label>
                    <label>
                        Category:
                        <input type="text" value=${newProductCategory} onInput=${(e) => setNewProductCategory(e.target.value)} />
                    </label>
                    <label>
                        Price:
                        <input type="number" value=${newProductPrice} onInput=${(e) => setNewProductPrice(e.target.value)} />
                    </label>
                    <label>
                        Description:
                        <textarea value=${newProductDescription} onInput=${(e) => setNewProductDescription(e.target.value)}></textarea>
                    </label>
                    <label>
                        Photo:
                        <input type="text" value=${newProductPhoto} onInput=${(e) => setNewProductPhoto(e.target.value)} />
                    </label>
                    <label>
                        Ingredients:
                        <input type="text" value=${newProductIngredients} onInput=${(e) => setNewProductIngredients(e.target.value)} placeholder="Separate ingredients with commas" />
                    </label>
                    <button onClick=${handleSaveEditProduct}>Save</button>
                    <button onClick=${handleCloseEdit}>Close</button>
                </div>
            `}
            <div>
                <h3>Add New Product</h3>
                <label>
                    Name:
                    <input type="text" value=${newProductName} onInput=${(e) => setNewProductName(e.target.value)} />
                </label>
                <label>
                    Category:
                    <input type="text" value=${newProductCategory} onInput=${(e) => setNewProductCategory(e.target.value)} />
                </label>
                <label>
                    Price:
                    <input type="number" value=${newProductPrice} onInput=${(e) => setNewProductPrice(e.target.value)} />
                </label>
                <label>
                    Description:
                    <textarea value=${newProductDescription} onInput=${(e) => setNewProductDescription(e.target.value)}></textarea>
                </label>
                <label>
                    Photo:
                    <input type="text" value=${newProductPhoto} onInput=${(e) => setNewProductPhoto(e.target.value)} />
                </label>
                <label>
                    Ingredients:
                    <input type="text" value=${newProductIngredients} onInput=${(e) => setNewProductIngredients(e.target.value)} placeholder="Separate ingredients with commas" />
                </label>
                <button onClick=${handleAddProduct}>+</button>
            </div>
        </div>
    `;
};
