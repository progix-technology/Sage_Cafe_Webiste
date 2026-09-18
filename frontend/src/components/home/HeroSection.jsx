import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ASSETS } from '../../assets/images';
import { Navbar } from '../layout/Navbar';

export const HeroSection = () => {
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll progression tracker for hero pinned slide
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Smooth scroll-driven sink & rotation as user scrolls down from middle
  const platterY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [0, 360]
  );

  const platterRotate = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [0, 16]
  );

  const platterScale = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [1, 1] : [1, 0.94]
  );

  return (
    <div className="relative w-full">
      {/* Pinned Scroll Track for Hero -> Smooth Sink & Slide Transition (160vh) */}
      <div
        ref={containerRef}
        className="relative w-full"
        style={{ height: '160vh' }}
      >
        {/* Pinned Sticky Viewport (100vh) */}
        <div className="sticky top-0 w-full h-screen overflow-hidden z-0">

          {/* Layer 1: Hero Background (bg1.png) - z-index: 1 */}
          <div className="absolute inset-0 w-full h-full z-[1]">
            <img
              src={ASSETS.heroBg}
              alt="Sagē Café Luxury Atmosphere"
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover object-[center_center] select-none"
            />
          </div>

          {/* Layer: Decorative Olive Tree Branch (Right-To-Left Growing Reveal + Organic Swaying) */}
          <motion.div
            initial={{ opacity: 0, clipPath: 'inset(0% 0% 0% 100%)' }}
            animate={{ opacity: 0.88, clipPath: 'inset(0% 0% 0% 0%)' }}
            transition={{
              duration: 2.2,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.3,
            }}
            className="absolute top-[70px] xs:top-[78px] sm:top-[105px] md:top-[120px] lg:top-[130px] -right-2 xs:right-0 sm:right-[56px] md:right-[80px] lg:right-[105px] xl:right-[130px] z-[3] pointer-events-none select-none w-[120px] xs:w-[135px] sm:w-[220px] md:w-[270px] lg:w-[310px] xl:w-[340px] opacity-70 sm:opacity-88"
          >
            <motion.div
              style={{ transformOrigin: '100% 52%' }}
              animate={{
                rotate: [-3.5, 2.5, -4, 1.8, -3.5],
              }}
              transition={{
                duration: 7.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-full h-auto origin-[100%_52%]"
            >
              <img
                src={ASSETS.treeBranch}
                alt="Decorative Olive Tree Branch"
                className="w-full h-auto object-contain filter drop-shadow-[0_4px_16px_rgba(27,54,93,0.12)]"
              />
            </motion.div>
          </motion.div>

          {/* Layer 2: Navbar Fixed to Slide 1 (Firmly anchored, exact 50% center logo) */}
          <Navbar />

          {/* =====================================================================
              HERO CENTER CONTENT (Curved Circular Arc Typography)
              ===================================================================== */}
          <div className="absolute top-[38vh] xs:top-[36vh] sm:top-[8vh] md:top-[1.5vh] lg:top-[2vh] inset-x-0 z-[4] flex flex-col items-center justify-center text-center px-2 sm:px-4 pointer-events-auto select-none">
            {/* Curved / Circular Arc Typography (Headline + Subtitle with Staggered Left-to-Right Entrance Animation) */}
            <div className="relative w-full max-w-[760px] xs:max-w-[820px] sm:max-w-[800px] md:max-w-[940px] lg:max-w-[1060px] flex justify-center items-center">
              {/* 1. Main Headline Extra Round Curved SVG (First: Left to Right Reveal) */}
              <motion.div
                initial={{ clipPath: 'inset(0% 100% 0% 0%)', opacity: 0 }}
                animate={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
                transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                className="w-full flex justify-center items-center"
              >
                <svg
                  viewBox="0 0 1000 370"
                  className="w-full h-auto block overflow-visible"
                >
                  <path
                    id="momentsCurveArchPath"
                    d="M 50,300 Q 500,5 950,300"
                    fill="transparent"
                  />
                  <text
                    className="font-serif text-[96px] xs:text-[100px] sm:text-[56px] md:text-[60px] lg:text-[64px] tracking-[0.02em] font-medium"
                  >
                    <textPath href="#momentsCurveArchPath" startOffset="50%" textAnchor="middle">
                      <tspan
                        fill="#1B365D"
                        style={{ fontFamily: '"Cormorant Garamond", "Italiana", "Playfair Display", "Belleza", serif' }}
                      >
                        Moments{' '}
                      </tspan>
                      <tspan
                        fill="#567E9F"
                        fontStyle="italic"
                        style={{ fontFamily: '"Cormorant Garamond", "Italiana", "Playfair Display", "Belleza", serif' }}
                      >
                        Taste{' '}
                      </tspan>
                      <tspan
                        fill="#1B365D"
                        style={{ fontFamily: '"Cormorant Garamond", "Italiana", "Playfair Display", "Belleza", serif' }}
                      >
                        Better
                      </tspan>
                    </textPath>
                  </text>
                </svg>
              </motion.div>

              {/* 2. Subtitle Concentric Matching Round SVG (Second: Left to Right Reveal Staggered After Headline) */}
              <motion.div
                initial={{ clipPath: 'inset(0% 100% 0% 0%)', opacity: 0 }}
                animate={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
                transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 1.2 }}
                className="absolute inset-0 w-full h-full flex justify-center items-center pointer-events-none"
              >
                <svg
                  viewBox="0 0 1000 370"
                  className="w-full h-auto block overflow-visible"
                >
                  <path
                    id="cozyCafeCurveArchPath"
                    d="M 70,360 Q 500,85 930,360"
                    fill="transparent"
                  />
                  <text
                    className="text-[28px] xs:text-[30px] sm:text-[17px] md:text-[18px] lg:text-[18.5px] tracking-[0.03em] font-semibold sm:font-normal"
                  >
                    <textPath
                      href="#cozyCafeCurveArchPath"
                      startOffset="50%"
                      textAnchor="middle"
                      fill="#2B4666"
                      style={{ fontFamily: '"Plus Jakarta Sans", "Outfit", "Inter", sans-serif' }}
                    >
                      A cozy caf&eacute; for thoughtful food, great coffee and brighter days.
                    </textPath>
                  </text>
                </svg>
              </motion.div>
            </div>
          </div>

          {/* =====================================================================
              CENTERPIECE PLATTER (Straight Pure Vertical Scroll Sink - No Rotation)
              ===================================================================== */}
          <div className="absolute inset-0 z-[3] pointer-events-none select-none flex items-center justify-center pt-[70vh] xs:pt-[66vh] sm:pt-[58vh] md:pt-[60vh] lg:pt-[60vh]">
            <motion.div
              style={{
                y: platterY,
                willChange: 'transform',
              }}
              className="w-full max-w-[350px] xs:max-w-[380px] sm:max-w-[420px] md:max-w-[500px] lg:max-w-[580px] xl:max-w-[640px] flex justify-center items-center px-4"
            >
              <img
                src={ASSETS.startImage}
                alt="Sagē Café Artisanal Platter"
                className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
              />
            </motion.div>
          </div>

          {/* =====================================================================
              BOTTOM CONCAVE WAVE WITH CURVED BLUE ACCENT LINES (z-index: 10)
              ===================================================================== */}
          <div className="absolute -bottom-[2px] left-0 right-0 w-full z-10 pointer-events-none select-none leading-none overflow-visible">
            <svg
              viewBox="0 0 1440 180"
              className="w-full h-14 sm:h-20 md:h-28 lg:h-36 block min-w-full relative z-10 drop-shadow-[0_-8px_20px_rgba(0,0,0,0.12)] translate-y-[2px] overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="blueWaveLineGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1B365D" stopOpacity="0.9" />
                  <stop offset="25%" stopColor="#244B7A" stopOpacity="0.75" />
                  <stop offset="55%" stopColor="#4A729A" stopOpacity="0.38" />
                  <stop offset="85%" stopColor="#82A7C9" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#1B365D" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* White Base Concave Wave Fill */}
              <path
                d="M 0,0 Q 720,180 1440,0 L 1440,190 L 0,190 Z"
                fill="#FFFFFF"
              />

              {/* Decorative Curved Blue Contour / Wave Line Coming from Left Side */}
              {/* Line 1: Primary Crest Stroke right along the wave curve */}
              <path
                d="M -10,0 Q 720,180 1440,0"
                fill="none"
                stroke="url(#blueWaveLineGrad1)"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
            </svg>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroSection;
