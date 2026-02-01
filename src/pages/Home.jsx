import React, { useEffect, useRef } from 'react';
import { useFetch } from '../hooks/useFetch';
import { useGsap, animatePageIn } from '../hooks/useGsap';
import AnimeCard from '../components/anime/AnimeCard';
import { ChevronRight, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    const { data, loading, error } = useFetch('home');
    const containerRef = useRef();
    const { gsap, ScrollTrigger } = useGsap();

    useEffect(() => {
        if (!loading && data) {
            animatePageIn(containerRef.current);

            // Stagger animation for cards
            const cards = document.querySelectorAll('.anime-card');
            gsap.fromTo(cards,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.05,
                    duration: 0.5,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.home-grid-ongoing',
                        start: 'top 80%',
                    }
                }
            );
        }
    }, [loading, data]);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-dhex-accent">Loading...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Error loading data</div>;
    if (!data || !data.data) return null;

    const ongoing = data.data.ongoing.animeList.slice(0, 12);
    const completed = data.data.completed.animeList.slice(0, 12);
    const featured = ongoing[0]; // Just taking first item as featured for now

    return (
        <div ref={containerRef} className="pb-20">
            {/* Hero Section */}
            <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={featured.poster}
                        alt="Hero"
                        className="w-full h-full object-cover opacity-60 blur-sm scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dhex-bg via-dhex-bg/80 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-dhex-bg via-dhex-bg/50 to-transparent" />
                </div>

                <div className="relative container mx-auto px-6 h-full flex items-center">
                    <div className="max-w-2xl">
                        <span className="inline-block py-1 px-3 rounded-full bg-dhex-accent/20 text-dhex-accent text-sm font-medium mb-4 backdrop-blur-md border border-dhex-accent/20">
                            #1 Trending Now
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                            {featured.title}
                        </h1>
                        <p className="text-gray-300 text-lg mb-8 line-clamp-3 max-w-xl">
                            Experience the latest episode of {featured.title}.
                            Stream high-quality anime with immersive audio and visuals.
                        </p>
                        <div className="flex gap-4">
                            <Link to={`/anime/${featured.animeId}`} className="px-8 py-3 bg-dhex-accent hover:bg-dhex-accent-hover text-white rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg shadow-dhex-accent/25">
                                <PlayCircle size={20} />
                                Watch Now
                            </Link>
                            <button className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold backdrop-blur-sm transition-all border border-white/10">
                                Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Sections */}
            <div className="container mx-auto px-6 -mt-20 relative z-10">

                {/* Ongoing Section */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <span className="w-1 h-6 bg-dhex-accent rounded-full"></span>
                                Ongoing Anime
                            </h2>
                            <p className="text-gray-400 text-sm mt-1 ml-3">Catch up with the latest episodes</p>
                        </div>
                        <Link to="/watch/ongoing" className="text-dhex-accent hover:text-white transition-colors flex items-center text-sm font-medium gap-1">
                            View All <ChevronRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 home-grid-ongoing">
                        {ongoing.map(anime => (
                            <div key={anime.animeId} className="anime-card">
                                <AnimeCard anime={anime} />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Completed Section */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                                Completed Anime
                            </h2>
                            <p className="text-gray-400 text-sm mt-1 ml-3">Binge-watch full series</p>
                        </div>
                        <Link to="/watch/completed" className="text-dhex-accent hover:text-white transition-colors flex items-center text-sm font-medium gap-1">
                            View All <ChevronRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 home-grid-completed">
                        {completed.map(anime => (
                            <div key={anime.animeId} className="anime-card">
                                <AnimeCard anime={anime} />
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;
