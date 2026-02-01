import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import AnimeCard from '../components/anime/AnimeCard';
import { Calendar, Clock } from 'lucide-react';
import { useGsap } from '../hooks/useGsap';

const Schedule = () => {
    const { data: scheduleData, loading, error } = useFetch('schedule');
    const [activeDay, setActiveDay] = useState(0); // Index of the day
    const { gsap } = useGsap();

    const days = scheduleData && scheduleData.data ? scheduleData.data : [];

    if (loading) return <div className="min-h-screen pt-20 flex justify-center text-dhex-accent">Loading Schedule...</div>;
    if (error) return <div className="min-h-screen pt-20 flex justify-center text-red-500">Error loading schedule</div>;

    return (
        <div className="container mx-auto px-6 py-10 min-h-screen">
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                    <Calendar className="text-dhex-accent" size={32} />
                    Release Schedule
                </h1>
                <p className="text-gray-400">Never miss an episode. Check the weekly release schedule.</p>
            </div>

            {/* Day Tabs */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
                {days.map((dayData, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveDay(index)}
                        className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${activeDay === index
                                ? 'bg-dhex-accent text-white shadow-lg shadow-dhex-accent/30 scale-105'
                                : 'bg-dhex-bg-secondary text-gray-400 hover:text-white hover:bg-white/10'
                            }`}
                    >
                        {dayData.day}
                    </button>
                ))}
            </div>

            {/* Anime List for Active Day */}
            <div className="min-h-[400px]">
                {days[activeDay] && (
                    <div className="animate-fade-in">
                        <div className="flex items-center gap-2 mb-6 text-xl font-bold text-white border-b border-white/5 pb-2">
                            <Clock size={20} className="text-dhex-accent" />
                            {days[activeDay].day}
                        </div>

                        {days[activeDay].anime_list.length === 0 ? (
                            <p className="text-gray-500 italic">No anime scheduled for this day.</p>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                {days[activeDay].anime_list.map((anime, idx) => (
                                    <div key={idx} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                                        {/* The backend 'schedule' might return different keys than standard anime list.
                                             Based on schedule.php: it has 'slug', 'poster', 'title'. 
                                             AnimeCard usually expects 'animeId'. 
                                             We need to ensure compatibility. 
                                             If 'slug' is actually the ID, we map it. 
                                         */}
                                        <AnimeCard anime={{
                                            ...anime,
                                            animeId: anime.slug // Mapping slug to animeId for Link compatibility
                                        }} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Schedule;
