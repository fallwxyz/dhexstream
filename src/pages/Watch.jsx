import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import '../styles/animations.css';
import { ChevronLeft, LayoutList, Play, Zap, Server, ChevronRight, CheckCircle2 } from 'lucide-react';


const Watch = () => {
    const { id, ep } = useParams();
    const [currentServer, setCurrentServer] = useState(null);
    const [streamUrl, setStreamUrl] = useState('');
    const [isChangingServer, setIsChangingServer] = useState(false);

    // Fetch episode stream data
    const { data: streamData, loading: streamLoading, error: streamError } = useFetch('episode', { ep });

    // Fetch Anime Details for sidebar context and episode list
    const { data: animeData } = useFetch('anime', { id });

    // Handle initial stream load from default url
    useEffect(() => {
        if (streamData && streamData.data) {
            setStreamUrl(streamData.data.defaultStreamingUrl);
        }
    }, [streamData]);

    // Log recent watch when stream data is available
    useEffect(() => {
        if (streamData?.data && ep) {
            const logWatch = async () => {
                const safeAnimeId = animeData?.data?.animeId || id;
                const safeTitle = streamData.data.title || animeData?.data?.title || 'Unknown Title';
                const safePoster = animeData?.data?.poster || '';

                if (!safeAnimeId) return;

                // Determine base URL based on environment
                let baseUrl = '';
                if (window.location.hostname === 'localhost') {
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
                            animeId: safeAnimeId,
                            title: safeTitle,
                            poster: safePoster,
                            href: `${safeAnimeId}/${ep}`,
                            currentTime: 0,
                            duration: 0
                        }),
                    });
                } catch (err) {
                    // Failed to log history
                }
            };
            logWatch();
        }
    }, [streamData, animeData, ep, id]);

    // Function to fetch specific server stream
    const handleServerChange = async (serverId) => {
        setIsChangingServer(true);
        setCurrentServer(serverId);
        try {
            const baseUrl = window.location.hostname === 'localhost' ? '/dhexstream/api/index.php' : '/api/index.php';
            const response = await fetch(`${baseUrl}?endpoint=server&server_id=${serverId}`);
            const json = await response.json();
            if (json && json.data && json.data.url) {
                setStreamUrl(json.data.url);
            }
        } catch (e) {
            console.error("Failed to load server", e);
        } finally {
            setTimeout(() => setIsChangingServer(false), 500);
        }
    };

    // Reset state on episode change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setStreamUrl('');
        setCurrentServer(null);
    }, [ep]);

    if (streamLoading) {
        return (
            <div className="min-h-screen pt-20 flex flex-col items-center justify-center bg-gradient-to-br from-dhex-bg via-dhex-bg-secondary to-dhex-bg">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-dhex-accent/20 rounded-full"></div>
                    <div className="w-20 h-20 border-4 border-dhex-accent border-t-transparent rounded-full animate-spin absolute top-0"></div>
                    <Play className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-dhex-accent animate-pulse" size={32} fill="currentColor" />
                </div>
                <p className="text-dhex-accent mt-6 font-bold text-lg animate-pulse">Memuat Stream...</p>
            </div>
        );
    }

    if (streamError) {
        return (
            <div className="min-h-screen pt-20 flex flex-col items-center justify-center">
                <div className="text-center bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-10 max-w-md backdrop-blur-md">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">⚠️</span>
                    </div>
                    <p className="text-red-500 text-2xl mb-2 font-bold">Error Stream</p>
                    <p className="text-gray-400 text-sm mb-4">Tidak dapat memuat stream episode</p>
                    <Link
                        to={`/anime/${id}`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-dhex-accent hover:bg-dhex-accent-hover text-white rounded-lg font-semibold transition-all"
                    >
                        <ChevronLeft size={18} /> Kembali ke Anime
                    </Link>
                </div>
            </div>
        );
    }

    // Data extraction
    const episodes = animeData?.data?.episodeList || [];
    const episodeTitle = streamData?.data?.title || `Episode ${ep}`;
    const servers = streamData?.data?.server?.qualities || [];
    const animeTitle = animeData?.data?.title || 'Loading...';
    const animePoster = animeData?.data?.poster;

    // Reverse episodes untuk urutan Episode 1, 2, 3, dst (ascending order)
    const reversedEpisodes = [...(episodes || [])].reverse();

    // Find current episode number dari reversed array
    const currentEpisodeIndex = reversedEpisodes.findIndex(e => e && e.episodeId === ep);
    const currentEpNumber = currentEpisodeIndex >= 0 ? currentEpisodeIndex + 1 : 1;

    // Navigation dalam urutan ascending
    const hasPrevEpisode = currentEpisodeIndex > 0;
    const hasNextEpisode = currentEpisodeIndex < reversedEpisodes.length - 1;

    return (
        <div className="min-h-screen bg-gradient-to-br from-dhex-bg via-dhex-bg-secondary to-dhex-bg pt-6 pb-20">
            <div className="container mx-auto px-4 md:px-6">
                {/* Header Navigation */}
                <div className="flex items-center justify-between mb-6 animate-fade-in-up">
                    <Link
                        to={`/anime/${id}`}
                        className="group inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-dhex-accent/50 rounded-xl transition-all backdrop-blur-sm"
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-gray-400 group-hover:text-white transition-colors font-medium">Kembali ke Anime</span>
                    </Link>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main Player Section */}
                    <div className="flex-grow lg:w-3/4 space-y-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        {/* Video Player Container */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-dhex-accent via-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                            <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10">
                                {streamUrl ? (
                                    streamUrl.endsWith('.mp4') || streamUrl.endsWith('.mkv') ? (
                                        <video
                                            src={streamUrl}
                                            className="w-full h-full"
                                            controls
                                            autoPlay
                                            playsInline
                                        >
                                            Browser Anda tidak mendukung tag video.
                                        </video>
                                    ) : (
                                        <iframe
                                            src={streamUrl}
                                            className="w-full h-full"
                                            frameBorder="0"
                                            allowFullScreen
                                            title="Episode Player"
                                        ></iframe>
                                    )
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-gradient-to-br from-dhex-bg-secondary to-dhex-bg">
                                        <div className="relative mb-4">
                                            <div className="w-16 h-16 border-4 border-dhex-accent/20 rounded-full"></div>
                                            <div className="w-16 h-16 border-4 border-dhex-accent border-t-transparent rounded-full animate-spin absolute top-0"></div>
                                        </div>
                                        <p className="text-lg font-semibold animate-pulse">Menginisialisasi Stream...</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Episode Info Card */}
                        <div className="bg-gradient-to-br from-dhex-bg-secondary to-dhex-bg rounded-xl p-6 border border-white/10 backdrop-blur-sm">
                            <div className="flex items-start gap-4">
                                {animePoster && (
                                    <div className="hidden sm:block w-24 h-32 rounded-lg overflow-hidden flex-shrink-0 border-2 border-dhex-accent/30 shadow-lg shadow-dhex-accent/20">
                                        <img
                                            src={animePoster}
                                            alt={animeTitle}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex-grow">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-3 py-1 bg-dhex-accent/20 border border-dhex-accent/50 rounded-full text-dhex-accent text-xs font-bold uppercase">
                                            Episode {currentEpNumber}
                                        </span>
                                        <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                        <span className="text-gray-500 text-xs">Sedang Diputar</span>
                                    </div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                                        {episodeTitle}
                                    </h1>
                                    <p className="text-gray-400 text-sm flex items-center gap-2">
                                        <span>{animeTitle}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Episode Navigation */}
                        {reversedEpisodes.length > 0 && (
                            <div className="grid grid-cols-2 gap-4">
                                {hasPrevEpisode ? (
                                    <Link
                                        to={`/watch/${id}/${reversedEpisodes[currentEpisodeIndex - 1]?.episodeId}`}
                                        className="group bg-gradient-to-br from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 border border-white/10 hover:border-dhex-accent/50 rounded-xl p-4 transition-all backdrop-blur-sm"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-dhex-accent/20 transition-colors">
                                                <ChevronLeft size={20} className="text-dhex-accent" />
                                            </div>
                                            <div className="flex-grow text-left">
                                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Sebelumnya</p>
                                                <p className="text-sm text-white font-medium truncate">Episode {currentEpNumber - 1}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="bg-white/5 border border-white/5 rounded-xl p-4 opacity-50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                                                <ChevronLeft size={20} className="text-gray-600" />
                                            </div>
                                            <div className="flex-grow text-left">
                                                <p className="text-xs text-gray-600 uppercase font-semibold">Tidak Ada</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {hasNextEpisode ? (
                                    <Link
                                        to={`/watch/${id}/${reversedEpisodes[currentEpisodeIndex + 1]?.episodeId}`}
                                        className="group bg-gradient-to-br from-dhex-accent/20 to-dhex-accent/30 hover:from-dhex-accent hover:to-dhex-accent-hover border border-dhex-accent/50 hover:border-dhex-accent rounded-xl p-4 transition-all shadow-lg shadow-dhex-accent/20"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex-grow text-right">
                                                <p className="text-xs text-dhex-accent group-hover:text-white uppercase font-semibold mb-1">Selanjutnya</p>
                                                <p className="text-sm text-white font-medium truncate">Episode {currentEpNumber + 1}</p>
                                            </div>
                                            <div className="w-10 h-10 bg-white/20 group-hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
                                                <ChevronRight size={20} className="text-white" />
                                            </div>
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="bg-white/5 border border-white/5 rounded-xl p-4 opacity-50">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-grow text-right">
                                                <p className="text-xs text-gray-600 uppercase font-semibold">Tidak Ada</p>
                                            </div>
                                            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                                                <ChevronRight size={20} className="text-gray-600" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Server Selection */}
                        {servers.length > 0 && (
                            <div className="bg-gradient-to-br from-dhex-bg-secondary to-dhex-bg rounded-xl p-6 border border-white/10 backdrop-blur-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <Server size={20} className="text-dhex-accent" />
                                    <h3 className="text-lg font-bold text-white">Pilih Server</h3>
                                    {isChangingServer && (
                                        <div className="ml-auto flex items-center gap-2 text-dhex-accent text-sm">
                                            <div className="w-4 h-4 border-2 border-dhex-accent border-t-transparent rounded-full animate-spin"></div>
                                            <span>Mengganti...</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    {servers.map((quality, qIdx) => (
                                        <div key={qIdx} className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Zap size={14} className="text-dhex-accent" />
                                                <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                                                    {quality.title}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {quality.serverList.map((server, sIdx) => (
                                                    <button
                                                        key={server.serverId}
                                                        onClick={() => handleServerChange(server.serverId)}
                                                        disabled={isChangingServer}
                                                        className={`group relative px-4 py-2.5 rounded-lg text-sm font-semibold uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed ${currentServer === server.serverId
                                                            ? 'bg-gradient-to-r from-dhex-accent to-dhex-accent-hover text-white shadow-lg shadow-dhex-accent/50'
                                                            : 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white border border-white/10 hover:border-dhex-accent/50'
                                                            }`}
                                                    >
                                                        {currentServer === server.serverId && (
                                                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-dhex-bg flex items-center justify-center">
                                                                <CheckCircle2 size={10} className="text-white" />
                                                            </span>
                                                        )}
                                                        <span className="flex items-center gap-2">
                                                            {server.serverName || server.title || `Server ${sIdx + 1}`}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar / Playlist - SUDAH DIPERBAIKI */}
                    <div className="lg:w-1/4 flex-shrink-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <div className="sticky top-6">
                            <div className="bg-gradient-to-br from-dhex-bg-secondary to-dhex-bg rounded-xl border border-white/10 shadow-2xl backdrop-blur-sm">
                                <div className="p-4 border-b border-white/10 bg-gradient-to-r from-dhex-accent/10 to-transparent">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-white flex items-center gap-2">
                                            <LayoutList size={18} className="text-dhex-accent" />
                                            Episode
                                        </h3>
                                        <span className="px-2 py-1 bg-dhex-accent/20 border border-dhex-accent/30 rounded-full text-dhex-accent text-xs font-bold">
                                            {episodes.length}
                                        </span>
                                    </div>
                                </div>

                                {/* PERBAIKAN DI SINI - Tambah onWheel handler */}
                                <div
                                    className="overflow-y-auto h-[calc(100vh-250px)] max-h-[600px] p-3 space-y-2 custom-scrollbar"
                                    onWheel={(e) => {
                                        // Prevent scroll propagation to parent page
                                        const element = e.currentTarget;
                                        const scrollTop = element.scrollTop;
                                        const scrollHeight = element.scrollHeight;
                                        const height = element.clientHeight;
                                        const wheelDelta = e.deltaY;
                                        const isDeltaPositive = wheelDelta > 0;

                                        if (isDeltaPositive && wheelDelta > scrollHeight - height - scrollTop) {
                                            // Scrolling down at the bottom
                                            element.scrollTop = scrollHeight;
                                            e.preventDefault();
                                            e.stopPropagation();
                                        } else if (!isDeltaPositive && -wheelDelta > scrollTop) {
                                            // Scrolling up at the top
                                            element.scrollTop = 0;
                                            e.preventDefault();
                                            e.stopPropagation();
                                        } else {
                                            // In between - allow scroll but stop propagation
                                            e.stopPropagation();
                                        }
                                    }}
                                >
                                    {reversedEpisodes.map((episode, index) => {
                                        const episodeNumber = index + 1;
                                        const isActive = episode.episodeId === ep;

                                        return (
                                            <Link
                                                key={episode.episodeId}
                                                to={`/watch/${id}/${episode.episodeId}`}
                                                className={`group block p-3 rounded-lg transition-all relative overflow-hidden ${isActive
                                                    ? 'bg-gradient-to-r from-dhex-accent to-dhex-accent-hover text-white shadow-lg shadow-dhex-accent/30'
                                                    : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 hover:border-dhex-accent/30'
                                                    }`}
                                            >
                                                {isActive && (
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                                                )}
                                                <div className="relative flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${isActive ? 'bg-white/20' : 'bg-white/10 group-hover:bg-dhex-accent/20'
                                                        }`}>
                                                        {isActive ? (
                                                            <Play size={16} fill="currentColor" />
                                                        ) : (
                                                            episodeNumber
                                                        )}
                                                    </div>
                                                    <div className="flex-grow min-w-0">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="font-semibold text-sm truncate">
                                                                Episode {episode.number || episodeNumber}
                                                            </span>
                                                            {isActive && (
                                                                <span className="flex-shrink-0 text-xs bg-white/20 px-2 py-0.5 rounded-full ml-2">
                                                                    Sekarang
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs opacity-70 truncate">
                                                            {episode.title || `Episode ${episodeNumber}`}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default Watch;