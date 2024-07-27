// js/components/ProductsCategoriesEditBox.js

import { useContext, useState, useEffect } from 'https://cdn.skypack.dev/preact/hooks';
import { html } from 'https://cdn.skypack.dev/htm/preact';
import { DataContext } from '../contexts/Data.js';

export const ProductsCategoriesEditBox = () => {
    const { data, setData } = useContext(DataContext);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);

    const handleEditCategory = (category) => {
        setEditingCategory(category);
    };

    const handleSaveEditCategory = () => {
        const updatedCategories = data.productsCategories.map(category =>
            category.id === editingCategory.id ? editingCategory : category
        );

        const updatedData = {
            ...data,
            productsCategories: updatedCategories
        };
        setData(updatedData);
        setEditingCategory(null);
    };

    const handleCloseEdit = () => {
        setEditingCategory(null);
    };

    const handleAddCategory = () => {
        const newCategory = {
            id: newCategoryName.replace(/\s+/g, '').toLowerCase(),
            name: newCategoryName,
            description: ''
        };

        const updatedData = {
            ...data,
            productsCategories: [...data.productsCategories, newCategory]
        };
        setData(updatedData);
        setNewCategoryName('');
    };

    const handleDeleteCategory = (categoryId) => {
        if (confirm('Are you sure you want to delete this category?')) {
            const updatedCategories = data.productsCategories.filter(category => category.id !== categoryId);
            const updatedData = {
                ...data,
                productsCategories: updatedCategories
            };
            setData(updatedData);
            if (editingCategory && editingCategory.id === categoryId) {
                setEditingCategory(null);
            }
        }
    };

    return html`
        <div>
            <h2>Product Categories</h2>
            <ul>
                ${data && data.productsCategories.map(category => html`
                    <li key=${category.id}>
                        ${category.name}
                        <button onClick=${() => handleEditCategory(category)}>Edit</button>
                        <button onClick=${() => handleDeleteCategory(category.id)}>Delete</button>
                    </li>
                `)}
            </ul>
            ${editingCategory && html`
                <div>
                    <h3>Edit Category</h3>
                    <label>
                        Name:
                        <input type="text" value=${editingCategory.name} onInput=${(e) => setEditingCategory({ ...editingCategory, name: e.target.value })} />
                    </label>
                    <label>
                        Description:
                        <textarea value=${editingCategory.description} onInput=${(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}></textarea>
                    </label>
                    <button onClick=${handleSaveEditCategory}>Save</button>
                    <button onClick=${handleCloseEdit}>Close</button>
                </div>
            `}
            <div>
                <h3>Add New Category</h3>
                <input type="text" value=${newCategoryName} onInput=${(e) => setNewCategoryName(e.target.value)} placeholder="New Category Name" />
                <button onClick=${handleAddCategory}>+</button>
            </div>
        </div>
    `;
};
