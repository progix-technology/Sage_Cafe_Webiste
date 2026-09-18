import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ASSETS } from '../../assets/images';
import { CoffeeCupDoodle } from '../../assets/icons/DoodleIcons';

export const HeroWaveSection = () => {
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Subtle luxury parallax for panoramic image
  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [-35, 35]
  );

  return (
    <section
      ref={containerRef}
      className="relative z-10 w-full bg-white text-[#1D120B] overflow-hidden"
    >
      {/* =========================================================================
          1. UPPER CREAM SECTION: Editorial Text & Metadata (Far Corners)
          ========================================================================= */}
      <div className="w-full pt-7 sm:pt-14 md:pt-18 pb-4 sm:pb-8 md:pb-10 px-5 sm:px-10 md:px-12 lg:px-14 xl:px-16 bg-white">
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-10">

          {/* Left Corner: Divider Line + Editorial Atmosphere Paragraph */}
          <div className="max-w-[300px] xs:max-w-[340px] sm:max-w-[420px] md:max-w-[460px] text-left">
            <div className="w-20 sm:w-36 md:w-44 h-[1.5px] bg-[#636696] mb-3 sm:mb-4 opacity-90" />
            <p
              style={{
                fontFamily: '"Stevie Sans", "Plus Jakarta Sans", "Inter", "Helvetica Neue", Arial, sans-serif',
                color: '#636696',
              }}
              className="text-[11px] xs:text-[12px] sm:text-[14px] leading-[18px] xs:leading-[20px] sm:leading-[24px] font-normal tracking-[0.01em]"
            >
              Arrival begins where the bustling city slows down: freshly ground roasts, warm afternoon light, and cozy wooden tables introduce Sagē Café as a sanctuary for slow mornings, artisanal plates, and easy evenings in the heart of the city.
            </p>
          </div>

          {/* Right Corner: Doodle Icon + Uppercase Metadata */}
          <div className="flex flex-col md:items-end text-left md:text-right select-none">
            <div className="text-[#7FA382] -rotate-6 transition-transform hover:rotate-0 duration-300">
              <CoffeeCupDoodle className="w-10 sm:w-16 md:w-20 h-10 sm:h-16 md:h-20 text-[#7FA382]" />
            </div>
            <span
              style={{
                fontFamily: '"Stevie Sans", "Plus Jakarta Sans", "Helvetica Neue", Arial, sans-serif',
                color: '#636696',
              }}
              className="text-[9.5px] xs:text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase font-medium mt-1"
            >
              SAGĒ CAFÉ • ARTISANAL ROASTERY
            </span>
          </div>

        </div>
      </div>

      {/* =========================================================================
          2. SEAMLESS PANORAMIC IMAGE + TOP WAVE OVERLAY
          Top wave SVG is anchored at top-0 of image container with exact #FFFFFF fill
          ========================================================================= */}
      <div className="relative w-full -mt-[2px] min-h-[500px] sm:min-h-[600px] md:min-h-[720px] lg:min-h-[820px] overflow-hidden">

        {/* Parallax Image Container */}
        <motion.div
          style={{
            y: imageY,
            willChange: 'transform',
          }}
          className="absolute inset-0 w-full h-[120%] -top-[10%]"
        >
          <img
            src={ASSETS.secondImage}
            alt="Sagē Café Cozy Atmosphere"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-[center_18%] select-none"
          />
          {/* Subtle Ambient Vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-black/40 pointer-events-none" />
        </motion.div>

        {/* Center Typography Overlay: Café Vibe Headline & Flowing Script */}
        <div className="absolute inset-0 z-15 flex flex-col items-center justify-center text-center px-4 pointer-events-none select-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <h2
              style={{
                fontFamily: '"Cormorant Garamond", "Belleza", "Italiana", serif',
              }}
              className="text-white text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[74px] font-normal tracking-[0.06em] uppercase leading-none drop-shadow-[0_4px_20px_rgba(0,0,0,0.45)]"
            >
              COME FOR THE COFFEE
            </h2>
            <span
              style={{
                fontFamily: '"Caveat", "Covered By Your Grace", cursive',
              }}
              className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl -mt-2 sm:-mt-3 md:-mt-4 font-normal tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]"
            >
              stay for the feeling
            </span>
          </motion.div>
        </div>

        {/* Top Wave Divider: Lowered graceful wave curve with overlap */}
        <div className="absolute -top-[2px] left-0 right-0 w-full pointer-events-none select-none z-10 leading-none">
          <svg
            viewBox="0 0 1440 120"
            className="w-full h-auto block min-w-full -translate-y-[1px]"
            preserveAspectRatio="none"
          >
            <path
              d="M 0,-4 L 1440,-4 L 1440,68 C 1280,60 1120,35 860,32 C 580,32 340,84 0,102 Z"
              fill="#FFFFFF"
            />
          </svg>
        </div>
      </div>

    </section>
  );
};

export default HeroWaveSection;
