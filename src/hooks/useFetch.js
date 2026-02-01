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

        const url = `/dhexstream/api.php?endpoint=${endpoint}`;

        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(url, { params });
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
