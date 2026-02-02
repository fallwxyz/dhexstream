import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import AnimeCard from '../anime/AnimeCard';
import { Search, Loader2, ChevronRight, X, ChevronLeft } from 'lucide-react';

// Custom hook for debouncing
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

const SearchDropdown = ({ searchQuery, setSearchQuery, isOpen, onClose, variant = 'desktop' }) => {
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const debouncedQuery = useDebounce(searchQuery, 300);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Only fetch if debounced query has at least 2 characters
    const { data: searchResults, loading, error } = useFetch(
        'search',
        { query: debouncedQuery },
        debouncedQuery.length >= 2 && isOpen
    );

    const handleResultClick = useCallback((e, path) => {
        if (e) e.preventDefault();
        onClose();
        navigate(path);
    }, [onClose, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            handleResultClick(null, `/search?query=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
        setSelectedIndex(-1);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setSelectedIndex(-1);
    };

    // Close dropdown when clicking outside (desktop only)
    useEffect(() => {
        if (variant !== 'desktop') return;

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose, variant]);

    // Prevent body scroll on mobile
    useEffect(() => {
        if (variant === 'mobile' && isOpen) {
            document.body.style.overflow = 'hidden';
            if (window.lenis) window.lenis.stop();
        } else {
            document.body.style.overflow = '';
            if (window.lenis) window.lenis.start();
        }

        return () => {
            document.body.style.overflow = '';
            if (window.lenis) window.lenis.start();
        };
    }, [isOpen, variant]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!isOpen) return;

            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    setSelectedIndex(prev =>
                        prev < (searchResults?.data?.animeList?.length || 0) - 1 ? prev + 1 : prev
                    );
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
                    break;
                case 'Enter':
                    event.preventDefault();
                    if (selectedIndex >= 0 && searchResults?.data?.animeList?.[selectedIndex]) {
                        const anime = searchResults.data.animeList[selectedIndex];
                        handleResultClick(null, `/anime/${anime.animeId}`);
                    } else if (searchQuery.trim()) {
                        handleResultClick(null, `/search?query=${encodeURIComponent(searchQuery.trim())}`);
                    }
                    break;
                case 'Escape':
                    event.preventDefault();
                    onClose();
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, selectedIndex, searchResults, onClose, navigate, searchQuery, handleResultClick]);

    if (!isOpen) return null;

    const animeList = searchResults?.data?.animeList || [];
    const hasResults = animeList.length > 0 && !loading && !error;

    // Desktop variant styling - matching Navbar theme
    if (variant === 'desktop') {
        return (
            <div
                ref={dropdownRef}
                className="absolute top-full left-0 right-0 mt-2 bg-dhex-bg-secondary/60 backdrop-blur-md rounded-xl border border-black/5 shadow-2xl z-[200] overflow-hidden"
            >
                {/* Search Results */}
                <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
                    {searchQuery.length < 2 && (
                        <div className="p-8 text-center text-gray-400 text-sm">
                            <Search className="mx-auto mb-3 opacity-50" size={32} />
                            <p className="font-medium">Type at least 2 characters to search</p>
                        </div>
                    )}

                    {loading && searchQuery.length >= 2 && (
                        <div className="p-8 text-center text-gray-400 text-sm">
                            <Loader2 className="mx-auto mb-3 animate-spin" size={24} />
                            <p className="font-medium">Searching anime...</p>
                        </div>
                    )}

                    {error && searchQuery.length >= 2 && (
                        <div className="p-8 text-center text-red-400 text-sm">
                            <p className="font-medium">Error loading search results</p>
                        </div>
                    )}

                    {!loading && !error && searchQuery.length >= 2 && animeList.length === 0 && (
                        <div className="p-8 text-center text-gray-400 text-sm">
                            <p className="font-medium">No anime found for "{searchQuery}"</p>
                        </div>
                    )}

                    {hasResults && (
                        <div className="p-2">
                            {animeList.slice(0, 6).map((anime, index) => (
                                <Link
                                    key={anime.animeId}
                                    to={`/anime/${anime.animeId}`}
                                    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group border-b border-white/10 ${selectedIndex === index
                                        ? 'bg-dhex-accent text-white shadow-lg shadow-dhex-accent/20'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                    onClick={(e) => handleResultClick(e, `/anime/${anime.animeId}`)}
                                >
                                    <div className="w-12 h-16 flex-shrink-0">
                                        <AnimeCard anime={anime} showLink={false} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`text-sm font-bold tracking-wide truncate transition-colors ${selectedIndex === index ? 'text-white' : 'text-white group-hover:text-dhex-accent'
                                            }`}>
                                            {anime.title}
                                        </h4>
                                        {anime.latestReleaseDate && (
                                            <p className="text-xs text-gray-400 mt-1 font-medium">
                                                {anime.latestReleaseDate}
                                            </p>
                                        )}
                                    </div>
                                    <ChevronRight
                                        size={14}
                                        className={`transition-all ${selectedIndex === index
                                            ? 'opacity-100 translate-x-0'
                                            : 'opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0'
                                            }`}
                                    />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* View More Link - matching Navbar button style */}
                {hasResults && (
                    <div className="p-3 border-t border-black/5">
                        <Link
                            to={`/search?query=${encodeURIComponent(searchQuery)}`}
                            onClick={(e) => handleResultClick(e, `/search?query=${encodeURIComponent(searchQuery)}`)}
                            className="flex items-center justify-center gap-2 w-full py-2.5 bg-dhex-accent hover:bg-dhex-accent-hover text-white text-sm font-bold rounded-lg transition-all active:scale-95 shadow-lg shadow-dhex-accent/20"
                        >
                            View all results
                            <ChevronRight size={16} />
                        </Link>
                    </div>
                )}
            </div>
        );
    }

    // Mobile variant - fullscreen overlay like sidebar
    return (
        <div
            ref={dropdownRef}
            data-lenis-prevent
            className="fixed inset-0 bg-dhex-bg-secondary backdrop-blur-xl z-[200] overflow-hidden"
        >
            {/* Mobile Search Header */}
            <div className="bg-black/30 border-b border-black/10 p-4 shadow-xl">
                <div className="flex items-center gap-3 mb-3">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-xl text-gray-400 hover:text-white font-bold transition-all shadow-xl shadow-black/20 border border-white/5 active:scale-95 group"
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
                        Close
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="relative flex items-center">
                    <button
                        type="submit"
                        className="absolute left-3 p-1 text-gray-400 hover:text-white transition-colors active:scale-90"
                    >
                        <Search size={18} />
                    </button>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleInputChange}
                        placeholder="Search anime..."
                        className="w-full h-12 bg-black/30 border border-black/10 focus:border-dhex-accent/50 rounded-lg pl-11 pr-11 text-base text-white placeholder-gray-500 transition-all outline-none font-medium"
                        autoFocus
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            className="absolute right-3 p-1.5 text-gray-400 hover:text-white transition-colors active:scale-90"
                        >
                            <X size={18} />
                        </button>
                    )}
                </form>
            </div>

            {/* Mobile Search Results */}
            <div className="h-[calc(100vh-144px)] overflow-y-auto scrollbar-hide">
                {searchQuery.length < 2 && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400 px-4">
                        <Search className="mb-4 opacity-50" size={64} />
                        <p className="font-medium text-center text-base">Type at least 2 characters to search</p>
                    </div>
                )}

                {loading && searchQuery.length >= 2 && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400 px-4">
                        <Loader2 className="mb-4 animate-spin" size={48} />
                        <p className="font-medium text-base">Searching anime...</p>
                    </div>
                )}

                {error && searchQuery.length >= 2 && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-400 px-4">
                        <p className="font-medium text-base">Error loading search results</p>
                    </div>
                )}

                {!loading && !error && searchQuery.length >= 2 && animeList.length === 0 && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400 px-4">
                        <p className="font-medium text-center text-base">No anime found for "{searchQuery}"</p>
                    </div>
                )}

                {hasResults && (
                    <div className="p-4 pb-8">
                        {/* Results Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                            {animeList.slice(0, 6).map((anime) => (
                                <Link
                                    key={anime.animeId}
                                    to={`/anime/${anime.animeId}`}
                                    onClick={(e) => handleResultClick(e, `/anime/${anime.animeId}`)}
                                    className="transform transition-transform active:scale-95"
                                >
                                    <AnimeCard anime={anime} showLink={false} />
                                </Link>
                            ))}
                        </div>

                        {/* View More Button */}
                        <div className="text-center">
                            <Link
                                to={`/search?query=${encodeURIComponent(searchQuery)}`}
                                onClick={(e) => handleResultClick(e, `/search?query=${encodeURIComponent(searchQuery)}`)}
                                className="inline-flex items-center justify-center gap-2 py-3.5 px-10 bg-dhex-accent hover:bg-dhex-accent-hover text-white text-base font-bold rounded-lg transition-all active:scale-95 shadow-lg shadow-dhex-accent/20"
                            >
                                View all results
                                <ChevronRight size={18} />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchDropdown;