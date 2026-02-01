import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import AnimeCard from '../components/anime/AnimeCard';
import { Search as SearchIcon } from 'lucide-react';
import { useGsap } from '../hooks/useGsap';

const Search = () => {
    const [query, setQuery] = useState('');
    const [activeQuery, setActiveQuery] = useState(''); // To trigger fetch
    const { data: searchData, loading, error } = useFetch('search', { query: activeQuery });
    const { gsap } = useGsap();

    const handleSearch = (e) => {
        e.preventDefault();
        setActiveQuery(query);
    };

    const results = searchData && searchData.data ? searchData.data : [];

    return (
        <div className="container mx-auto px-6 py-20 min-h-screen">
            <div className="max-w-3xl mx-auto mb-16 text-center">
                <h1 className="text-3xl font-bold text-white mb-8">Search Anime</h1>

                <form onSubmit={handleSearch} className="relative group">
                    <input
                        type="text"
                        placeholder="Search for anime..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-dhex-bg-secondary border border-white/10 rounded-full py-4 px-8 pl-14 text-white placeholder-gray-500 focus:outline-none focus:border-dhex-accent focus:ring-1 focus:ring-dhex-accent transition-all shadow-lg"
                    />
                    <SearchIcon
                        className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-dhex-accent transition-colors"
                        size={24}
                    />
                    <button
                        type="submit"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-dhex-accent hover:bg-dhex-accent-hover text-white px-6 py-2 rounded-full font-medium transition-colors"
                    >
                        Search
                    </button>
                </form>
            </div>

            {loading && (
                <div className="flex justify-center my-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dhex-accent"></div>
                </div>
            )}

            {error && <div className="text-center text-red-500">Error fetching results.</div>}

            {activeQuery && !loading && results.length === 0 && (
                <div className="text-center text-gray-400">
                    No results found for "{activeQuery}".
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {results.map((anime, index) => (
                    <div key={anime.animeId || index} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                        <AnimeCard anime={anime} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Search;
