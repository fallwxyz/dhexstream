import React, { useEffect, useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import AnimeCard from '../components/anime/AnimeCard';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Zap, CheckCircle, Tags } from 'lucide-react';

const AnimeList = ({ type }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { id } = useParams(); // Get genre ID if present

    // Default to page 1 if not present
    const page = parseInt(searchParams.get('page') || '1', 10);

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
        params = { ...params, id }; // Add ID for genre fetch
        // We might not know the title immediately unless api returns it in the list payload
        // For now, let's use the ID being pretty or generic
        title = `Genre: ${id?.replace(/-/g, ' ').toUpperCase()}`;
        Icon = Tags;
    }

    const { data: listData, loading, error } = useFetch(endpoint, params);

    // Handle pagination navigation
    const handlePageChange = (newPage) => {
        if (newPage < 1) return;
        window.scrollTo(0, 0);

        let path = '';
        if (type === 'ongoing') path = '/watch/ongoing';
        else if (type === 'complete') path = '/watch/completed';
        else if (type === 'genre') path = `/genre/${id}`;

        navigate(`${path}?page=${newPage}`);
    };

    if (loading) return <div className="min-h-screen pt-20 flex justify-center text-dhex-accent">Loading...</div>;
    if (error) return <div className="min-h-screen pt-20 flex justify-center text-red-500">Error loading data</div>;

    const animeList = listData?.data?.animeList || [];
    const pagination = listData?.data?.pagination || {};

    return (
        <div className="container mx-auto px-6 py-10 min-h-screen">
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                    <Icon className="text-dhex-accent" size={32} />
                    {title}
                </h1>
                <p className="text-gray-400">Page {page}</p>
            </div>

            {animeList.length === 0 ? (
                <div className="text-center text-gray-400">No anime found (or end of list).</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {animeList.map((anime, idx) => (
                        <div key={idx} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                            <AnimeCard anime={anime} />
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-4 mt-12">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={!pagination.hasPrevPage}
                    className={`px-4 py-2 rounded-full flex items-center gap-2 transition-colors ${!pagination.hasPrevPage
                            ? 'bg-dhex-bg-secondary text-gray-600 cursor-not-allowed'
                            : 'bg-dhex-accent hover:bg-dhex-accent-hover text-white'
                        }`}
                >
                    <ChevronLeft size={18} /> Prev
                </button>

                <div className="flex items-center gap-2">
                    <span className="bg-dhex-bg-secondary px-4 py-2 rounded-lg text-white font-mono">
                        {page}
                    </span>
                </div>

                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={!pagination.hasNextPage}
                    className={`px-4 py-2 rounded-full flex items-center gap-2 transition-colors ${!pagination.hasNextPage
                            ? 'bg-dhex-bg-secondary text-gray-600 cursor-not-allowed'
                            : 'bg-dhex-accent hover:bg-dhex-accent-hover text-white'
                        }`}
                >
                    Next <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default AnimeList;
