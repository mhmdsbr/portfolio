import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import useBaseUrlFetcher from './apiBaseUrlFetch';

const ApiDataContext = createContext();

const ApiDataProvider = ({ endpoints, children }) => {
    const baseUrl = useSelector((state) => state.config.baseUrl);
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    useBaseUrlFetcher();

    useEffect(() => {
        if (!baseUrl) return;

        const fetchData = async () => {
            try {
                const fetchDataForEndpoint = async (endpoint) => {
                    const res = await axios.get(`${baseUrl}/${endpoint}`);
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
    }, [baseUrl, endpoints]);

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
