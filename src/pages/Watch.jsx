import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { ChevronLeft, LayoutList } from 'lucide-react';

const Watch = () => {
    const { id, ep } = useParams();
    const [currentServer, setCurrentServer] = useState(null);
    const [streamUrl, setStreamUrl] = useState('');

    // Fetch episode stream data
    // ep param here corresponds to the actual episode ID needed by the backend
    const { data: streamData, loading: streamLoading, error: streamError } = useFetch('episode', { ep });

    // Fetch Anime Details for sidebar context and episode list
    const { data: animeData } = useFetch('anime', { id });

    // Handle initial stream load from default url
    useEffect(() => {
        if (streamData && streamData.data) {
            setStreamUrl(streamData.data.defaultStreamingUrl);
        }
    }, [streamData]);

    // Function to fetch specific server stream
    const handleServerChange = async (serverId) => {
        setCurrentServer(serverId);
        try {
            const response = await fetch(`/dhexstream/api.php?endpoint=server&server_id=${serverId}`);
            const json = await response.json();
            if (json && json.data && json.data.url) {
                setStreamUrl(json.data.url);
            }
        } catch (e) {
            console.error("Failed to load server", e);
        }
    };

    // Reset state on episode change
    useEffect(() => {
        window.scrollTo(0, 0);
        setStreamUrl('');
        setCurrentServer(null);
    }, [ep]);

    if (streamLoading) return <div className="min-h-screen pt-20 flex justify-center text-dhex-accent">Loading Stream...</div>;
    if (streamError) return <div className="min-h-screen pt-20 flex justify-center text-red-500">Error loading stream</div>;

    // Data extraction
    const episodes = animeData?.data?.episodeList || [];
    const episodeTitle = streamData?.data?.title || `Episode ${ep}`;
    // Server structure based on streaming.php legacy code investigation
    // structure: data -> server -> qualities -> [ { title: '...', serverList: [...] } ]
    const servers = streamData?.data?.server?.qualities || [];

    return (
        <div className="pt-4 pb-20 container mx-auto px-4 md:px-6">
            <Link to={`/anime/${id}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors">
                <ChevronLeft size={20} /> Back to Anime Info
            </Link>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Player Section */}
                <div className="flex-grow lg:w-3/4">
                    {/* Video Player Container */}
                    <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10 group z-0">
                        {streamUrl ? (
                            <iframe
                                src={streamUrl}
                                className="w-full h-full"
                                frameBorder="0"
                                allowFullScreen
                                title="Episode Player"
                            ></iframe>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 bg-dhex-bg-secondary">
                                <p>Loading Stream...</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-6">
                        <h1 className="text-xl md:text-2xl font-bold text-white mb-2">
                            {episodeTitle}
                        </h1>
                        <p className="text-gray-400 text-sm mb-4">
                            {animeData?.data?.title}
                        </p>

                        {/* Server Selection */}
                        {servers.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4 bg-dhex-bg-secondary p-4 rounded-lg border border-white/5">
                                <span className="text-sm text-gray-400 mr-2 flex items-center font-bold">Servers:</span>
                                {servers.map((quality, qIdx) => (
                                    <div key={qIdx} className="flex gap-2 items-center">
                                        <span className="text-xs text-dhex-accent uppercase font-mono px-2">{quality.title}:</span>
                                        {quality.serverList.map((server, sIdx) => (
                                            <button
                                                key={server.serverId}
                                                onClick={() => handleServerChange(server.serverId)}
                                                className={`px-3 py-1 rounded text-xs font-semibold uppercase transition-colors ${currentServer === server.serverId
                                                        ? 'bg-dhex-accent text-white shadow-lg'
                                                        : 'bg-white/10 hover:bg-white/20 text-gray-300'
                                                    }`}
                                            >
                                                {server.serverName || server.title || `Server ${sIdx + 1}`}
                                            </button>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar / Playlist */}
                <div className="lg:w-1/4 flex-shrink-0">
                    <div className="bg-dhex-bg-secondary rounded-xl overflow-hidden border border-white/5 h-[600px] flex flex-col">
                        <div className="p-4 border-b border-white/5 bg-dhex-bg-secondary">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <LayoutList size={18} className="text-dhex-accent" />
                                Playlist
                            </h3>
                        </div>

                        <div className="overflow-y-auto flex-grow p-2 space-y-2 custom-scrollbar">
                            {episodes.map((episode, idx) => (
                                <Link
                                    key={episode.episodeId}
                                    to={`/watch/${id}/${episode.episodeId}`}
                                    className={`block p-3 rounded-lg transition-all ${episode.episodeId === ep
                                            ? 'bg-dhex-accent text-white shadow-lg'
                                            : 'bg-dhex-bg hover:bg-white/5 text-gray-400 hover:text-white'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-sm">Episode {episode.number || idx + 1}</span>
                                        {episode.episodeId === ep && (
                                            <span className="text-xs bg-black/20 px-2 py-0.5 rounded">Playing</span>
                                        )}
                                    </div>
                                    <div className="text-xs opacity-70 truncate mt-1">
                                        {episode.title || 'Untitled Episode'}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Watch;
