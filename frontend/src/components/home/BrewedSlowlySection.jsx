import React from 'react';
import { motion } from 'framer-motion';
import { ASSETS } from '../../assets/images';

export const BrewedSlowlySection = () => {
  return (
    <section className="relative w-full h-screen min-h-[700px] max-h-[1080px] flex items-center justify-center bg-[#F7F2EB] text-[#1A2865] overflow-hidden select-none">

      {/* =========================================================================
          1. LEFT MONSTERA LEAF (Flush on bottom-left screen border, very subtle)
          ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, x: -25, y: 15 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-0 bottom-0 z-10 pointer-events-none"
      >
        <img
          src={ASSETS.monsteraLeafLeft}
          alt="Monstera Leaf Left"
          className="w-[85px] sm:w-[115px] md:w-[145px] lg:w-[175px] xl:w-[195px] h-auto object-contain select-none block drop-shadow-[0_10px_20px_rgba(0,0,0,0.08)]"
          style={{ transformOrigin: 'bottom left' }}
          draggable={false}
        />
      </motion.div>

      {/* =========================================================================
          2. RIGHT MONSTERA LEAF (Flush on top-right screen border, very subtle)
          ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, x: 25, y: -15 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="absolute right-0 top-0 sm:top-1 z-10 pointer-events-none"
      >
        <img
          src={ASSETS.monsteraLeaf}
          alt="Monstera Leaf Right"
          className="w-[85px] sm:w-[115px] md:w-[145px] lg:w-[175px] xl:w-[195px] h-auto object-contain select-none block drop-shadow-[0_10px_20px_rgba(0,0,0,0.08)]"
          style={{ transformOrigin: 'top right' }}
          draggable={false}
        />
      </motion.div>

      {/* =========================================================================
          3. ARTISANAL BOTANICAL COFFEE BEANS LINE-ART WATERMARK BEHIND GLASS
          ========================================================================= */}
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
    <svg
      viewBox="0 0 600 600"
      className="w-[460px] sm:w-[560px] md:w-[660px] lg:w-[760px] xl:w-[840px] h-[460px] sm:h-[560px] md:h-[660px] lg:h-[760px] xl:h-[840px] -translate-y-2 sm:-translate-y-6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Soft warm botanical silhouette */}
      <path
        d="M 300,110 C 430,90 510,190 490,340 C 470,470 360,520 250,500 C 140,480 90,360 120,220 C 150,110 210,120 300,110 Z"
        fill="#EFE6D8"
        opacity="0.55"
      />

      {/* Coffee Bean 1 (Center-Left) */}
      <g stroke="#D4C4AE" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="230" cy="270" rx="90" ry="130" transform="rotate(-25 230 270)" fill="#FAF4EB" opacity="0.85" />
        <path d="M 195,155 C 240,220 210,310 265,385" strokeWidth="2.8" />
        <path d="M 200,170 C 230,225 215,290 255,370" strokeDasharray="3 4" strokeWidth="1.5" />
        {/* Inner bean texture lines */}
        <path d="M 160,240 C 180,260 190,270 200,265" strokeWidth="1.2" opacity="0.65" />
        <path d="M 175,290 C 190,305 205,310 215,300" strokeWidth="1.2" opacity="0.65" />
        <path d="M 245,220 C 260,230 275,225 290,240" strokeWidth="1.2" opacity="0.65" />
        <path d="M 240,270 C 255,280 268,285 285,295" strokeWidth="1.2" opacity="0.65" />
      </g>

      {/* Coffee Bean 2 (Center-Right, overlapping) */}
      <g stroke="#D4C4AE" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="370" cy="320" rx="95" ry="140" transform="rotate(35 370 320)" fill="#FAF4EB" opacity="0.85" />
        <path d="M 430,200 C 370,270 395,360 310,440" strokeWidth="2.8" />
        <path d="M 415,215 C 365,280 385,345 325,425" strokeDasharray="3 4" strokeWidth="1.5" />
        {/* Inner bean texture lines */}
        <path d="M 330,260 C 345,280 360,285 375,275" strokeWidth="1.2" opacity="0.65" />
        <path d="M 315,310 C 330,330 350,335 365,320" strokeWidth="1.2" opacity="0.65" />
        <path d="M 390,340 C 405,355 420,350 435,365" strokeWidth="1.2" opacity="0.65" />
        <path d="M 375,390 C 390,405 405,400 420,415" strokeWidth="1.2" opacity="0.65" />
      </g>

      {/* Botanical Coffee Branch & Leaves radiating behind beans */}
      <g stroke="#D4C4AE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
        {/* Branch stem */}
        <path d="M 120,430 C 200,380 380,240 480,140" strokeDasharray="6 4" />
        {/* Top-Right Leaf */}
        <path d="M 440,170 C 490,130 530,120 550,110 C 530,150 500,190 450,200 Z" fill="#FAF4EB" opacity="0.7" />
        <path d="M 445,185 C 490,150 520,135 550,110" strokeWidth="1.2" />
        {/* Bottom-Left Leaf */}
        <path d="M 150,390 C 90,410 70,440 60,470 C 90,460 130,440 160,400 Z" fill="#FAF4EB" opacity="0.7" />
        <path d="M 155,395 C 115,425 90,445 60,470" strokeWidth="1.2" />
        {/* Coffee Cherries / Berries */}
        <circle cx="430" cy="180" r="9" fill="#EFE6D8" stroke="#D4C4AE" strokeWidth="1.4" />
        <circle cx="446" cy="196" r="7.5" fill="#EFE6D8" stroke="#D4C4AE" strokeWidth="1.4" />
        <circle cx="165" cy="385" r="8.5" fill="#EFE6D8" stroke="#D4C4AE" strokeWidth="1.4" />
      </g>

      {/* Stippled Organic Speckles matching reference */}
      <g fill="#D4C4AE" opacity="0.6">
        <circle cx="210" cy="140" r="2.2" />
        <circle cx="240" cy="125" r="2.6" />
        <circle cx="270" cy="145" r="1.8" />
        <circle cx="150" cy="200" r="2.2" />
        <circle cx="135" cy="250" r="1.8" />
        <circle cx="120" cy="300" r="2" />
        <circle cx="180" cy="460" r="2.4" />
        <circle cx="220" cy="480" r="2" />
        <circle cx="260" cy="510" r="2.2" />
        <circle cx="340" cy="490" r="2.5" />
        <circle cx="460" cy="380" r="2" />
        <circle cx="480" cy="330" r="2.2" />
        <circle cx="490" cy="270" r="1.8" />
        <circle cx="470" cy="220" r="2.5" />
        <circle cx="390" cy="140" r="2" />
        <circle cx="350" cy="120" r="2.2" />
      </g>
    </svg>
  </div>

  {/* =========================================================================
          4. MAIN CENTER CONTENT: APERITIVO TITLE + MID DRINK + EDITORIAL COPY
          ========================================================================= */}
  <div className="relative w-full max-w-[1300px] mx-auto px-6 sm:px-10 md:px-12 lg:px-16 h-full flex flex-col justify-center items-center z-20">

    <div className="relative w-full max-w-[1000px] flex flex-col items-center justify-center">

      {/* Top Label (Aligned with the left side of APERITIVO) */}
      <div className="w-full mb-1 sm:mb-2 pl-2 sm:pl-3">
        <span
          style={{
            fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
            color: '#8E97B8',
          }}
          className="text-[10px] sm:text-[11px] md:text-[11.5px] tracking-[0.28em] uppercase font-medium block"
        >
          WHEN AFTERNOON SOFTENS
        </span>
      </div>

      {/* Luxury Serif Headline: APERITIVO */}
      <div className="w-full flex justify-center items-center relative z-0">
        <h2
          style={{
            fontFamily: '"TAN Mon Cheri", "Cormorant Garamond", "Italiana", "Belleza", "Cinzel", serif',
            color: '#1A2865',
            letterSpacing: '0.07em',
          }}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-[108px] xl:text-[124px] 2xl:text-[138px] font-light uppercase leading-none select-none text-center pointer-events-none"
        >
          APERITIVO
        </h2>
      </div>

      {/* Center Foreground Hero Drink (mid_img.png prominently enlarged with dynamic zoom-in on scroll) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.25, y: 40 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{
          duration: 1.1,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="absolute z-20 pointer-events-none flex justify-center items-center -top-14 sm:-top-20 md:-top-28 lg:-top-36"
      >
        <img
          src={ASSETS.midImg}
          alt="Sagē Signature Coffee Drink"
          className="w-[320px] sm:w-[420px] md:w-[500px] lg:w-[580px] xl:w-[640px] h-auto object-contain drop-shadow-[0_32px_65px_rgba(25,12,4,0.35)] select-none"
          draggable={false}
        />
      </motion.div>

      {/* Bottom-Right Editorial Paragraph (Shifted right away from the coffee coaster) */}
      <div className="w-full flex justify-end mt-10 sm:mt-14 md:mt-20 lg:mt-24 pr-0 sm:pr-2 relative z-30 translate-x-4 sm:translate-x-10 md:translate-x-16 lg:translate-x-24">
        <p
          style={{
            fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
            color: '#424F70',
          }}
          className="text-[13px] sm:text-[14.5px] md:text-[15.5px] lg:text-[16px] leading-[1.8] max-w-[280px] sm:max-w-[320px] md:max-w-[350px] lg:max-w-[380px] text-left font-normal"
        >
          Aperitivo marks the turn of the day: something cold in hand, the last of the sun, and no reason to leave just yet.
        </p>
      </div>

    </div>

  </div>

    </section>
  );
};

export default BrewedSlowlySection;
