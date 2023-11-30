import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
const ApiDataContext = createContext();

const ApiDataProvider = ({ endpoint, children }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const baseURL = window.location.origin + '/server';
                const res = await axios.get(`${baseURL}/wp-json/portfolio/v2/${endpoint}`);
                const { data } = res;
                setData(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData().then(r => {});
    }, [endpoint]);
    return (
        <ApiDataContext.Provider value={data}>
            {children}
        </ApiDataContext.Provider>
    );
};

export { ApiDataProvider, ApiDataContext };
