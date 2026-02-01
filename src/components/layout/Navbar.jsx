import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X, User } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-dhex-bg/80 backdrop-blur-md border-b border-white/5 transition-all duration-300">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                    DHEX<span className="text-dhex-accent">Stream</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/" className="text-gray-300 hover:text-white transition-colors">Beranda</Link>
                    <Link to="/schedule" className="text-gray-300 hover:text-white transition-colors">Jadwal</Link>
                    <Link to="/watch/ongoing" className="text-gray-300 hover:text-white transition-colors">On Going</Link>
                    <Link to="/watch/completed" className="text-gray-300 hover:text-white transition-colors">Completed</Link>
                    <Link to="/genre" className="text-gray-300 hover:text-white transition-colors">Genre</Link>
                </div>

                {/* Action Icons */}
                <div className="hidden md:flex items-center gap-4">
                    <Link to="/search" className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
                        <Search size={20} />
                    </Link>
                    {/* <button className="p-2 text-gray-400 hover:text-white transition-colors">
                        <User size={20} />
                    </button> */}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2 text-gray-300 hover:text-white"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden bg-dhex-bg-secondary border-b border-white/5">
                    <div className="flex flex-col px-6 py-4 gap-4">
                        <Link to="/" className="text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>Beranda</Link>
                        <Link to="/schedule" className="text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>Jadwal</Link>
                        <Link to="/watch/ongoing" className="text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>On Going</Link>
                        <Link to="/watch/completed" className="text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>Completed</Link>
                        <Link to="/genre" className="text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>Genre</Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
