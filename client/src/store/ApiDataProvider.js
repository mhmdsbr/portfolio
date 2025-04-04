import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

const ApiDataContext = createContext();

// Validate and sanitize URLs
const isValidUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== 'https:') {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

// Configuration fetcher (POST)
const fetchConfig = async (signal) => {
  const mainConfURL = process.env.REACT_APP_API_BASE_URL || 'https://portfolio.test/';

  try {
    const res = await axios.post(
      `${mainConfURL}/wp-json/portfolio/v2/config-portfolio`,
      {},
      {
        maxRedirects: 0,
        timeout: 5000,
        signal
      }
    );

    const { api_base_url, recaptcha} = res.data;

 
    if (!res.data?.api_base_url || !isValidUrl(res.data.api_base_url)) {
      throw new Error('Invalid API base URL received');
    }

    return {
      baseUrl: api_base_url,
      config: { recaptcha }
    };

  } catch (error) {
    console.error('Failed to fetch base URL:', error.message);
    throw error;
  }
};

// Data endpoints fetcher (GET)
const fetchDataEndpoints = async (baseUrl, endpoints, signal) => {
  try {
    // Filter out the config endpoint
    const dataEndpoints = endpoints.filter(
      endpoint => !endpoint.includes('config-portfolio')
    );

    const fetchDataForEndpoint = async (endpoint) => {
      const sanitizedEndpoint = endpoint.replace(/[^a-zA-Z0-9-_/]/g, '');
      const url = `${baseUrl}/${sanitizedEndpoint}`;

      if (!isValidUrl(url)) {
        throw new Error(`Invalid URL constructed: ${url}`);
      }

      const res = await axios.get(url, {
        timeout: 5000,
        maxRedirects: 0,
        signal
      });
      return res.data;
    };

    const dataPromises = dataEndpoints.map(fetchDataForEndpoint);
    const responseData = await Promise.all(dataPromises);

    return dataEndpoints.reduce((acc, endpoint, index) => {
      acc[endpoint] = responseData[index];
      return acc;
    }, {});

  } catch (error) {
    console.error('API request failed:', error.message);
    throw error;
  }
};

const ApiDataProvider = ({ endpoints, children }) => {
  const [data, setData] = useState({});
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const initializeApp = async () => {
      try {
        const { baseUrl, config } = await fetchConfig(controller.signal);
        const endpointData = await fetchDataEndpoints(baseUrl, endpoints, controller.signal);

        setData(endpointData);
        setConfig(config);

      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message || 'Failed to initialize application');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    initializeApp();

    return () => controller.abort();

  }, [endpoints]);

  if (error) {
    return (
      <div className="data-error bs-danger">
        <div className="alert alert-danger">
          {error}
          <button
            className="btn btn-link"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="data-spinner bs-primary">
        <div className="spinner-border text-white" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <ApiDataContext.Provider value={{data, config}}>
      {children}
    </ApiDataContext.Provider>
  );
};

export { ApiDataProvider, ApiDataContext };