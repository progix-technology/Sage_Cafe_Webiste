import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Mail, Phone, Globe } from 'lucide-react';
import { ASSETS } from '../../assets/images';
import { ManagerLoginModal } from '../common/ManagerLoginModal';

export const Footer = () => {
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="relative w-full bg-[#0A6473] text-white pt-16 sm:pt-20 md:pt-24 pb-10 sm:pb-12 px-6 sm:px-10 md:px-14 lg:px-20 select-none">
      
      {/* Top Wave Cut into Section Above */}
      <div className="absolute top-0 left-0 right-0 w-full pointer-events-none select-none -translate-y-[98%] leading-none z-20">
        <svg
          viewBox="0 0 1440 90"
          className="w-full h-12 sm:h-16 md:h-20 lg:h-24 block min-w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M 0,90 C 320,20 680,5 1020,48 C 1220,72 1360,52 1440,25 L 1440,90 L 0,90 Z"
            fill="#0A6473"
          />
        </svg>
      </div>

      {/* Background Subtle Luxury SAGĒ Watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06] flex items-center justify-center overflow-hidden select-none">
        <span
          style={{ fontFamily: '"Tan Mon Cheri", "Italiana", "Cormorant Garamond", serif' }}
          className="text-[32vw] font-bold text-white tracking-tighter leading-none select-none"
        >
          SAGĒ
        </span>
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10">

        {/* Top Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 pb-12 sm:pb-16">
          
          {/* Left Title & Cursive & Contact */}
          <div>
            <h2
              className="text-white font-serif font-light text-3xl sm:text-4xl md:text-5xl lg:text-[54px] tracking-[0.04em] uppercase leading-none"
              style={{ fontFamily: "'Cormorant Garamond', 'Belleza', serif" }}
            >
              THE WORLD OF SAGE
            </h2>
            
            <span
              className="text-white text-2xl sm:text-3xl md:text-4xl font-normal tracking-wide block mt-1 sm:mt-2"
              style={{ fontFamily: "'Covered By Your Grace', 'Caveat', cursive" }}
            >
              Where Good Food Brings Us Together
            </span>

            <p className="text-white/90 text-xs sm:text-[13px] font-sans mt-4 sm:mt-6 tracking-wide">
              Contact Information &mdash;{' '}
              <a
                href="mailto:info@sagegroup.com"
                className="font-bold underline hover:text-white transition-opacity"
              >
                info@sagegroup.com
              </a>
            </p>
          </div>

          {/* Right Column: Square Scroll to Top Button + Brand Logo Image */}
          <div className="select-none flex flex-col items-start lg:items-end justify-between gap-5 sm:gap-6">
            {/* Square Scroll To Top Button above Logo - Shifted Upwards & Slightly Larger */}
            <button
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="w-13 h-13 sm:w-14 sm:h-14 md:w-16 md:h-16 -mt-3 sm:-mt-6 lg:-mt-8 rounded-2xl bg-white/10 hover:bg-[#F3D898] border border-white/30 hover:border-[#F3D898] text-white hover:text-[#0A6473] flex items-center justify-center transition-all duration-300 shadow-xl group hover:-translate-y-1.5 active:scale-95 cursor-pointer"
              title="Scroll to top"
            >
              <ArrowUp className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5] group-hover:-translate-y-1 transition-transform duration-300" />
            </button>

            {/* Brand Logo Image - Crisp Pure White */}
            <img
              src={ASSETS.cafeName}
              alt="Sagē Café Logo"
              className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto max-w-[200px] sm:max-w-[250px] md:max-w-[300px] object-contain filter brightness-0 invert opacity-100 hover:scale-105 transition-all duration-300 drop-shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
            />
          </div>

        </div>

        {/* 4-Column Editorial Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8 lg:gap-10 pt-4 pb-12 sm:pb-16">
          
          {/* Column 1: OUR STORY */}
          <div className="flex flex-col justify-between">
            <div>
              <h3
                className="text-white font-serif font-normal text-base sm:text-lg uppercase tracking-[0.1em]"
                style={{ fontFamily: "'Cormorant Garamond', 'Belleza', serif" }}
              >
                OUR STORY
              </h3>
              <p className="text-white/90 text-xs sm:text-[13px] font-sans mt-1">
                The Caf&eacute; <span className="font-bold text-white">Through Our Eyes</span>
              </p>
              <p className="text-white/80 text-xs sm:text-[12px] leading-relaxed mt-3.5 font-sans">
                Discover the story behind Sage Café and the people, food and coffee that bring it to life.
              </p>
            </div>
            <Link
              to="/story"
              className="text-white text-xs tracking-[0.18em] uppercase underline underline-offset-4 hover:text-white/80 transition-colors font-medium mt-6 inline-block"
            >
              EXPLORE OUR STORY
            </Link>
          </div>

          {/* Column 2: MENU */}
          <div className="flex flex-col justify-between">
            <div>
              <h3
                className="text-white font-serif font-normal text-base sm:text-lg uppercase tracking-[0.1em]"
                style={{ fontFamily: "'Cormorant Garamond', 'Belleza', serif" }}
              >
                MENU
              </h3>
              <p className="text-white/90 text-xs sm:text-[13px] font-sans mt-1">
                Scenes <span className="font-bold text-white">From The Kitchen</span>
              </p>
              <p className="text-white/80 text-xs sm:text-[12px] leading-relaxed mt-3.5 font-sans">
                Explore coffee, breakfast, brunch, continental favourites, desserts and more.
              </p>
            </div>
            <Link
              to="/menu"
              className="text-white text-xs tracking-[0.18em] uppercase underline underline-offset-4 hover:text-white/80 transition-colors font-medium mt-6 inline-block"
            >
              EXPLORE MENU
            </Link>
          </div>

          {/* Column 3: EVENTS */}
          <div className="flex flex-col justify-between">
            <div>
              <h3
                className="text-white font-serif font-normal text-base sm:text-lg uppercase tracking-[0.1em]"
                style={{ fontFamily: "'Cormorant Garamond', 'Belleza', serif" }}
              >
                EVENTS
              </h3>
              <p className="text-white/90 text-xs sm:text-[13px] font-sans mt-1">
                Gatherings <span className="font-bold text-white">At Sage</span>
              </p>
              <p className="text-white/80 text-xs sm:text-[12px] leading-relaxed mt-3.5 font-sans">
                Discover our open mic nights, live music, private gatherings and special events.
              </p>
            </div>
            <Link
              to="/events"
              className="text-white text-xs tracking-[0.18em] uppercase underline underline-offset-4 hover:text-white/80 transition-colors font-medium mt-6 inline-block"
            >
              EXPLORE EVENTS
            </Link>
          </div>

          {/* Column 4: FIND US */}
          <div className="flex flex-col justify-between">
            <div>
              <h3
                className="text-white font-serif font-normal text-base sm:text-lg uppercase tracking-[0.1em]"
                style={{ fontFamily: "'Cormorant Garamond', 'Belleza', serif" }}
              >
                FIND US
              </h3>
              <p className="text-white/90 text-xs sm:text-[13px] font-sans mt-1">
                Visit <span className="font-bold text-white">Sage Café</span>
              </p>
              <p className="text-white/80 text-xs sm:text-[12px] leading-relaxed mt-3.5 font-sans">
                Visit Sage Café in the heart of the city and make yourself at home.
              </p>
            </div>
            <Link
              to="/find-us"
              className="text-white text-xs tracking-[0.18em] uppercase underline underline-offset-4 hover:text-white/80 transition-colors font-medium mt-6 inline-block"
            >
              GET IN TOUCH
            </Link>
          </div>

        </div>

        {/* Bottom Horizontal Divider & Copyright Bar */}
        <div className="w-full pt-8 border-t border-white/25 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs tracking-widest text-white/90 font-sans">
          
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 uppercase text-[11px] sm:text-xs">
            <span>&copy; {new Date().getFullYear()} SAGĒ GROUP. ALL RIGHTS RESERVED.</span>
            <span className="opacity-30">|</span>
            <button
              onClick={() => setIsStaffModalOpen(true)}
              className="text-white/50 hover:text-[#F3D898] transition-colors cursor-pointer text-[11px] underline underline-offset-2"
            >
              manager access
            </button>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4 text-white">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="p-2 rounded-full bg-white/10 hover:bg-[#F3D898] hover:text-[#0A6473] transition-all hover:scale-110 duration-200"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="p-2 rounded-full bg-white/10 hover:bg-[#F3D898] hover:text-[#0A6473] transition-all hover:scale-110 duration-200"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>

            <a
              href="mailto:contact@sagecafe.in"
              aria-label="Email Concierge"
              className="p-2 rounded-full bg-white/10 hover:bg-[#F3D898] hover:text-[#0A6473] transition-all hover:scale-110 duration-200"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>

        </div>

      </div>

      {/* Staff & Manager Login Modal */}
      <ManagerLoginModal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
      />

    </footer>
  );
};

export default Footer;


