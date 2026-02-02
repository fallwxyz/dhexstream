import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { useGsap } from '../../hooks/useGsap';

const AnimeCard = ({ anime, showLink = true }) => {
    // anime object structure from API: { animeId, title, poster, latestReleaseDate, ... }
    const cardRef = useRef(null);
    const { gsap } = useGsap();

    const handleMouseEnter = () => {
        gsap.to(cardRef.current, { y: -10, scale: 1.02, duration: 0.3, ease: 'power2.out' });
        gsap.to(cardRef.current.querySelector('.play-btn'), { opacity: 1, scale: 1, duration: 0.3 });
        gsap.to(cardRef.current.querySelector('.overlay'), { opacity: 0.8, duration: 0.3 });
    };

    const handleMouseLeave = () => {
        gsap.to(cardRef.current, { y: 0, scale: 1, duration: 0.3, ease: 'power2.out' });
        gsap.to(cardRef.current.querySelector('.play-btn'), { opacity: 0, scale: 0.8, duration: 0.3 });
        gsap.to(cardRef.current.querySelector('.overlay'), { opacity: 0, duration: 0.3 });
    };

    const CardContent = (
        <div
            ref={cardRef}
            className="relative group rounded-xl overflow-hidden shadow-lg bg-dhex-bg-secondary w-full aspect-[3/4] cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Image */}
            <img
                src={anime.poster}
                alt={anime.title}
                className="w-full h-full object-cover"
                loading="lazy"
            />

            {/* Overlay */}
            <div className="overlay absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 transition-opacity duration-300" />

            {/* Play Button */}
            <div className="play-btn absolute inset-0 flex items-center justify-center opacity-0 scale-75 transform text-white">
                <div className="bg-dhex-accent/90 p-4 rounded-full backdrop-blur-sm shadow-xl hover:bg-dhex-accent transition-colors">
                    <Play fill="currentColor" size={24} />
                </div>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent pt-12">
                <span className="text-xs text-dhex-accent font-mono block mb-1">
                    {anime.latestReleaseDate || anime.lastReleaseDate}
                </span>
                <h3 className="text-gray-50 font-semibold truncate text-sm md:text-base leading-tight">
                    {anime.title}
                </h3>
            </div>
        </div>
    );

    if (showLink) {
        return <Link to={`/anime/${anime.animeId}`}>{CardContent}</Link>;
    }

    return CardContent;
};

export default AnimeCard;
