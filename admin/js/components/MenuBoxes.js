// js/components/MenuBoxes.js

import { useContext, useState, useEffect } from 'https://cdn.skypack.dev/preact/hooks';
import { html } from 'https://cdn.skypack.dev/htm/preact';
import { DataContext } from '../contexts/Data.js';

export const MenuSelectBox = () => {
    const { data, setData } = useContext(DataContext);
    const [activeMenu, setActiveMenu] = useState('');
    const [newMenuName, setNewMenuName] = useState('');
    const [editingMenu, setEditingMenu] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);

    useEffect(() => {
        if (data && data.activeMenu) {
            setActiveMenu(data.activeMenu);
        }
    }, [data]);

    useEffect(() => {
        if (editingMenu) {
            setSelectedProducts(editingMenu.products.map(product => product.id));
        }
    }, [editingMenu]);

    const handleMenuChange = (event) => {
        const selectedMenu = event.target.value;
        setActiveMenu(selectedMenu);

        // Aggiornare il menu attivo nei dati
        const updatedData = { ...data, activeMenu: selectedMenu };
        setData(updatedData);
    };

    const handleAddMenu = () => {
        const newMenu = {
            id: newMenuName.replace(/\s+/g, ''),
            name: newMenuName,
            description: '',
            products: []
        };

        const updatedData = {
            ...data,
            menus: [...data.menus, newMenu]
        };
        setData(updatedData);
        setNewMenuName('');
    };

    const handleEditMenu = (menu) => {
        setEditingMenu(menu);
    };

    const handleSaveEditMenu = () => {
        const updatedMenus = data.menus.map(menu =>
            menu.id === editingMenu.id ? { ...editingMenu, products: selectedProducts.map(id => ({ id })) } : menu
        );

        const updatedData = {
            ...data,
            menus: updatedMenus
        };
        setData(updatedData);
        setEditingMenu(null);
    };

    const handleCloseEdit = () => {
        setEditingMenu(null);
    };

    const handleProductSelection = (productId) => {
        if (selectedProducts.includes(productId)) {
            setSelectedProducts(selectedProducts.filter(id => id !== productId));
        } else {
            setSelectedProducts([...selectedProducts, productId]);
        }
    };

    const handleDeleteMenu = (menuId) => {
        if (confirm('Are you sure you want to delete this menu?')) {
            const updatedMenus = data.menus.filter(menu => menu.id !== menuId);
            const updatedData = {
                ...data,
                menus: updatedMenus,
                activeMenu: updatedMenus.length > 0 ? updatedMenus[0].id : ''
            };
            setData(updatedData);
            setActiveMenu(updatedData.activeMenu);
            if (editingMenu && editingMenu.id === menuId) {
                setEditingMenu(null);
            }
        }
    };

    return html`
        <div>
            <h2>Select Active Menu</h2>
            <select value=${activeMenu} onChange=${handleMenuChange}>
                ${data && data.menus.map(menu => html`
                    <option value=${menu.id}>${menu.name}</option>
                `)}
            </select>
            <button onClick=${() => handleEditMenu(data.menus.find(menu => menu.id === activeMenu))}>Edit</button>
            ${editingMenu && html`
                <div>
                    <h3>Edit Menu</h3>
                    <label>
                        Name:
                        <input type="text" value=${editingMenu.name} onInput=${(e) => setEditingMenu({ ...editingMenu, name: e.target.value })} />
                    </label>
                    <label>
                        Description:
                        <textarea value=${editingMenu.description} onInput=${(e) => setEditingMenu({ ...editingMenu, description: e.target.value })}></textarea>
                    </label>
                    <h4>Select Products</h4>
                    ${data.products.map(product => html`
                        <label>
                            <input 
                                type="checkbox" 
                                checked=${selectedProducts.includes(product.id)} 
                                onChange=${() => handleProductSelection(product.id)}
                            />
                            ${product.name}
                        </label>
                    `)}
                    <button onClick=${handleSaveEditMenu}>Save</button>
                    <button onClick=${handleCloseEdit}>Close</button>
                    <button onClick=${() => handleDeleteMenu(editingMenu.id)}>Delete</button>
                </div>
            `}
            <div>
                <h3>Add New Menu</h3>
                <input type="text" value=${newMenuName} onInput=${(e) => setNewMenuName(e.target.value)} placeholder="New Menu Name" />
                <button onClick=${handleAddMenu}>+</button>
            </div>
        </div>
    `;
};
