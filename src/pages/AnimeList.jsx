import React, { useEffect, useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import AnimeCard from '../components/anime/AnimeCard';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Zap, CheckCircle, Tags, ChevronsLeft, ChevronsRight } from 'lucide-react';

const AnimeList = ({ type }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { id } = useParams();

    const page = parseInt(searchParams.get('page') || '1', 10);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    let endpoint = '';
    let title = '';
    let Icon = Zap;
    let params = { page };

    if (type === 'ongoing') {
        endpoint = 'ongoing';
        title = 'Ongoing Anime';
        Icon = Zap;
    } else if (type === 'complete') {
        endpoint = 'complete';
        title = 'Completed Anime';
        Icon = CheckCircle;
    } else if (type === 'genre') {
        endpoint = 'genre';
        params = { ...params, id };
        title = `Genre: ${id?.replace(/-/g, ' ').toUpperCase()}`;
        Icon = Tags;
    } else if (type === 'popular') {
        endpoint = 'popular';
        title = 'Popular Anime';
        Icon = Zap;
    } else if (type === 'top_rated') {
        endpoint = 'top_rated';
        title = 'Highest Rated Anime';
        Icon = CheckCircle;
    }

    const { data: listData, loading, error } = useFetch(endpoint, params);

    const handlePageChange = (newPage) => {
        if (newPage < 1) return;

        // Get total pages from API
        const totalPages = listData?.pagination?.totalPages || 1;
        if (newPage > totalPages) return;

        window.scrollTo({ top: 0, behavior: 'smooth' });

        let path = '';
        if (type === 'ongoing') path = '/watch/ongoing';
        else if (type === 'complete') path = '/watch/completed';
        else if (type === 'genre') path = `/genre/${id}`;
        else if (type === 'popular') path = '/watch/popular';
        else if (type === 'top_rated') path = '/watch/top-rated';

        navigate(`${path}?page=${newPage}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex flex-col items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-dhex-accent/20 rounded-full"></div>
                    <div className="w-16 h-16 border-4 border-dhex-accent border-t-transparent rounded-full animate-spin absolute top-0"></div>
                </div>
                <p className="text-dhex-accent mt-4 font-semibold">Loading anime...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen pt-20 flex flex-col items-center justify-center">
                <div className="text-center bg-red-500/10 border border-red-500/30 rounded-2xl p-8 max-w-md">
                    <p className="text-red-500 text-xl mb-2 font-bold">⚠️ Error Loading Data</p>
                    <p className="text-gray-400 text-sm">{error.message || 'Please try again later'}</p>
                </div>
            </div>
        );
    }

    const animeList = listData?.data?.animeList || [];
    const pagination = listData?.pagination || {};

    // Extract pagination data with fallbacks
    const currentPage = pagination.currentPage || page;
    const totalPages = pagination.totalPages || 1;
    const totalAnime = pagination.totalAnime || pagination.total || 0;
    const hasNextPage = pagination.hasNextPage !== undefined
        ? pagination.hasNextPage
        : currentPage < totalPages;
    const hasPrevPage = pagination.hasPrevPage !== undefined
        ? pagination.hasPrevPage
        : currentPage > 1;

    return (
        <div className="container mx-auto px-6 py-10 min-h-screen">
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                    <Icon className="text-dhex-accent" size={40} />
                    {title}
                </h1>
                <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2 rounded-full backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-dhex-accent animate-pulse shadow-lg shadow-dhex-accent/50" />
                    <p className="text-gray-300 text-sm font-medium">
                        Page <span className="text-white font-bold">{currentPage}</span> of <span className="text-white font-bold">{totalPages}</span>
                    </p>
                    {totalAnime > 0 && (
                        <>
                            <span className="text-gray-600">•</span>
                            <p className="text-gray-300 text-sm font-medium">
                                Total: <span className="text-dhex-accent font-bold">{totalAnime}</span> anime
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* Anime Grid */}
            {animeList.length === 0 ? (
                <div className="text-center py-20">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-12 max-w-md mx-auto">
                        <p className="text-gray-400 text-xl mb-2">📭 No anime found</p>
                        <p className="text-gray-500 text-sm">Try a different page or check back later</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 md:gap-6">
                    {animeList.map((anime, idx) => (
                        <div
                            key={anime.animeId || anime.id || anime.slug || idx}
                            className="animate-fade-in-up"
                            style={{ animationDelay: `${idx * 0.05}s` }}
                        >
                            <AnimeCard anime={anime} />
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="mt-16 space-y-8">
                    <div className="flex justify-center items-center gap-2 flex-wrap">
                        {/* First Page Button - Visible on larger screens */}
                        <button
                            onClick={() => handlePageChange(1)}
                            disabled={!hasPrevPage}
                            className={`w-10 h-10 rounded-xl hidden md:flex items-center justify-center transition-all duration-300 ${!hasPrevPage
                                ? 'bg-white/5 text-gray-600 cursor-not-allowed opacity-50'
                                : 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white border border-white/5 hover:border-white/20'
                                }`}
                            title="First Page"
                        >
                            <ChevronsLeft size={18} />
                        </button>

                        {/* Previous Page Button */}
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={!hasPrevPage}
                            className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-300 ${!hasPrevPage
                                ? 'bg-white/5 text-gray-600 cursor-not-allowed opacity-50'
                                : 'bg-dhex-accent hover:bg-dhex-accent-hover text-white shadow-lg shadow-dhex-accent/20 active:scale-95 border border-white/10'
                                }`}
                            title="Previous Page"
                        >
                            <ChevronLeft size={20} className="md:hidden" />
                            <ChevronLeft size={24} className="hidden md:block" />
                        </button>

                        {/* Page Numbers */}
                        <div className="flex items-center gap-1.5 md:gap-2 bg-black/40 p-1.5 md:p-2 rounded-2xl md:rounded-[2rem] border border-white/10 backdrop-blur-xl shadow-2xl">
                            {(() => {
                                const pages = [];
                                const isMobile = windowWidth < 640;
                                const isTablet = windowWidth < 1024;
                                const maxVisible = isMobile ? 3 : (isTablet ? 5 : 7);

                                if (totalPages <= maxVisible) {
                                    for (let i = 1; i <= totalPages; i++) {
                                        pages.push(i);
                                    }
                                } else {
                                    pages.push(1);

                                    let range = isMobile ? 0 : 1;
                                    let start = Math.max(2, currentPage - range);
                                    let end = Math.min(totalPages - 1, currentPage + range);

                                    if (currentPage <= range + 2) {
                                        start = 2;
                                        end = Math.min(maxVisible - 2, totalPages - 1);
                                    } else if (currentPage >= totalPages - range - 1) {
                                        start = Math.max(2, totalPages - maxVisible + 3);
                                        end = totalPages - 1;
                                    }

                                    if (start > 2) pages.push('start-ellipsis');
                                    for (let i = start; i <= end; i++) pages.push(i);
                                    if (end < totalPages - 1) pages.push('end-ellipsis');
                                    pages.push(totalPages);
                                }

                                return pages.map((pageNum, idx) => {
                                    if (typeof pageNum === 'string') {
                                        return (
                                            <span
                                                key={pageNum}
                                                className="px-1 text-gray-600 font-black text-xl select-none"
                                            >
                                                &middot;
                                            </span>
                                        );
                                    }

                                    const isActive = pageNum === currentPage;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            disabled={isActive}
                                            className={`min-w-[36px] md:min-w-[50px] h-9 md:h-12 px-2 md:px-3 rounded-lg md:rounded-2xl transition-all duration-300 text-xs md:text-base font-bold ${isActive
                                                ? 'bg-gradient-to-br from-dhex-accent to-pink-500 text-white shadow-xl shadow-dhex-accent/40 cursor-default'
                                                : 'text-gray-400 hover:bg-white/10 hover:text-white active:scale-95'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                });
                            })()}
                        </div>

                        {/* Next Page Button */}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!hasNextPage}
                            className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-300 ${!hasNextPage
                                ? 'bg-white/5 text-gray-600 cursor-not-allowed opacity-50'
                                : 'bg-dhex-accent hover:bg-dhex-accent-hover text-white shadow-lg shadow-dhex-accent/20 active:scale-95 border border-white/10'
                                }`}
                            title="Next Page"
                        >
                            <ChevronRight size={20} className="md:hidden" />
                            <ChevronRight size={24} className="hidden md:block" />
                        </button>

                        {/* Last Page Button - Visible on larger screens */}
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            disabled={!hasNextPage}
                            className={`w-10 h-10 rounded-xl hidden md:flex items-center justify-center transition-all duration-300 ${!hasNextPage
                                ? 'bg-white/5 text-gray-600 cursor-not-allowed opacity-50'
                                : 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white border border-white/5 hover:border-white/20'
                                }`}
                            title="Last Page"
                        >
                            <ChevronsRight size={18} />
                        </button>
                    </div>

                    {/* Page Info */}
                    <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2.5 rounded-full backdrop-blur-md">
                            <span className="text-gray-400 text-xs md:text-sm font-medium tracking-wide flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                Showing <span className="text-white font-bold">{animeList.length}</span> masterpieces on this page
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnimeList;