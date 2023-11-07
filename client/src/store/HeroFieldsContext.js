import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

const HeroFieldsContext = createContext();

const HeroFieldsProvider = ({ children }) => {
    const [heroFields, setHeroFields] = useState([]);

    useEffect(() => {
        const fetchHeroFields = async () => {
            try {
                const res = await axios.get('http://portfolio.test/wp-json/portfolio/v2/hero-portfolio');
                const { data } = res;
                setHeroFields(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchHeroFields();
    }, []);

    return (
        <HeroFieldsContext.Provider value={heroFields}>
            {children}
        </HeroFieldsContext.Provider>
    );
};

export { HeroFieldsProvider, HeroFieldsContext };
