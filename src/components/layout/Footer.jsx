import React from 'react';
import { Github, Instagram } from 'lucide-react';

// Konstanta untuk konten footer
const FOOTER_CONTENT = {
  brand: {
    name: 'DHEX',
    accent: 'Stream',
    description:
      'Platform streaming anime modern dengan pengalaman menonton terbaik. Bebas iklan mengganggu dan selalu update.',
  },
  navigation: [
    { label: 'Popular', href: '/dhexstream/watch/popular' },
    { label: 'Trending', href: '/dhexstream/watch/top-rated' },
    { label: 'Character List', href: '/dhexstream/characters' },
  ],
  legal: [
    { label: 'Terms of Service', href: '/dhexstream/terms' },
    { label: 'Privacy Policy', href: '/dhexstream/privacy' },
    { label: 'DMCA', href: '/dmca' },
  ],
  social: [
    {
      label: 'GitHub',
      href: 'https://github.com/fallwxyz/dhexstream',
      icon: Github,
      ariaLabel: 'Visit our GitHub',
    },
    {
      label: 'Instagram',
      href: 'https://instagram.com/dhexstream',
      icon: Instagram,
      ariaLabel: 'Visit our Instagram',
    },
  ],
};

// Komponen reusable untuk list link
const FooterLinkList = ({ title, links }) => (
  <div>
    <h4 className="text-white font-semibold mb-4">{title}</h4>
    <ul className="space-y-2 text-sm text-gray-400">
      {links.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            className="hover:text-dhex-accent transition-colors duration-200"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

// Komponen social links (FIXED)
const SocialLinks = ({ links }) => (
  <div>
    <h4 className="text-white font-semibold mb-4">Social</h4>
    <div className="flex gap-4">
      {links.map((social) => {
        const Icon = social.icon;
        return (
          <a
            key={social.label}
            href={social.href}
            className="text-gray-400 hover:text-white transition-colors duration-200"
            aria-label={social.ariaLabel}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon size={20} />
          </a>
        );
      })}
    </div>
  </div>
);

// Komponen brand section
const BrandSection = ({ brand }) => (
  <div className="col-span-1">
    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-10">
      <div className="ml-14 sm:ml-10 md:ml-14 lg:ml-14 xl:ml-14 w-8 h-8 flex items-center justify-center transition-transform group-hover:scale-110">
        <img
          src="/dhexstream/image/logo.png"
          alt="DHEX Logo"
          className="w-full h-full object-contain opacity-80 group-hover:opacity-100 mr-1"
        />
        {brand.name}
        <span className="text-dhex-accent">{brand.accent}</span>
      </div>
    </h3>
    <p className="text-gray-400 text-sm leading-relaxed">
      {brand.description}
    </p>
  </div>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dhex-bg-secondary pt-16 pb-8 border-t border-white/5">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <BrandSection brand={FOOTER_CONTENT.brand} />
          <FooterLinkList
            title="Navigasi"
            links={FOOTER_CONTENT.navigation}
          />
          <FooterLinkList title="Legal" links={FOOTER_CONTENT.legal} />
          <SocialLinks links={FOOTER_CONTENT.social} />
        </div>

        {/* Copyright */}
        <div className="border-t border-white/5 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {currentYear} DHEXStream. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
