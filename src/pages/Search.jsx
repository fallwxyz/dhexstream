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
            <div className="max-w-3xl mx-auto mb-16 text-center">
                <h1 className="text-3xl font-bold text-white mb-8">Search Anime</h1>

                <form onSubmit={handleSearchSubmit} className="relative group z-10">
                    <input
                        type="text"
                        placeholder="Search for anime... (e.g. Naruto, One Piece)"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        autoFocus
                        className="w-full bg-dhex-bg-secondary border border-white/10 rounded-full py-4 px-8 pl-14 text-white placeholder-gray-500 focus:outline-none focus:border-dhex-accent focus:ring-1 focus:ring-dhex-accent transition-all shadow-lg"
                    />
                    <SearchIcon
                        className={`absolute left-5 top-1/2 transform -translate-y-1/2 transition-colors ${loading ? 'text-dhex-accent' : 'text-gray-500 group-focus-within:text-dhex-accent'}`}
                        size={24}
                    />

                    {loading && (
                        <div className="absolute right-24 top-1/2 transform -translate-y-1/2">
                            <Loader className="animate-spin text-dhex-accent" size={20} />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-dhex-accent hover:bg-dhex-accent-hover text-white px-6 py-2 rounded-full font-medium transition-colors"
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* Status Messages */}
            {shouldFetch && loading && (
                <div className="flex flex-col items-center justify-center my-20 opacity-50">
                    <div className="animate-pulse text-dhex-accent text-lg">Searching...</div>
                </div>
            )}

            {shouldFetch && error && (
                <div className="text-center text-red-400 bg-red-500/10 p-4 rounded-lg max-w-md mx-auto border border-red-500/20">
                    Error parsing results. Please try again.
                </div>
            )}

            {shouldFetch && !loading && !error && results.length === 0 && (
                <div className="text-center text-gray-400 my-20">
                    <p className="text-xl mb-2">No results found for "{debouncedQuery}"</p>
                    <p className="text-sm opacity-60">Try checking your spelling or use a different keyword.</p>
                </div>
            )}

            {/* Results Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {results.map((anime, index) => (
                    <div key={anime.animeId || index} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                        <AnimeCard anime={anime} />
                    </div>
                ))}
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
