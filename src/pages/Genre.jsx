import React, { useEffect, useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { Link } from 'react-router-dom';
import { Tags } from 'lucide-react';

const Genre = () => {
    const { data: genreData, loading, error } = useFetch('genre');

    if (loading) return <div className="min-h-screen pt-20 flex justify-center text-dhex-accent">Loading Genres...</div>;
    if (error) return <div className="min-h-screen pt-20 flex justify-center text-red-500">Error loading genres</div>;

    // Based on genre.php: $raw['data']['genreList']
    const genres = genreData?.data?.genreList || [];

    // Colors for badges to make it lively
    const colors = [
        'bg-red-500/20 text-red-400 border-red-500/30',
        'bg-orange-500/20 text-orange-400 border-orange-500/30',
        'bg-amber-500/20 text-amber-400 border-amber-500/30',
        'bg-green-500/20 text-green-400 border-green-500/30',
        'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        'bg-teal-500/20 text-teal-400 border-teal-500/30',
        'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
        'bg-sky-500/20 text-sky-400 border-sky-500/30',
        'bg-blue-500/20 text-blue-400 border-blue-500/30',
        'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
        'bg-violet-500/20 text-violet-400 border-violet-500/30',
        'bg-purple-500/20 text-purple-400 border-purple-500/30',
        'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30',
        'bg-pink-500/20 text-pink-400 border-pink-500/30',
        'bg-rose-500/20 text-rose-400 border-rose-500/30',
    ];

    return (
        <div className="container mx-auto px-6 py-10 min-h-screen">
            <div className="text-center mb-16">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 flex items-center justify-center gap-3">
                    <Tags className="text-dhex-accent" size={40} />
                    Browse Genres
                </h1>
                <p className="text-gray-400 text-lg">Explore anime by your favorite categories.</p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
                {genres.map((genre, idx) => {
                    const colorClass = colors[idx % colors.length];
                    return (
                        <Link
                            key={genre.genreId || idx}
                            to={`/genre/${genre.genreId}`}
                            className={`px-6 py-3 rounded-xl border font-semibold text-lg transition-all duration-300 hover:scale-110 hover:shadow-lg hover:brightness-110 ${colorClass}`}
                        >
                            {genre.title}
                        </Link>
                    )
                })}
            </div>
        </div>
    );
};

export default Genre;
