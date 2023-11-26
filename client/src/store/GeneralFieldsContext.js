import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

const GeneralFieldsContext = createContext();

const GeneralFieldsProvider = ({ children }) => {
    const [generalFields, setGeneralFields] = useState(null);

    useEffect(() => {
        const fetchGeneralFields = async () => {
            try {
                const res = await axios.get('http://portfolio.test/wp-json/portfolio/v2/general-portfolio');
                const { data } = res;
                setGeneralFields(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchGeneralFields();
    }, []);

    if (generalFields === null) {
        return <p>Loading...</p>;
    }

    return (
        <GeneralFieldsContext.Provider value={generalFields}>
            {children}
        </GeneralFieldsContext.Provider>
    );
};

export { GeneralFieldsProvider, GeneralFieldsContext };
