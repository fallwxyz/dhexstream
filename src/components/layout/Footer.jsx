import React from 'react';
import { Github, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-dhex-bg-secondary pt-16 pb-8 border-t border-white/5">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <h3 className="text-xl font-bold text-white mb-4">DHEX<span className="text-dhex-accent">Stream</span></h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Platform streaming anime modern dengan pengalaman menonton terbaik. Bebas iklan mengganggu dan selalu update.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Navigasi</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-dhex-accent transition-colors">Popular</a></li>
                            <li><a href="#" className="hover:text-dhex-accent transition-colors">Trending</a></li>
                            <li><a href="#" className="hover:text-dhex-accent transition-colors">Character List</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-dhex-accent transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-dhex-accent transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-dhex-accent transition-colors">DMCA</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Social</h4>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Github size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram size={20} /></a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 text-center text-gray-500 text-sm">
                    <p>&copy; 2026 DHEX Stream. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
