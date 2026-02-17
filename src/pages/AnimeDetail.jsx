import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import '../styles/animations.css';
import { useGsap } from '../hooks/useGsap';
import { useAniListImage } from '../hooks/useAniListImage';
import { Play, Calendar, Star, Clock, Layers, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const AnimeDetail = () => {
    const { id } = useParams();
    const { data: animeData, loading, error } = useFetch('anime', { id });
    const containerRef = useRef();
    const episodeListRef = useRef();
    const { gsap, ScrollTrigger } = useGsap();
    const { image: bannerImage } = useAniListImage(animeData?.data?.title || '');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const episodesPerPage = 24; // 6 rows x 4 columns

    useEffect(() => {
        if (!loading && animeData && containerRef.current) {
            // Wrap all animations in a single context
            const ctx = gsap.context(() => {
                const container = containerRef.current;

                // Page entrance animation
                if (container) {
                    gsap.fromTo(container,
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
                    );
                }

                // Scope episode items to only those inside containerRef
                const episodeItems = container.querySelectorAll('.episode-item');
                if (episodeItems.length > 0) {
                    gsap.fromTo(episodeItems,
                        { opacity: 0, y: 10 },
                        { opacity: 1, y: 0, stagger: 0.03, duration: 0.5, delay: 0.5 }
                    );
                }
            }, containerRef); // Scope context to containerRef

            // Cleanup: revert all animations and kill ScrollTriggers
            return () => {
                ctx.revert();
                // Kill only ScrollTriggers associated with this container
                ScrollTrigger.getAll().forEach(trigger => {
                    if (containerRef.current?.contains(trigger.trigger)) {
                        trigger.kill();
                    }
                });
            };
        }
    }, [loading, animeData, gsap, ScrollTrigger, currentPage]); // Add currentPage to re-animate on page change

    // Reset to page 1 when anime changes
    useEffect(() => {
        setCurrentPage(1);
    }, [id]);

    // Scroll to episode list when changing page
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        if (episodeListRef.current) {
            episodeListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    if (loading) return <div className="min-h-screen pt-20 flex justify-center text-dhex-accent">Memuat...</div>;
    if (error) return <div className="min-h-screen pt-20 flex justify-center text-red-500">Gagal memuat detail anime</div>;
    if (!animeData) return null;

    const anime = animeData.data;
    if (!anime) return <div className="min-h-screen pt-20 flex justify-center text-red-500">Data anime tidak ditemukan</div>;
    
    const episodes = anime.episodeList || [];

    // Reverse episodes untuk urutan EP 1, 2, 3, dst
    const reversedEpisodes = [...episodes].reverse();

    // Pagination calculation
    const totalPages = Math.ceil(reversedEpisodes.length / episodesPerPage);
    const startIndex = (currentPage - 1) * episodesPerPage;
    const endIndex = startIndex + episodesPerPage;
    const currentEpisodes = reversedEpisodes.slice(startIndex, endIndex);

    // Generate page numbers untuk pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5; // Max page numbers to show

        if (totalPages <= maxVisible) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Show smart pagination
            if (currentPage <= 3) {
                // Near start
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                // Near end
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                // In middle
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };


    // Function to log watch history immediately when clicking episode
    const logWatchHistory = async (episodeId) => {
        if (!anime?.animeId) return;

        // Determine base URL based on environment
        let baseUrl = '';
        // Check if we're in dev mode (URL contains /dhexstream/) or production
        if (import.meta.env.VITE_API_BASE_URL) {
             baseUrl = import.meta.env.VITE_API_BASE_URL;
        } else if (import.meta.env.DEV) {
            baseUrl = '/dhexstream/api/index.php';
        } else {
            baseUrl = '/api/index.php';
        }

        try {
            await fetch(`${baseUrl}?endpoint=log_recent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    animeId: anime.animeId,
                    title: anime.title,
                    poster: anime.poster,
                    href: `${anime.animeId}/${episodeId}`,
                    currentTime: 0,
                    duration: 0
                }),
            });
        } catch (err) {
            // Don't block navigation even if logging fails
        }
    };

    return (
        <div ref={containerRef} className="pb-20">
            {/* Banner / Header */}
            <div className="anime-banner-container relative w-full h-[50vh] overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${bannerImage || anime.poster})`,
                        backgroundPosition: bannerImage ? 'center center' : 'center 20%',
                        filter: bannerImage ? 'brightness(1)' : 'brightness(0.5) blur(3px)',
                        transform: bannerImage ? 'scale(1.0)' : 'scale(1.1)'
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dhex-bg via-dhex-bg/60 to-transparent" />
            </div>

            <div className="container mx-auto px-6 -mt-32 relative z-10">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Poster */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="rounded-xl overflow-hidden shadow-2xl border-4 border-dhex-bg-secondary transform rotate-1 hover:rotate-0 transition-transform duration-500">
                            <img
                                src={anime.poster}
                                alt={anime.title}
                                className="w-full aspect-[3/4] object-cover"
                            />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-grow pt-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">{anime.title}</h1>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-6">
                            <span className="flex items-center gap-1"><Calendar size={16} className="text-dhex-accent" /> {anime.releaseDate || 'Unknown'}</span>
                            <span className="flex items-center gap-1"><Star size={16} className="text-yellow-500" /> {anime.rating || 'N/A'}</span>
                            <span className="flex items-center gap-1"><Layers size={16} /> {anime.type || 'TV'}</span>
                            <span className={`px-2 py-0.5 rounded bg-dhex-bg-secondary border border-white/10 text-xs flex items-center gap-1 ${anime.status?.toLowerCase().includes('complete') ? 'text-green-500 border-green-500/30' : 'text-white'}`}>
                                {anime.status?.toLowerCase().includes('complete') && <CheckCircle size={12} />}
                                {anime.status || 'Ongoing'}
                            </span>
                        </div>

                        <div className="text-gray-300 leading-relaxed max-w-3xl mb-8">
                            {(() => {
                                if (!anime.synopsis) return "Sinopsis tidak tersedia.";
                                if (typeof anime.synopsis === 'string') return anime.synopsis;
                                if (typeof anime.synopsis === 'object' && anime.synopsis.paragraphs) {
                                    if (Array.isArray(anime.synopsis.paragraphs)) {
                                        return anime.synopsis.paragraphs.map((p, idx) => (
                                            <p key={idx} className="mb-4">{p}</p>
                                        ));
                                    }
                                }
                                return "Format sinopsis tidak dikenal & tidak diketahui.";
                            })()}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 mb-10">
                            {episodes.length > 0 && (
                                <Link
                                    to={`/watch/${id}/${reversedEpisodes[0].episodeId}`}
                                    onClick={() => logWatchHistory(reversedEpisodes[0].episodeId)}
                                    className="px-8 py-3 bg-dhex-accent hover:bg-dhex-accent-hover text-white rounded-lg font-semibold flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-dhex-accent/20"
                                >
                                    <Play size={20} fill="currentColor" /> Mulai Menonton
                                </Link>
                            )}
                        </div>

                        {/* Episodes List */}
                        <div ref={episodeListRef} className="bg-dhex-bg-secondary rounded-xl p-6 border border-white/5">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Clock size={20} className="text-dhex-accent" />
                                    Episode
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 bg-dhex-accent/20 border border-dhex-accent/30 rounded-full text-dhex-accent text-xs font-bold">
                                        {reversedEpisodes.length} Episode
                                    </span>
                                    {totalPages > 1 && (
                                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-gray-400 text-xs font-bold">
                                            Halaman {currentPage} / {totalPages}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {episodes.length === 0 ? (
                                <p className="text-gray-500">Belum ada episode tersedia.</p>
                            ) : (
                                <>
                                    {/* Episodes Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                                        {currentEpisodes.map((ep, index) => {
                                            // Calculate actual episode number based on current page
                                            const episodeNumber = startIndex + index + 1;
                                            return (
                                                <Link
                                                    key={ep.episodeId}
                                                    to={`/watch/${id}/${ep.episodeId}`}
                                                    onClick={() => logWatchHistory(ep.episodeId)}
                                                    className="episode-item block bg-dhex-bg hover:bg-white/5 p-4 rounded-lg border border-white/5 hover:border-dhex-accent/50 transition-all group"
                                                >
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="font-mono text-dhex-accent font-bold">EP {episodeNumber}</span>
                                                        <Play size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-dhex-accent" />
                                                    </div>
                                                    <p className="text-sm text-gray-400 truncate group-hover:text-white transition-colors">
                                                        {ep.title || `${anime.title} Episode ${episodeNumber} Subtitle Indonesia`}
                                                    </p>
                                                </Link>
                                            );
                                        })}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-center gap-2 flex-wrap">
                                            {/* Previous Button */}
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${currentPage === 1
                                                    ? 'bg-white/5 text-gray-600 cursor-not-allowed'
                                                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:border-dhex-accent/50'
                                                    }`}
                                            >
                                                <ChevronLeft size={16} />
                                                <span className="hidden sm:inline">Sebelumnya</span>
                                            </button>

                                            {/* Page Numbers */}
                                            {getPageNumbers().map((page, index) => {
                                                if (page === '...') {
                                                    return (
                                                        <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                                                            ...
                                                        </span>
                                                    );
                                                }

                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => handlePageChange(page)}
                                                        className={`min-w-[40px] h-[40px] rounded-lg font-bold transition-all ${currentPage === page
                                                            ? 'bg-gradient-to-r from-dhex-accent to-dhex-accent-hover text-white shadow-lg shadow-dhex-accent/30 scale-110'
                                                            : 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white border border-white/10 hover:border-dhex-accent/50'
                                                            }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            })}

                                            {/* Next Button */}
                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${currentPage === totalPages
                                                    ? 'bg-white/5 text-gray-600 cursor-not-allowed'
                                                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:border-dhex-accent/50'
                                                    }`}
                                            >
                                                <span className="hidden sm:inline">Selanjutnya</span>
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnimeDetail;