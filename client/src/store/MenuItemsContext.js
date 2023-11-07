import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const MenuItemsContext = createContext();

const MenuItemsProvider = ({ children }) => {
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const res = await axios.get('http://portfolio.test/wp-json/portfolio/v2/menu-items');
                const { data } = res;
                setMenuItems(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchMenuItems().then(r => {} );

    }, []);

    return (
        <MenuItemsContext.Provider value={menuItems}>
            {children}
        </MenuItemsContext.Provider>
    );
};

export { MenuItemsProvider, MenuItemsContext };

