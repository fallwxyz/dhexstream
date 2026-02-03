import React, { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { useGsap, animatePageIn } from '../hooks/useGsap';
import { useAniListImage } from '../hooks/useAniListImage';
import { Play, Calendar, Star, Clock, Layers, CheckCircle } from 'lucide-react';

const AnimeDetail = () => {
    const { id } = useParams();
    const { data: animeData, loading, error } = useFetch('anime', { id });
    const containerRef = useRef();
    const { gsap, ScrollTrigger } = useGsap();
    const { image: bannerImage } = useAniListImage(animeData?.data?.title || '');

    useEffect(() => {
        if (!loading && animeData) {
            animatePageIn(containerRef.current);

            // Stagger episodes
            gsap.fromTo('.episode-item',
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, stagger: 0.03, duration: 0.5, delay: 0.5 }
            );
        }
    }, [loading, animeData]);

    if (loading) return <div className="min-h-screen pt-20 flex justify-center text-dhex-accent">Loading...</div>;
    if (error) return <div className="min-h-screen pt-20 flex justify-center text-red-500">Error loading anime details</div>;
    if (!animeData) return null;

    // Adjust data access based on actual API response structure
    const anime = animeData.data;
    const episodes = anime.episodeList || [];

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
                                if (!anime.synopsis) return "No synopsis available.";
                                if (typeof anime.synopsis === 'string') return anime.synopsis;
                                if (typeof anime.synopsis === 'object' && anime.synopsis.paragraphs) {
                                    // If paragraphs is an array of strings, join them
                                    if (Array.isArray(anime.synopsis.paragraphs)) {
                                        return anime.synopsis.paragraphs.map((p, idx) => (
                                            <p key={idx} className="mb-4">{p}</p>
                                        ));
                                    }
                                }
                                return "Synopsis format unknown.";
                            })()}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 mb-10">
                            {episodes.length > 0 && (
                                <Link
                                    to={`/watch/${id}/${episodes[episodes.length - 1].episodeId}`}
                                    className="px-8 py-3 bg-dhex-accent hover:bg-dhex-accent-hover text-white rounded-lg font-semibold flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-dhex-accent/20"
                                >
                                    <Play size={20} fill="currentColor" /> Start Watching
                                </Link>
                            )}
                        </div>

                        {/* Episodes List */}
                        <div className="bg-dhex-bg-secondary rounded-xl p-6 border border-white/5">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Clock size={20} className="text-dhex-accent" />
                                Episodes
                            </h3>

                            {episodes.length === 0 ? (
                                <p className="text-gray-500">No episodes available yet.</p>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {[...episodes].reverse().map((ep, index) => {
                                        // EP 1 = first episode (index 0 after reverse), EP 2 = second episode (index 1), etc.
                                        const episodeNumber = index + 1;
                                        return (
                                            <Link
                                                key={ep.episodeId}
                                                to={`/watch/${id}/${ep.episodeId}`}
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
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnimeDetail;