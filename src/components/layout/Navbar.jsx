import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Menu, X, Search, User, MessageCircle,
    Dice5, Users, Info, Settings, ChevronLeft, ChevronRight,
    Home, Zap, CheckCircle, Tags, Play
} from 'lucide-react';
import SearchDropdown from '../search/SearchDropdown';

const Navbar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const searchRef = useRef(null);
    const sidebarRef = useRef(null);

    // Detect mobile screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const genres = [
        "Action", "Adventure", "Comedy", "Drama", "Fantasy",
        "Horror", "Mystery", "Psychological", "Romance",
        "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller"
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        // Reset/Check on location change
        handleScroll();

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMobile) return;
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobile]);

    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = 'hidden';
            if (window.lenis) window.lenis.stop();
        } else {
            document.body.style.overflow = '';
            if (window.lenis) window.lenis.start();
        }

        return () => {
            document.body.style.overflow = '';
            if (window.lenis) window.lenis.start();
        };
    }, [isSidebarOpen]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setIsSearchOpen(false);
            navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const closeSearch = () => {
        setIsSearchOpen(false);
        setSearchQuery('');
    };

    const openSearch = () => {
        setIsSearchOpen(true);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
        if (isSearchOpen) setIsSearchOpen(false);
    };

    const handleDesktopSearchClick = () => {
        if (searchQuery.trim()) {
            setIsSearchOpen(true);
        }
    };

    return (
        <>
            {/* --- TOP NAVBAR --- */}
            <header
                className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${isScrolled
                    ? 'h-16 bg-black/20 backdrop-blur-3xl shadow-lg'
                    : 'h-20 bg-transparent'
                    }`}
            >
                <div className="container mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4">

                    {/* Left: Burger & Logo */}
                    <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
                        <button
                            onClick={toggleSidebar}
                            className="p-2 text-white/80 hover:text-dhex-accent transition-colors active:scale-90"
                        >
                            <Menu size={26} />
                        </button>

                        <Link to="/" className="hidden lg:flex items-center gap-2 group">
                            <div className="w-9 h-9 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <img
                                    src="/dhexstream/public/image/logo.png"
                                    alt="DHEX Logo"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <span className="hidden xs:block text-2xl font-black tracking-tighter text-white">
                                DHEX<span className="text-dhex-accent">Stream</span>
                            </span>
                        </Link>
                    </div>

                    {/* Middle: Integrated Search Box (Desktop) */}
                    <div className="hidden lg:flex items-center flex-grow max-w-xl group relative" ref={searchRef}>
                        <form onSubmit={handleSearch} className="w-full relative">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        if (e.target.value.length >= 2) {
                                            setIsSearchOpen(true);
                                        } else if (e.target.value.length === 0) {
                                            setIsSearchOpen(false);
                                        }
                                    }}
                                    onFocus={handleDesktopSearchClick}
                                    placeholder="Search anime..."
                                    className="w-full h-11 bg-black/20 hover:bg-black/30 focus:bg-black/30 border border-black/10 focus:border-dhex-accent/50 rounded-lg pl-5 pr-12 text-sm text-gray-200 transition-all outline-none"
                                />
                                <button type="submit" className="absolute right-3 p-1.5 text-gray-400 hover:text-white transition-colors">
                                    <Search size={18} />
                                </button>
                            </div>
                        </form>
                        <SearchDropdown
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            isOpen={isSearchOpen && !isMobile}
                            onClose={closeSearch}
                            variant="desktop"
                        />
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1 sm:gap-3">


                        {/* Mobile Search Trigger */}
                        <button
                            onClick={openSearch}
                            className="lg:hidden p-2 text-gray-300 hover:text-dhex-accent"
                        >
                            <Search size={22} />
                        </button>

                        {/* BobAnimeList Link (Desktop) */}
                        <a
                            href="https://bobanimelist.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden lg:flex items-center justify-center w-12 h-12 hover:scale-110 transition-transform duration-300"
                        >
                            <img
                                src="/dhexstream/public/image/bobanimelist.png"
                                alt="BobAnimeList"
                                className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                            />
                        </a>

                        {/* Login Button */}
                        <button className="ml-1 sm:ml-2 px-4 sm:px-6 h-10 bg-dhex-accent hover:bg-dhex-accent-hover text-white text-sm font-bold rounded-lg transition-all active:scale-95 shadow-lg shadow-dhex-accent/20">
                            Log In
                        </button>
                    </div>
                </div>

            </header>

            {/* Mobile Search Dropdown */}
            <SearchDropdown
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isOpen={isSearchOpen && isMobile}
                onClose={closeSearch}
                variant="mobile"
            />
            {/* --- SIDEBAR MENU --- */}
            <div
                className={`fixed inset-0 z-[110] bg-transparent backdrop-blur-lg transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                    }`}
                onClick={() => setIsSidebarOpen(false)}
                style={{ touchAction: 'none' }}
            />

            {/* Sidebar Content */}
            <aside
                ref={sidebarRef}
                data-lenis-prevent
                className={`fixed top-0 left-0 h-screen w-[280px] sm:w-[320px] bg-dhex-bg-secondary/60 backdrop-blur-md z-[120] transition-transform duration-500 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } border-r border-black/5 shadow-2xl overflow-y-auto scrollbar-hide`}
            >
                <div className="p-6 min-h-full">
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="mb-8 flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-xl text-gray-400 hover:text-white font-bold transition-all shadow-xl shadow-black/20 border border-white/5 active:scale-95 group"
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
                        Close Menu
                    </button>

                    {/* Main Nav Links */}
                    <nav className="space-y-1 mb-8">
                        <NavLink icon={<Home size={20} />} label="Beranda" to="/" active={location.pathname === '/'} onClick={() => setIsSidebarOpen(false)} />
                        <NavLink icon={<Zap size={20} />} label="On Going" to="/watch/ongoing" active={location.pathname === '/watch/ongoing'} onClick={() => setIsSidebarOpen(false)} />
                        <NavLink icon={<CheckCircle size={20} />} label="Completed" to="/watch/completed" active={location.pathname === '/watch/completed'} onClick={() => setIsSidebarOpen(false)} />
                        <NavLink icon={<Settings size={20} />} label="Jadwal" to="/schedule" active={location.pathname === '/schedule'} onClick={() => setIsSidebarOpen(false)} />
                        <NavLink icon={<Info size={20} />} label="Genre" to="/genre" active={location.pathname.startsWith('/genre')} onClick={() => setIsSidebarOpen(false)} />
                    </nav>

                    {/* Genre List Section */}
                    <div className="border-t border-black/5 pt-6 mt-6">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            {genres.map((genre, index) => {
                                const genreColors = [
                                    'text-rose-400', 'text-amber-400', 'text-emerald-400', 'text-sky-400',
                                    'text-indigo-400', 'text-purple-400', 'text-pink-400', 'text-cyan-400',
                                    'text-lime-400', 'text-orange-400', 'text-teal-400', 'text-violet-400',
                                    'text-fuchsia-400', 'text-blue-400'
                                ];
                                const colorClass = genreColors[index % genreColors.length];

                                return (
                                    <Link
                                        key={genre}
                                        to={`/genre/${genre.toLowerCase().replace(/ /g, '-')}`}
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`text-[13px] ${colorClass} hover:brightness-125 hover:pl-2 transition-all py-1.5 flex items-center justify-between group font-medium`}
                                    >
                                        {genre}
                                        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mobile Footer Logos (Sidebar) */}
                    <div className="lg:hidden mt-10 pt-6 border-t border-white/5 space-y-6">
                        <div className="flex flex-col items-center gap-6 pb-8">
                            {/* BobAnimeList Link */}
                            <a
                                href="https://bobanimelist.vercel.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-2 group transition-all"
                            >
                                <div className="w-20 h-20 flex items-center justify-center bg-white/5 rounded-2xl p-3 border border-white/10 group-hover:scale-105 transition-transform duration-300 shadow-xl">
                                    <img
                                        src="/dhexstream/public/image/bobanimelist.png"
                                        alt="BobAnimeList"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-dhex-accent transition-colors">
                                    Visit BobAnimeList
                                </span>
                            </a>

                            {/* DHEX Stream Logo */}
                            <Link
                                to="/"
                                onClick={() => setIsSidebarOpen(false)}
                                className="flex flex-col items-center gap-2 group"
                            >
                                <div className="w-12 h-12 flex items-center justify-center transition-transform group-hover:scale-110">
                                    <img
                                        src="/dhexstream/public/image/logo.png"
                                        alt="DHEX Logo"
                                        className="w-full h-full object-contain opacity-80 group-hover:opacity-100"
                                    />
                                </div>
                                <span className="text-xl font-black tracking-tighter text-white/40 group-hover:text-white transition-colors">
                                    DHEX<span className="text-dhex-accent/40 group-hover:text-dhex-accent">Stream</span>
                                </span>
                            </Link>

                            <p className="text-[10px] text-gray-600 font-medium tracking-tight mt-4">
                                © 2024 DHEX Stream. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

// Helper Components
const NavLink = ({ icon, label, to, active, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group border-b border-white/10 ${active
            ? 'bg-dhex-accent text-white shadow-lg shadow-dhex-accent/20'
            : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
    >
        <span className={`${active ? '' : 'group-hover:scale-110 transition-transform'}`}>
            {icon}
        </span>
        <span className="font-bold text-sm tracking-wide">{label}</span>
        {!active && (
            <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        )}
    </Link>
);


export default Navbar;