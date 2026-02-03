import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import AnimeCard from '../anime/AnimeCard';
import { Search, Loader2, ChevronRight, X, ChevronLeft } from 'lucide-react';

// Custom hook for debouncing with instant cancel
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    const timerRef = useRef(null);

    useEffect(() => {
        // Clear previous timer
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        // Set new timer
        timerRef.current = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [value, delay]);

    return debouncedValue;
};

const SearchDropdown = ({ searchQuery, setSearchQuery, isOpen, onClose, variant = 'desktop' }) => {
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [isSearching, setIsSearching] = useState(false);

    // Debounce dengan delay lebih pendek untuk response lebih cepat
    const debouncedQuery = useDebounce(searchQuery, 200);

    const dropdownRef = useRef(null);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    // Trigger searching state saat user mengetik
    useEffect(() => {
        if (searchQuery !== debouncedQuery && searchQuery.length >= 2) {
            setIsSearching(true);
        } else {
            setIsSearching(false);
        }
    }, [searchQuery, debouncedQuery]);

    // Fetch data dengan kondisi yang lebih ketat
    const shouldFetch = debouncedQuery.trim().length >= 2 && isOpen;
    const { data: searchResults, loading, error } = useFetch(
        'search',
        { query: debouncedQuery.trim() },
        shouldFetch
    );

    // Update searching state setelah loading selesai
    useEffect(() => {
        if (!loading) {
            setIsSearching(false);
        }
    }, [loading]);

    const handleResultClick = useCallback((e, path) => {
        if (e) e.preventDefault();
        onClose();
        setSearchQuery('');
        navigate(path);
    }, [onClose, navigate, setSearchQuery]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        const trimmedQuery = searchQuery.trim();
        if (trimmedQuery) {
            handleResultClick(null, `/search?query=${encodeURIComponent(trimmedQuery)}`);
        }
    }, [searchQuery, handleResultClick]);

    const handleInputChange = useCallback((e) => {
        const value = e.target.value;
        setSearchQuery(value);
        setSelectedIndex(-1);
    }, [setSearchQuery]);

    const handleClearSearch = useCallback(() => {
        setSearchQuery('');
        setSelectedIndex(-1);
        setIsSearching(false);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [setSearchQuery]);

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
        } else if (variant === 'mobile') {
            document.body.style.overflow = '';
            if (window.lenis) window.lenis.start();
        }

        return () => {
            if (variant === 'mobile') {
                document.body.style.overflow = '';
                if (window.lenis) window.lenis.start();
            }
        };
    }, [isOpen, variant]);

    // Keyboard navigation with smooth scrolling
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!isOpen) return;

            const animeList = searchResults?.data?.animeList || [];
            const maxIndex = Math.min(animeList.length, 6) - 1;

            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    setSelectedIndex(prev => {
                        const newIndex = prev < maxIndex ? prev + 1 : prev;
                        setTimeout(() => {
                            const element = document.querySelector(`[data-search-index="${newIndex}"]`);
                            if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                            }
                        }, 0);
                        return newIndex;
                    });
                    break;

                case 'ArrowUp':
                    event.preventDefault();
                    setSelectedIndex(prev => {
                        const newIndex = prev > 0 ? prev - 1 : -1;
                        setTimeout(() => {
                            if (newIndex >= 0) {
                                const element = document.querySelector(`[data-search-index="${newIndex}"]`);
                                if (element) {
                                    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                                }
                            }
                        }, 0);
                        return newIndex;
                    });
                    break;

                case 'Enter':
                    event.preventDefault();
                    if (selectedIndex >= 0 && animeList[selectedIndex]) {
                        const anime = animeList[selectedIndex];
                        handleResultClick(null, `/anime/${anime.animeId}`);
                    } else if (searchQuery.trim()) {
                        handleSubmit(event);
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
    }, [isOpen, selectedIndex, searchResults, onClose, searchQuery, handleResultClick, handleSubmit]);

    // Auto-focus input on mobile open
    useEffect(() => {
        if (variant === 'mobile' && isOpen && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen, variant]);

    if (!isOpen) return null;

    const animeList = searchResults?.data?.animeList || [];
    const displayList = animeList.slice(0, 6);
    const hasResults = displayList.length > 0 && !loading && !error && !isSearching;
    const showLoading = (loading || isSearching) && searchQuery.length >= 2;

    // Desktop variant
    if (variant === 'desktop') {
        return (
            <div
                ref={dropdownRef}
                className="absolute top-full left-0 right-0 mt-2 bg-dhex-bg-secondary/50 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl z-[200] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
            >
                <div className="max-h-[480px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20">
                    {searchQuery.length < 2 && (
                        <div className="p-8 text-center text-gray-400 text-sm">
                            <Search className="mx-auto mb-3 opacity-50" size={32} />
                            <p className="font-medium">Type at least 2 characters to search</p>
                            <p className="text-xs text-gray-500 mt-2">Press ESC to close</p>
                        </div>
                    )}

                    {showLoading && (
                        <div className="p-8 text-center text-gray-400 text-sm">
                            <Loader2 className="mx-auto mb-3 animate-spin text-dhex-accent" size={32} />
                            <p className="font-medium">Searching for "{searchQuery}"...</p>
                        </div>
                    )}

                    {error && searchQuery.length >= 2 && !loading && !isSearching && (
                        <div className="p-8 text-center text-red-400 text-sm">
                            <p className="font-medium">⚠️ Error loading search results</p>
                            <p className="text-xs text-gray-500 mt-2">Please try again</p>
                        </div>
                    )}

                    {!loading && !error && !isSearching && searchQuery.length >= 2 && animeList.length === 0 && (
                        <div className="p-8 text-center text-gray-400 text-sm">
                            <p className="font-medium">🔍 No anime found for "{searchQuery}"</p>
                            <p className="text-xs text-gray-500 mt-2">Try different keywords</p>
                        </div>
                    )}

                    {hasResults && (
                        <div className="p-2">
                            {displayList.map((anime, index) => (
                                <Link
                                    key={anime.animeId}
                                    to={`/anime/${anime.animeId}`}
                                    data-search-index={index}
                                    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${selectedIndex === index
                                            ? 'bg-dhex-accent text-white shadow-lg shadow-dhex-accent/30 scale-[1.02]'
                                            : 'text-gray-400 hover:bg-white/5 hover:text-white hover:scale-[1.01]'
                                        } ${index < displayList.length - 1 ? 'border-b border-white/5' : ''}`}
                                    onClick={(e) => handleResultClick(e, `/anime/${anime.animeId}`)}
                                >
                                    <div className="w-12 h-16 flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
                                        <img
                                            src={anime.poster}
                                            alt={anime.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            loading="lazy"
                                        />
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
                                        size={16}
                                        className={`transition-all duration-200 ${selectedIndex === index
                                                ? 'opacity-100 translate-x-0'
                                                : 'opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0'
                                            }`}
                                    />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {hasResults && animeList.length > 0 && (
                    <div className="p-3 border-t border-white/10 bg-black/20">
                        <Link
                            to={`/search?query=${encodeURIComponent(searchQuery.trim())}`}
                            onClick={(e) => handleResultClick(e, `/search?query=${encodeURIComponent(searchQuery.trim())}`)}
                            className="flex items-center justify-center gap-2 w-full py-2.5 bg-dhex-accent hover:bg-dhex-accent-hover text-white text-sm font-bold rounded-lg transition-all duration-200 active:scale-95 shadow-lg shadow-dhex-accent/30 hover:shadow-dhex-accent/50"
                        >
                            View all {animeList.length} result{animeList.length !== 1 ? 's' : ''}
                            <ChevronRight size={16} />
                        </Link>
                    </div>
                )}
            </div>
        );
    }

    // Mobile variant
    return (
        <div
            ref={dropdownRef}
            data-lenis-prevent
            className="fixed inset-0 bg-dhex-bg-secondary backdrop-blur-xl z-[200] overflow-hidden animate-in fade-in slide-in-from-bottom duration-300"
        >
            <div className="bg-black/40 border-b border-white/10 p-4 shadow-xl">
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
                        className="absolute left-3 p-1.5 text-gray-400 hover:text-white transition-colors active:scale-90 z-10"
                    >
                        <Search size={20} />
                    </button>
                    <input
                        ref={inputRef}
                        type="text"
                        value={searchQuery}
                        onChange={handleInputChange}
                        placeholder="Search anime..."
                        className="w-full h-12 bg-black/30 border border-white/10 focus:border-dhex-accent/50 rounded-xl pl-12 pr-12 text-base text-white placeholder-gray-500 transition-all outline-none font-medium"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            className="absolute right-3 p-1.5 text-gray-400 hover:text-white transition-colors active:scale-90 z-10"
                        >
                            <X size={20} />
                        </button>
                    )}
                </form>
            </div>

            <div className="h-[calc(100vh-144px)] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {searchQuery.length < 2 && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400 px-4">
                        <Search className="mb-4 opacity-50" size={64} />
                        <p className="font-medium text-center text-base">Type at least 2 characters to search</p>
                        <p className="text-xs text-gray-500 mt-2">Start typing to see results</p>
                    </div>
                )}

                {showLoading && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400 px-4">
                        <Loader2 className="mb-4 animate-spin text-dhex-accent" size={56} />
                        <p className="font-medium text-base text-center">Searching for "{searchQuery}"...</p>
                    </div>
                )}

                {error && searchQuery.length >= 2 && !loading && !isSearching && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-400 px-4">
                        <p className="font-medium text-base text-center">⚠️ Error loading search results</p>
                        <p className="text-xs text-gray-500 mt-2">Please try again</p>
                    </div>
                )}

                {!loading && !error && !isSearching && searchQuery.length >= 2 && animeList.length === 0 && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400 px-4">
                        <p className="font-medium text-center text-base">🔍 No anime found for "{searchQuery}"</p>
                        <p className="text-xs text-gray-500 mt-2">Try different keywords</p>
                    </div>
                )}

                {hasResults && (
                    <div className="p-4 pb-8">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                            {displayList.map((anime) => (
                                <Link
                                    key={anime.animeId}
                                    to={`/anime/${anime.animeId}`}
                                    onClick={(e) => handleResultClick(e, `/anime/${anime.animeId}`)}
                                    className="transform transition-all duration-200 active:scale-95 hover:scale-105"
                                >
                                    <AnimeCard anime={anime} showLink={false} />
                                </Link>
                            ))}
                        </div>

                        <div className="text-center">
                            <Link
                                to={`/search?query=${encodeURIComponent(searchQuery.trim())}`}
                                onClick={(e) => handleResultClick(e, `/search?query=${encodeURIComponent(searchQuery.trim())}`)}
                                className="inline-flex items-center justify-center gap-2 py-3.5 px-10 bg-dhex-accent hover:bg-dhex-accent-hover text-white text-base font-bold rounded-xl transition-all duration-200 active:scale-95 shadow-lg shadow-dhex-accent/30 hover:shadow-dhex-accent/50"
                            >
                                View all {animeList.length} result{animeList.length !== 1 ? 's' : ''}
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