import React from 'react';
import { useFetch } from '../../hooks/useFetch';
import { Link } from 'react-router-dom';
import { CheckCircle, ChevronRight } from 'lucide-react';
import AnimeCard from '../anime/AnimeCard';

const CompletedAnime = () => {
    const { data: completedData, loading, error } = useFetch('complete');

    if (loading || error || !completedData?.data?.animeList) return null;

    const animeList = completedData.data.animeList;

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                    <CheckCircle className="text-green-500" size={32} />
                    Completed Anime
                </h2>
                <Link
                    to="/watch/completed"
                    className="text-dhex-accent hover:text-dhex-accent-hover transition-colors flex items-center gap-2"
                >
                    View All
                    <ChevronRight size={18} />
                </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 md:gap-6">
                {animeList.slice(0, 12).map((anime, idx) => (
                    <div
                        key={anime.animeId || idx}
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                        <AnimeCard anime={anime} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CompletedAnime;
