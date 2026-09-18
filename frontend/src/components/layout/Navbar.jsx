import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, X, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../../store/useCartStore';
import { useUIStore } from '../../store/useUIStore';
import { ASSETS } from '../../assets/images';
import { WineGlassDoodle } from '../../assets/icons/DoodleIcons';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const totalCount = useCartStore((state) => state.getTotalCount());
  const [copiedEmail, setCopiedEmail] = useState(false);
  const {
    toggleCart,
    openReserveModal,
    isMobileMenuOpen,
    toggleMobileMenu,
    setMobileMenuOpen,
  } = useUIStore();

  const handleCopyEmail = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText('hello@sagecafe.in');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  // Lock body & document scroll completely whenever menu is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleNavigate = (path) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  const handleScrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 350);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navMenuItems = [
    { label: 'HOME', action: () => handleNavigate('/') },
    { label: 'ABOUT', action: () => handleNavigate('/story') },
    { label: 'MENU', action: () => handleNavigate('/menu') },
    { label: 'GALLERY', action: () => handleNavigate('/gallery') },
    { label: 'EVENTS', action: () => handleNavigate('/events') },
    { label: 'RESERVATIONS', action: () => handleNavigate('/reservation') },
    { label: 'FIND US', action: () => handleNavigate('/find-us') },
  ];

  return (
    <>
      {/* Attached Header (Firmly locked to Slide 1's top edge) */}
      <header className="absolute top-0 left-0 right-0 z-50 pt-4 sm:pt-6 md:pt-8 pb-3 px-4 sm:px-8 md:px-12 pointer-events-none select-none">
        <div className="relative w-full flex items-center justify-between">
          
          {/* 1. LEFT: Navigation Links (FIND US & MENU with responsive text size) */}
          <div className="hidden sm:flex items-center gap-5 md:gap-8 lg:gap-12 pointer-events-auto">
            <button
              onClick={() => handleNavigate('/find-us')}
              style={{ fontFamily: '"Belleza", "Italiana", "Stevie Sans", "Plus Jakarta Sans", sans-serif' }}
              className="text-sm sm:text-base md:text-lg lg:text-2xl font-normal tracking-[0.16em] uppercase text-white hover:text-[#F3D898] transition-all duration-300 cursor-pointer drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] hover:scale-105"
            >
              FIND US
            </button>
            <button
              onClick={() => handleNavigate('/menu')}
              style={{ fontFamily: '"Belleza", "Italiana", "Stevie Sans", "Plus Jakarta Sans", sans-serif' }}
              className="text-sm sm:text-base md:text-lg lg:text-2xl font-normal tracking-[0.16em] uppercase text-white hover:text-[#F3D898] transition-all duration-300 cursor-pointer drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] hover:scale-105"
            >
              MENU
            </button>
          </div>

          {/* Spacer for small screens to center logo */}
          <div className="sm:hidden w-8" />

          {/* 2. CENTER: Large Sagē Café Luxury Brand Logo (Exact 50% Horizontal Middle) */}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group text-center pointer-events-auto"
          >
            <img
              src={ASSETS.cafeName}
              alt="Sagē Café"
              className={`h-10 xs:h-11 sm:h-12 md:h-14 lg:h-16 w-auto object-contain transition-all duration-300 group-hover:scale-105 ${
                isHomePage
                  ? 'drop-shadow-[0_3px_10px_rgba(27,54,93,0.18)]'
                  : 'filter brightness-0 invert drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]'
              }`}
            />
          </Link>

          {/* 3. RIGHT: Animated Hamburger ↔ Cross Morphing Icon Button */}
          <div className="flex items-center pointer-events-auto">
            <button
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? "Close Navigation Menu" : "Toggle Navigation Menu"}
              className="p-1.5 sm:p-2 flex flex-col justify-center items-end gap-[4px] sm:gap-[6px] text-white hover:text-[#F3D898] transition-all cursor-pointer group active:scale-95"
            >
              <motion.span
                animate={isMobileMenuOpen ? { rotate: 45, y: 7.5, width: '28px' } : { rotate: 0, y: 0, width: '20px' }}
                transition={{ duration: 0.35, ease: [0.77, 0, 0.175, 1] }}
                className="h-[2.5px] bg-white group-hover:bg-[#F3D898] transition-colors rounded-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] origin-center"
              />
              <motion.span
                animate={isMobileMenuOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0, width: '32px' }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="h-[2.5px] bg-white group-hover:bg-[#F3D898] transition-colors rounded-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]"
              />
              <motion.span
                animate={isMobileMenuOpen ? { rotate: -45, y: -7.5, width: '28px' } : { rotate: 0, y: 0, width: '20px' }}
                transition={{ duration: 0.35, ease: [0.77, 0, 0.175, 1] }}
                className="h-[2.5px] bg-white group-hover:bg-[#F3D898] transition-colors rounded-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] origin-center"
              />
            </button>
          </div>

        </div>
      </header>

      {/* =========================================================================
          FULLSCREEN TOP-DOWN CURTAIN SLIDE NAVIGATION MENU (Luxury Deep Ocean Teal/Blue with Rounded Bottom)
          ========================================================================= */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Dark Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm cursor-pointer"
            />

            <motion.div
              initial={{ y: '-100%' }}
              animate={{ y: '0%' }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.65, ease: [0.77, 0, 0.175, 1] }}
              className="fixed top-0 left-0 right-0 z-[9999] w-full h-[100dvh] pointer-events-auto select-none"
            >
              {/* Inner Fullscreen Modal Container (Strictly Fit without Scrollbars) */}
              <div className="relative w-full h-full bg-gradient-to-b from-[#09414E] via-[#0D4E5C] to-[#07323C] text-[#FAF7F2] flex flex-col justify-between p-3.5 xs:p-4 sm:p-6 md:p-8 lg:p-10 overflow-hidden shadow-[0_35px_100px_rgba(0,0,0,0.7)]">
                {/* Subtle Luxury Watermark Overlay Background */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.05] flex items-center justify-center overflow-hidden">
                  <span
                    style={{ fontFamily: '"Tan Mon Cheri", "Italiana", serif' }}
                    className="text-[40vw] font-bold text-white tracking-tighter leading-none select-none"
                  >
                    SAGĒ
                  </span>
                </div>

                {/* TOP BAR: Brand & Close Button */}
                <div className="relative z-10 w-full flex items-center justify-between border-b border-white/15 pb-2.5 sm:pb-3.5 min-h-[44px] sm:min-h-[52px] flex-shrink-0">
                  {/* Top-Left Balance Spacer */}
                  <div className="w-8 sm:w-10" />

                  {/* Top-Center Brand Logo */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                    <img
                      src={ASSETS.cafeName}
                      alt="Sagē Café"
                      className="h-8 sm:h-10 md:h-12 w-auto object-contain filter brightness-0 invert opacity-100 drop-shadow-[0_4px_16px_rgba(0,0,0,0.4)] transition-transform duration-300"
                    />
                  </div>

                  {/* Top-Right Close Button */}
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close Navigation Menu"
                    className="p-1 sm:p-1.5 text-[#FAF7F2] hover:text-[#F3D898] transition-all duration-300 cursor-pointer group active:scale-90"
                  >
                    <motion.div
                      whileHover={{ rotate: 90, scale: 1.15 }}
                      whileTap={{ rotate: 180, scale: 0.85 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="flex items-center justify-center"
                    >
                      <X className="w-6 h-6 sm:w-7 sm:h-7 text-[#FAF7F2] group-hover:text-[#F3D898] transition-colors stroke-[2]" />
                    </motion.div>
                  </button>
                </div>

                {/* CENTER: Main Editorial Navigation Menu List (Fitted Proportionately) */}
                <div className="relative z-10 my-auto py-1.5 sm:py-3 flex flex-col items-center justify-center text-center gap-1 xs:gap-1.5 sm:gap-2.5 md:gap-3.5 lg:gap-4 w-full max-w-2xl mx-auto px-4 flex-shrink-0">
                  {navMenuItems.map((item, idx) => (
                    <motion.button
                      key={item.label}
                      initial={{ opacity: 0, y: -12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + idx * 0.035, duration: 0.3, ease: 'easeOut' }}
                      onClick={item.action}
                      style={{
                        fontFamily: '"Belleza", "Italiana", "Syne", "Tan Mon Cheri", "Stevie Sans", serif',
                      }}
                      className="group relative w-full flex items-center justify-center text-xl xs:text-2xl sm:text-3xl md:text-[34px] lg:text-[38px] xl:text-[42px] text-[#FAF7F2] hover:text-[#F3D898] hover:scale-105 transition-all duration-300 font-normal tracking-[0.08em] hover:tracking-[0.12em] uppercase text-center cursor-pointer leading-tight py-0.5 sm:py-1"
                    >
                      <span className="relative z-10">{item.label}</span>
                    </motion.button>
                  ))}
                </div>

                {/* BOTTOM BAR: Say Hello & Email with Copy Button */}
                <div className="relative z-10 pt-2 sm:pt-3 pb-1 border-t border-white/15 flex flex-col items-center justify-center text-center gap-1 w-full flex-shrink-0">
                  {/* Script / Cursive Eyebrow */}
                  <span
                    style={{ fontFamily: '"Tan Mon Cheri", "Caveat", "Playfair Display", "Italiana", cursive, serif' }}
                    className="text-[#F3D898] text-xs sm:text-sm font-medium tracking-wide drop-shadow-sm"
                  >
                    Say hello
                  </span>

                  {/* Email address with Copy to Clipboard button */}
                  <div className="flex items-center gap-2 group/email">
                    <a
                      href="mailto:hello@sagecafe.in"
                      className="text-xs sm:text-sm md:text-base font-sans font-medium text-[#FAF7F2] hover:text-[#F3D898] transition-colors tracking-tight select-text"
                    >
                      hello@sagecafe.in
                    </a>

                    <button
                      onClick={handleCopyEmail}
                      title={copiedEmail ? "Copied!" : "Copy Email"}
                      aria-label="Copy Email Address"
                      className="p-1 rounded-md border border-white/20 hover:border-[#F3D898] bg-white/5 hover:bg-white/10 text-white/80 hover:text-[#F3D898] transition-all cursor-pointer active:scale-90 flex items-center justify-center"
                    >
                      {copiedEmail ? (
                        <Check className="w-3 h-3 text-[#86EFAC]" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>

                  <div className="text-[9px] sm:text-[10px] tracking-[0.2em] text-[#FAF7F2]/60 font-sans uppercase">
                    SAGĒ CAFÉ • HAZRATGANJ, LUCKNOW
                  </div>
                </div>
              </div>

              {/* Bottom Continuous Convex Curved Arc Dome (Visible leading curved edge during slide-down animation) */}
              <div className="absolute top-[99.5%] left-0 right-0 w-full pointer-events-none z-50 leading-none">
                <svg
                  viewBox="0 0 1440 180"
                  className="w-full h-[65px] sm:h-[105px] md:h-[145px] lg:h-[185px] block min-w-full drop-shadow-[0_25px_50px_rgba(0,0,0,0.85)]"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M 0,0 L 1440,0 Q 720,180 0,0 Z"
                    fill="#07323C"
                  />
                </svg>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
