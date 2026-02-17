import React from 'react';
import { useFetch } from '../hooks/useFetch';
import HeroSlider from '../components/home/HeroSlider';
import RecentWatch from '../components/home/RecentWatch';
import PopularAnime from '../components/home/PopularAnime';
import TopRatedAnime from '../components/home/TopRatedAnime';
import OngoingAnime from '../components/home/OngoingAnime';
import CompletedAnime from '../components/home/CompletedAnime';

const Home = () => {
    const { data: homeData, loading, error } = useFetch('home');

    // Extract data based on actual API structure
    const ongoingAnimes = homeData?.data?.ongoing?.animeList || [];

    // Use ongoing anime for spotlight/hero slider (first 6)
    const spotlightAnimes = ongoingAnimes.slice(0, 6);

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex justify-center items-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-dhex-accent mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen pt-20 flex justify-center items-center">
                <div className="text-center text-red-500">
                    <p>Error loading homepage</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-20">
            {/* Hero Spotlight Slider */}
            {spotlightAnimes.length > 0 && (
                <HeroSlider slides={spotlightAnimes} />
            )}

            {/* Recent Watch Section */}
            <RecentWatch />

            {/* Popular Anime Section */}
            <PopularAnime />

            {/* Top Rated Anime Section */}
            <TopRatedAnime />

            {/* Ongoing Anime Section */}
            <OngoingAnime />

            {/* Completed Anime Section */}
            <CompletedAnime />
        </div>
    );
};

export default Home;
