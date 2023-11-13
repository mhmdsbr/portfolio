import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

const ServicesFieldsContext = createContext();

const ServicesFieldsProvider = ({ children }) => {
    const [servicesFields, setServicesFields] = useState(null);

    useEffect(() => {
        const fetchServicesFields = async () => {
            try {
                const res = await axios.get('http://portfolio.test/wp-json/portfolio/v2/services-portfolio');
                const { data } = res;
                setServicesFields(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchServicesFields();
    }, []);

    return (
        <ServicesFieldsContext.Provider value={servicesFields}>
            {children}
        </ServicesFieldsContext.Provider>
    );
};

export { ServicesFieldsProvider, ServicesFieldsContext };
