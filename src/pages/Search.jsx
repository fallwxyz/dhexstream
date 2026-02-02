import React, { useState, useEffect } from 'react';
import { useFetch } from '../hooks/useFetch';
import AnimeCard from '../components/anime/AnimeCard';
import { Search as SearchIcon, Loader } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialQuery = searchParams.get('query') || '';

    const [inputValue, setInputValue] = useState(initialQuery);
    const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

    // Debounce Logic: Wait 500ms after typing stops before updating the "active" query
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(inputValue);
            // Sync URL with input value (if not empty)
            if (inputValue.trim()) {
                setSearchParams({ query: inputValue });
            } else {
                setSearchParams({});
            }
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [inputValue, setSearchParams]);

    // Fetch data based on the debounced query
    // Only fetch if we have a query string
    const shouldFetch = debouncedQuery.length > 0;
    const { data: searchData, loading, error } = useFetch('search', { query: debouncedQuery }, shouldFetch);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // Force update immediately on submit
        setDebouncedQuery(inputValue);
        setSearchParams({ query: inputValue });
    };

    const results = searchData?.data?.animeList || [];

    return (
        <div className="container mx-auto px-6 py-20 min-h-screen">
            {/* Status Messages */}
            {shouldFetch && error && (
                <div className="text-center text-red-400 bg-red-500/10 p-4 rounded-lg max-w-md mx-auto border border-red-500/20 mb-8">
                    Error parsing results. Please try again.
                </div>
            )}

            {shouldFetch && !loading && !error && results.length === 0 && (
                <div className="text-center text-gray-400 my-20">
                    <p className="text-xl mb-2">No results found for "{debouncedQuery}"</p>
                    <p className="text-sm opacity-60">Try checking your spelling or use a different keyword.</p>
                </div>
            )}

            {/* Loading / Results Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {loading ? (
                    // Stable Skeleton Loader
                    Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="animate-pulse bg-white/5 rounded-xl aspect-[2/3] w-full" />
                    ))
                ) : (
                    results.map((anime, index) => (
                        <div key={anime.animeId || index} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                            <AnimeCard anime={anime} />
                        </div>
                    ))
                )}
            </div>

            {/* Empty State / Initial View */}
            {!shouldFetch && (
                <div className="text-center text-gray-600 mt-20">
                    <p>Type something to start searching...</p>
                </div>
            )}
        </div>
    );
};

export default Search;
