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
        if (window.location.hostname === 'localhost') {
            // Localhost: API is at /dhexstream/api/index.php
            baseUrl = '/dhexstream/api/index.php';
        } else {
            // Production / Vercel: API is at /api/index.php (rewritten from /api.php or direct)
            // safer to use /api/index.php or /api if we want directory index
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
