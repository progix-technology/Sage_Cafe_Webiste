import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ASSETS } from '../../assets/images';

// Rolling Digit Component: animates each digit sliding up from the bottom
const RollingDigit = ({ digit }) => {
  return (
    <span className="relative inline-flex items-center justify-center h-[1.15em] w-[0.62em] overflow-hidden leading-none select-none">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={digit}
          initial={{ y: '100%', opacity: 0.2 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.05, ease: 'easeOut' }}
          className="absolute inset-0 flex items-center justify-center w-full h-full"
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export const SplashScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isDissolving, setIsDissolving] = useState(false);

  useEffect(() => {
    // Continuous 0 to 100% counter progression
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setProgress(current);

      if (current >= 100) {
        clearInterval(interval);
        // Step 1: Start the bottom-up dissolve on the logo
        setIsDissolving(true);
        // Step 2: Trigger the shutter split reveal immediately after logo dissolves
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 320);
      }
    }, 18);

    return () => clearInterval(interval);
  }, [onComplete]);

  const formattedProgress = progress >= 100 ? '100' : String(progress).padStart(2, '0');
  const digits = formattedProgress.split('');

  // Cinematic easing curve for luxury curtain split
  const transitionEase = [0.85, 0, 0.15, 1];

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none select-none overflow-hidden bg-transparent">

      {/* =========================================================================
          1. UNDERLYING WARM GOLD LAYER (Layer 1 - reveals after teal split, slides gently slower)
         ========================================================================= */}
      {/* Left Gold Shutter */}
      <motion.div
        initial={{ x: '0%', skewX: 20 }}
        animate={{ x: '0%', skewX: 20 }}
        exit={{ x: '-100%', skewX: 20 }}
        transition={{ duration: 1.25, ease: [0.72, 0, 0.18, 1], delay: 0.16 }}
        className="absolute top-[-50vh] bottom-[-50vh] left-[-100vw] w-[200vw] bg-[#EAD9BE] z-10 pointer-events-none origin-center"
      />

      {/* Right Gold Shutter */}
      <motion.div
        initial={{ x: '0%', skewX: 20 }}
        animate={{ x: '0%', skewX: 20 }}
        exit={{ x: '100%', skewX: 20 }}
        transition={{ duration: 1.25, ease: [0.72, 0, 0.18, 1], delay: 0.16 }}
        className="absolute top-[-50vh] bottom-[-50vh] right-[-100vw] w-[200vw] bg-[#EAD9BE] z-10 pointer-events-none origin-center"
      />

      {/* =========================================================================
          2. TOP MAIN DEEP TEAL LAYER (Layer 2 - Seamless solid #0A6473 matching Footer, splits first)
         ========================================================================= */}
      {/* Left Teal Shutter */}
      <motion.div
        initial={{ x: '0%', skewX: 20 }}
        animate={{ x: '0%', skewX: 20 }}
        exit={{ x: '-100%', skewX: 20 }}
        transition={{ duration: 0.85, ease: transitionEase, delay: 0 }}
        className="absolute top-[-50vh] bottom-[-50vh] left-[-100vw] w-[200vw] bg-[#0A6473] z-20 pointer-events-none origin-center"
      />

      {/* Right Teal Shutter */}
      <motion.div
        initial={{ x: '0%', skewX: 20 }}
        animate={{ x: '0%', skewX: 20 }}
        exit={{ x: '100%', skewX: 20 }}
        transition={{ duration: 0.85, ease: transitionEase, delay: 0 }}
        className="absolute top-[-50vh] bottom-[-50vh] right-[-100vw] w-[200vw] bg-[#0A6473] z-20 pointer-events-none origin-center"
      />

      {/* =========================================================================
          3. FOREGROUND CONTENT (Top Brand Logo + Center Mug Fill + Counter)
         ========================================================================= */}
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0 z-30 flex flex-col justify-between p-6 sm:p-10 md:p-14 text-[#FAF7F2] pointer-events-auto"
      >
        
        {/* Top Header: Crisp Pure White Brand Logo (Top-Left) */}
        <div className="w-full flex items-center justify-between">
          <img
            src={ASSETS.cafeName}
            alt="Sagē Café"
            className="h-14 sm:h-18 md:h-22 lg:h-24 w-auto object-contain filter brightness-0 invert opacity-100 drop-shadow-[0_2px_12px_rgba(0,0,0,0.25)]"
          />
        </div>

        {/* Center: Official Coffee Mug with Bottom-to-Top Fill and Bottom-Up Dissolve Fade */}
        <div className="flex flex-col items-center justify-center relative my-auto">
          <div
            className={`relative w-44 h-44 sm:w-60 sm:h-60 flex items-center justify-center transition-all duration-300 ease-out ${
              isDissolving ? 'opacity-0 scale-95 translate-y-[-8px]' : 'opacity-100 scale-100 translate-y-0'
            }`}
            style={{
              maskImage: isDissolving
                ? 'linear-gradient(to top, transparent 0%, transparent 35%, black 100%)'
                : 'none',
              WebkitMaskImage: isDissolving
                ? 'linear-gradient(to top, transparent 0%, transparent 35%, black 100%)'
                : 'none',
            }}
          >

            {/* Layer A: Muted silhouette of the coffee mug */}
            <div
              className="w-full h-full absolute inset-0"
              style={{
                maskImage: `url(${ASSETS.coffeeLogo})`,
                WebkitMaskImage: `url(${ASSETS.coffeeLogo})`,
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskPosition: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                opacity: 0.9,
              }}
            />

            {/* Layer B: Solid Warm Cream / Gold Fill (Rising up dynamically with progress) */}
            <div
              className="w-full h-full absolute inset-0"
              style={{
                maskImage: `url(${ASSETS.coffeeLogo})`,
                WebkitMaskImage: `url(${ASSETS.coffeeLogo})`,
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskPosition: 'center',
                backgroundColor: '#F3D898',
                clipPath: `inset(${100 - progress}% 0 0 0)`,
                transition: 'clip-path 40ms linear',
              }}
            />

          </div>
        </div>

        {/* Bottom Bar: 000% to 100% Rolling Counter & Skip Button */}
        <div
          className={`flex items-end justify-between transition-opacity duration-300 ${
            isDissolving ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="flex items-baseline font-mono font-black text-[#FAF7F2] tracking-tight leading-none select-none">
            {/* Dynamic Bottom-to-Top Rolling Slot Ticker */}
            <div className="flex items-center text-6xl sm:text-8xl leading-none">
              {digits.map((d, index) => (
                <RollingDigit key={index} digit={d} />
              ))}
            </div>
            <span className="text-2xl sm:text-4xl font-bold ml-1 text-[#F3D898] opacity-90">
              %
            </span>
          </div>

          {/* Skip Button */}
          <button
            onClick={() => {
              if (onComplete) onComplete();
            }}
            className="text-xs font-display uppercase tracking-[0.25em] text-[#FAF7F2]/75 hover:text-[#F3D898] transition-colors pb-2 cursor-pointer"
          >
            Skip →
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
