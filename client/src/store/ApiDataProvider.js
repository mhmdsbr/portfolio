import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

const ApiDataContext = createContext();

const ApiDataProvider = ({ endpoints, children }) => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // const baseURL = 'https://mohammadsaber.com/server';
                const baseURL = 'http://localhost';
                // const baseURL = window.location.origin + '/server';
                const fetchDataForEndpoint = async (endpoint) => {
                    const res = await axios.get(`${baseURL}/wp-json/portfolio/v2/${endpoint}`);
                    return res.data;
                };

                const dataPromises = endpoints.map(fetchDataForEndpoint);
                const responseData = await Promise.all(dataPromises);

                const dataObject = endpoints.reduce((acc, endpoint, index) => {
                    acc[endpoint] = responseData[index];
                    return acc;
                }, {});

                setData(dataObject);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData().then(r => {});
    }, [endpoints]);

    if (loading) {
        return <div className="data-spinner bs-primary">
            <div className="spinner-border text-white" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>;
    }

    return (
        <ApiDataContext.Provider value={data}>
            {children}
        </ApiDataContext.Provider>
    );
};

export { ApiDataProvider, ApiDataContext };
