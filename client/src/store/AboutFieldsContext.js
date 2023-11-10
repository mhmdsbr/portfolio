import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

const AboutFieldsContext = createContext();

const AboutFieldsProvider = ({ children }) => {
    const [aboutFields, setAboutFields] = useState(null);

    useEffect(() => {
        const fetchAboutFields = async () => {
            try {
                const res = await axios.get('http://portfolio.test/wp-json/portfolio/v2/about-portfolio');
                const { data } = res;
                setAboutFields(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchAboutFields();
    }, []);

    return (
        <AboutFieldsContext.Provider value={aboutFields}>
            {children}
        </AboutFieldsContext.Provider>
    );
};

export { AboutFieldsProvider, AboutFieldsContext };
