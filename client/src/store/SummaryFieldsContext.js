import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

const SummaryFieldsContext = createContext();

const SummaryFieldsProvider = ({ children }) => {
    const [summaryFields, setSummaryFields] = useState(null);

    useEffect(() => {
        const fetchSummaryFields = async () => {
            try {
                const res = await axios.get('http://portfolio.test/wp-json/portfolio/v2/summary-portfolio');
                const { data } = res;
                setSummaryFields(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchSummaryFields();
    }, []);

    return (
        <SummaryFieldsContext.Provider value={summaryFields}>
            {children}
        </SummaryFieldsContext.Provider>
    );
};

export { SummaryFieldsProvider, SummaryFieldsContext };
