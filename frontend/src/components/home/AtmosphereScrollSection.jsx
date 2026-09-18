import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ASSETS } from '../../assets/images';

const SHOWCASE_SLIDES = [
  {
    id: '01',
    title: 'DAY LINGERS',
    script: 'into golden hour',
    image: ASSETS.dayView,
    alt: 'Daytime sunlit terrace at Sagē Café',
  },
  {
    id: '02',
    title: 'TIME SLOWS',
    script: 'between pages & quiet thought',
    image: ASSETS.library,
    alt: 'Cozy library sanctuary at Sagē Café',
  },
  {
    id: '03',
    title: 'NIGHT UNFOLDS',
    script: 'under warm acoustic lights',
    image: ASSETS.openMic,
    alt: 'Live open mic evening at Sagē Café',
  },
];

export const AtmosphereScrollSection = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Slide 2 overlaps Slide 1 from the LEFT to RIGHT between 10% and 45% scroll
  const slide1X = useTransform(scrollYProgress, [0.1, 0.45], ['-100%', '0%']);

  // Slide 3 overlaps Slide 2 from the LEFT to RIGHT between 55% and 90% scroll
  const slide2X = useTransform(scrollYProgress, [0.55, 0.9], ['-100%', '0%']);

  return (
    <section ref={containerRef} className="relative w-full h-[320vh] bg-black">

      {/* Pinned Fullscreen Viewport Window */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">

        {/* Slide 0 (Base Layer - DAY LINGERS) */}
        <div className="absolute inset-0 z-10 w-full h-full overflow-hidden">
          <img
            src={SHOWCASE_SLIDES[0].image}
            alt={SHOWCASE_SLIDES[0].alt}
            className="w-full h-full object-cover object-center select-none"
            draggable={false}
          />
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none select-none">
            <h2
              className="text-white font-serif font-light text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.08em] leading-none drop-shadow-lg uppercase"
              style={{ fontFamily: "'Cormorant Garamond', 'Belleza', serif" }}
            >
              {SHOWCASE_SLIDES[0].title}
            </h2>
            <span
              className="text-[#A2D49C] text-3xl sm:text-5xl md:text-6xl lg:text-7xl -mt-2 sm:-mt-4 md:-mt-7 font-normal tracking-wide drop-shadow-md"
              style={{ fontFamily: "'Covered By Your Grace', 'Caveat', cursive" }}
            >
              {SHOWCASE_SLIDES[0].script}
            </span>
          </div>
        </div>

        {/* Slide 1 (Overlapping Layer 1 - TIME SLOWS - enters smoothly from left to right) */}
        <motion.div
          style={{ x: slide1X }}
          className="absolute inset-0 z-20 w-full h-full overflow-hidden will-change-transform"
        >
          <img
            src={SHOWCASE_SLIDES[1].image}
            alt={SHOWCASE_SLIDES[1].alt}
            className="w-full h-full object-cover object-center select-none"
            draggable={false}
          />
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none select-none">
            <h2
              className="text-white font-serif font-light text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.08em] leading-none drop-shadow-lg uppercase"
              style={{ fontFamily: "'Cormorant Garamond', 'Belleza', serif" }}
            >
              {SHOWCASE_SLIDES[1].title}
            </h2>
            <span
              className="text-[#A2D49C] text-3xl sm:text-5xl md:text-6xl lg:text-7xl -mt-2 sm:-mt-4 md:-mt-7 font-normal tracking-wide drop-shadow-md"
              style={{ fontFamily: "'Covered By Your Grace', 'Caveat', cursive" }}
            >
              {SHOWCASE_SLIDES[1].script}
            </span>
          </div>
        </motion.div>

        {/* Slide 2 (Overlapping Layer 2 - NIGHT UNFOLDS - enters smoothly from left to right) */}
        <motion.div
          style={{ x: slide2X }}
          className="absolute inset-0 z-30 w-full h-full overflow-hidden will-change-transform"
        >
          <img
            src={SHOWCASE_SLIDES[2].image}
            alt={SHOWCASE_SLIDES[2].alt}
            className="w-full h-full object-cover object-center select-none"
            draggable={false}
          />
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none select-none">
            <h2
              className="text-white font-serif font-light text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.08em] leading-none drop-shadow-lg uppercase"
              style={{ fontFamily: "'Cormorant Garamond', 'Belleza', serif" }}
            >
              {SHOWCASE_SLIDES[2].title}
            </h2>
            <span
              className="text-[#A2D49C] text-3xl sm:text-5xl md:text-6xl lg:text-7xl -mt-2 sm:-mt-4 md:-mt-7 font-normal tracking-wide drop-shadow-md"
              style={{ fontFamily: "'Covered By Your Grace', 'Caveat', cursive" }}
            >
              {SHOWCASE_SLIDES[2].script}
            </span>
          </div>
        </motion.div>

        {/* Bottom-Center Minimal Scroll Progress Bar / Loader */}
        <div className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 z-40 pointer-events-none flex flex-col items-center">
          <div className="relative w-28 sm:w-40 md:w-48 h-[2px] bg-white/25 rounded-full overflow-hidden">
            <motion.div
              style={{ scaleX: scrollYProgress, transformOrigin: 'left' }}
              className="absolute inset-0 w-full h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] rounded-full"
            />
          </div>
        </div>

      </div>

    </section>
  );
};

export default AtmosphereScrollSection;

