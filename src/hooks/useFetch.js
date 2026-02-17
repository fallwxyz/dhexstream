import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFetch = (endpoint, params = {}, shouldFetch = true) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!shouldFetch) {
            // If shouldFetch is false, reset data, error, and ensure loading is false
            setData(null);
            setError(null);
            setLoading(false);
            return;
        }


        // Determine base URL based on environment
        let baseUrl = '';
        if (import.meta.env.VITE_API_BASE_URL) {
             baseUrl = import.meta.env.VITE_API_BASE_URL;
        } else if (import.meta.env.DEV) {
            // Development: Force use of the proxy path
            baseUrl = '/dhexstream/api/index.php';
        } else {
            // Production: Absolute path to api/index.php
            baseUrl = '/api/index.php';
        }

        const url = `${baseUrl}?endpoint=${endpoint}`;

        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(url, {
                    params,
                    withCredentials: true // Important: Send cookies for user tracking
                });
                setData(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [endpoint, JSON.stringify(params)]);

    return { data, loading, error };
};
