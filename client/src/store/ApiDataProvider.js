import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

const ApiDataContext = createContext();

const ApiDataProvider = ({ endpoints, children }) => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [baseUrl, setBaseUrl] = useState('');
    useEffect(() => {
        const fetchBaseUrl = async () => {
            const mainConfURL = window.location.origin + '/server'; // change this based on ur API base url
            try {
                const res = await axios.get(`${mainConfURL}/wp-json/portfolio/v2/config-portfolio`);
                setBaseUrl(res.data.api_base_url);
            } catch (error) {
                console.error(error);
            }
        };

        fetchBaseUrl().then(r => {});
    }, []);

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
