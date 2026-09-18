import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ASSETS } from '../../assets/images';

export const YourTableAwaitsSection = () => {
  const navigate = useNavigate();

  const handleReserveClick = (e) => {
    e.preventDefault();
    navigate('/reservation');
  };

  return (
    <section className="relative w-full h-[70vh] sm:h-[80vh] md:h-[90vh] lg:h-screen overflow-hidden flex items-center justify-center">
      
      {/* Fullbleed Background Image (2ndimage.png) */}
      <img
        src={ASSETS.secondImage}
        alt="Your Table Awaits at Sagē Café"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
        draggable={false}
      />

      {/* Subtle Filmic Overlay for Crisp Text Readability */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none z-[1]" />

      {/* Centered Editorial Typography & CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-20 flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto pointer-events-auto select-none"
      >
        {/* Main Serif All-Caps Heading - Single line & Refined size */}
        <h2
          className="text-white font-serif font-light text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[0.1em] leading-none drop-shadow-[0_4px_25px_rgba(0,0,0,0.7)] uppercase whitespace-nowrap"
          style={{ fontFamily: "'Cormorant Garamond', 'Belleza', serif" }}
        >
          YOUR TABLE AWAITS
        </h2>

        {/* Cursive Handwritten Subtitle - Single line & Refined */}
        <span
          className="text-white text-xl sm:text-3xl md:text-4xl lg:text-5xl -mt-1 sm:-mt-2 md:-mt-3 font-normal tracking-wide drop-shadow-[0_3px_12px_rgba(0,0,0,0.8)] whitespace-nowrap"
          style={{ fontFamily: "'Covered By Your Grace', 'Caveat', cursive" }}
        >
          in the heart of lucknow
        </span>

        {/* Minimal Luxury White Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 sm:mt-8 md:mt-10 relative z-30"
        >
          <button
            type="button"
            onClick={handleReserveClick}
            className="bg-white hover:bg-stone-100 text-[#0A6473] hover:text-[#074752] px-7 sm:px-9 md:px-10 py-3 sm:py-3.5 shadow-2xl text-[11px] sm:text-xs tracking-[0.25em] uppercase font-semibold transition-all duration-300 inline-flex items-center justify-center cursor-pointer pointer-events-auto border-none outline-none"
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
          >
            RESERVE A TABLE
          </button>
        </motion.div>
      </motion.div>

    </section>
  );
};

export default YourTableAwaitsSection;
