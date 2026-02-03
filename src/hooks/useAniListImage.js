import { useState, useEffect, useRef } from 'react';

// Cache for API responses
const imageCache = new Map();
// Rate limiting queue
let requestQueue = [];
let isProcessingQueue = false;
const RATE_LIMIT_DELAY = 400; // ms between requests (Jikan allows ~3 per second)

const processQueue = async () => {
    if (isProcessingQueue || requestQueue.length === 0) return;
    
    isProcessingQueue = true;
    
    while (requestQueue.length > 0) {
        const { title, resolve, reject } = requestQueue.shift();
        
        try {
            const image = await fetchJikanImage(title);
            resolve(image);
        } catch (error) {
            reject(error);
        }
        
        // Wait before next request to respect rate limit
        if (requestQueue.length > 0) {
            await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
        }
    }
    
    isProcessingQueue = false;
};

const fetchJikanImage = async (title) => {
    // Check cache first
    if (imageCache.has(title)) {
        return imageCache.get(title);
    }
    
    // Clean title for better search results
    const cleanTitle = title
        .replace(/\(TV\)/gi, '')
        .replace(/S\d+/gi, '')
        .replace(/Season\s*\d+/gi, '')
        .replace(/sub\s*indo/gi, '')
        .replace(/subtitle\s*indonesia/gi, '')
        .replace(/[^\w\s-]/gi, '')
        .trim();

    if (!cleanTitle) {
        return null;
    }

    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(cleanTitle)}&limit=1`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });

        if (response.status === 429) {
            // Rate limited - return null silently
            return null;
        }

        if (!response.ok) {
            throw new Error(`Jikan API error: ${response.status}`);
        }

        const data = await response.json();
        const anime = data?.data?.[0];

        if (anime) {
            const image = anime.trailer?.images?.maximum_image_url || 
                         anime.images?.jpg?.large_image_url || 
                         anime.images?.webp?.large_image_url || 
                         null;
            
            // Cache the result
            imageCache.set(title, image);
            return image;
        }
        
        return null;
    } catch (error) {
        // Silently fail - return null on any error
        return null;
    }
};

export const useAniListImage = (title) => {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const promiseRef = useRef(null);

    useEffect(() => {
        if (!title || title.length < 3) {
            setLoading(false);
            return;
        }

        // Create a promise for this request
        const requestPromise = new Promise((resolve, reject) => {
            requestQueue.push({ title, resolve, reject });
            processQueue();
        });

        promiseRef.current = requestPromise;

        requestPromise.then(result => {
            // Only update if this is still the current request
            if (promiseRef.current === requestPromise) {
                setImage(result);
                setLoading(false);
            }
        }).catch(() => {
            if (promiseRef.current === requestPromise) {
                setLoading(false);
            }
        });

        return () => {
            promiseRef.current = null;
        };
    }, [title]);

    return { image, loading };
};
