import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, X, Coffee, Soup, Sandwich, Leaf } from 'lucide-react';
import { ASSETS } from '../../assets/images';

export const GoodPeopleStorySection = () => {
  const [showVideoModal, setShowVideoModal] = useState(false);

  return (
    <section className="relative w-full bg-white text-[#1B365D] overflow-hidden select-none z-0">
      
      {/* Full-bleed Viewport-fitting Container */}
      <div className="relative w-full min-h-[600px] sm:min-h-[660px] lg:h-[90vh] lg:min-h-[660px] lg:max-h-[820px] flex items-center py-6 sm:py-8">
        
        {/* Background Layer: High-Res Food Scene on LEFT (snacks.png) */}
        <div className="absolute inset-0 z-0">
          <img
            src={ASSETS.snacks}
            alt="Sagē Café Artisanal Food, Pasta, Sandwiches & Coffee"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-left sm:object-left-center"
          />
          {/* Subtle warm sunlight vignette over photo */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20 lg:hidden pointer-events-none" />
        </div>

        {/* =========================================================================
            TOP PROMINENT ORGANIC WAVE (LEHAR) TRANSITION
            ========================================================================= */}
        <div className="absolute top-0 left-0 right-0 w-full pointer-events-none select-none z-30 leading-none -translate-y-[1px]">
          <svg
            viewBox="0 0 1440 95"
            className="w-full h-[45px] sm:h-[60px] md:h-[75px] lg:h-[90px] block min-w-full"
            preserveAspectRatio="none"
          >
            <defs>
              <filter id="topWaveShadow" x="-10%" y="-10%" width="120%" height="130%">
                <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(27, 54, 93, 0.08)" />
              </filter>
            </defs>

            {/* Main sweeping white wave fill */}
            <path
              d="M 0,0 L 1440,0 L 1440,28 C 1200,82 960,18 680,68 C 420,105 180,24 0,55 Z"
              fill="#FFFFFF"
              filter="url(#topWaveShadow)"
            />

            {/* Decorative fine contour accent line */}
            <path
              d="M 0,55 C 180,24 420,105 680,68 C 960,18 1200,82 1440,28"
              fill="none"
              stroke="#DCE5ED"
              strokeWidth="1.2"
              opacity="0.8"
            />
          </svg>
        </div>

        {/* =========================================================================
            PHOTO OVERLAYS (LEFT SIDE FLOATING TEXTS AS IN REFERENCE)
            ========================================================================= */}
        {/* Top-Left: "Good Food Brighter People" in warm white cursive */}
        <div className="absolute top-16 left-6 sm:top-20 sm:left-10 z-20 pointer-events-none select-none">
          <p
            style={{ fontFamily: '"Covered By Your Grace", "Caveat", cursive' }}
            className="text-white text-2xl sm:text-3xl lg:text-4xl leading-[1.1] drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]"
          >
            Good<br />
            Food<br />
            Brighter<br />
            People
          </p>
        </div>

        {/* Bottom-Left: "SAGE CAFÉ / A TABLE FOR EVERY MOMENT" */}
        <div className="absolute bottom-8 left-6 sm:bottom-10 sm:left-10 z-20 pointer-events-none select-none">
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-white/95 font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-sans">
            SAGĒ CAFÉ
          </p>
          <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white/80 font-normal drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] font-sans mt-0.5">
            A TABLE FOR<br className="sm:hidden" /> EVERY MOMENT
          </p>
        </div>

        {/* =========================================================================
            ORGANIC FLOWING PURE WHITE CURVE OVERLAY (FRAMING RIGHT SIDE)
            ========================================================================= */}
        <div className="absolute inset-0 z-10 pointer-events-none select-none">
          <svg
            viewBox="0 0 1440 900"
            className="w-full h-full block"
            preserveAspectRatio="none"
          >
            <defs>
              <filter id="kitchenCurveGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="-8" dy="4" stdDeviation="20" floodColor="rgba(27, 54, 93, 0.12)" />
              </filter>
            </defs>

            {/* 1. Outer Decorative Contour Line */}
            <path
              d="M 720,0 C 640,140 590,320 620,510 C 650,680 730,810 820,900"
              fill="none"
              stroke="#DCE5ED"
              strokeWidth="1.2"
              opacity="0.85"
            />

            {/* 2. Main Organic PURE WHITE Card Shape with Soft Drop Shadow */}
            <path
              d="M 1440,0 L 760,0 C 680,140 630,320 660,510 C 690,680 770,810 860,900 L 1440,900 Z"
              fill="#FFFFFF"
              filter="url(#kitchenCurveGlow)"
            />

            {/* 3. Inner Boundary Accent Line */}
            <path
              d="M 760,0 C 680,140 630,320 660,510 C 690,680 770,810 860,900"
              fill="none"
              stroke="#DCE5ED"
              strokeWidth="1.4"
              opacity="0.9"
            />
          </svg>
        </div>

        {/* =========================================================================
            BOTANICAL BRANCH ICON (branch.png ON TOP OF CURVE)
            ========================================================================= */}
        <div className="absolute -top-3 sm:-top-5 md:-top-7 lg:-top-9 left-[40%] sm:left-[43%] md:left-[45%] lg:left-[46.5%] z-20 pointer-events-none select-none">
          <img
            src={ASSETS.branch}
            alt="Botanical Branch Accent"
            className="w-28 sm:w-36 md:w-40 lg:w-48 h-auto object-contain opacity-55 drop-shadow-[0_4px_12px_rgba(43,76,126,0.10)] transform -rotate-3 sm:rotate-0 origin-top-left"
          />
        </div>

        {/* =========================================================================
            CONTENT GRID (RIGHT EDITORIAL CARD)
            ========================================================================= */}
        <div className="relative z-20 max-w-[1440px] mx-auto px-6 sm:px-10 md:px-14 lg:px-16 w-full py-6 sm:py-8 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Visual Space for Food Imagery on Left */}
            <div className="hidden lg:block lg:col-span-6 xl:col-span-6 pointer-events-none select-none" />

            {/* Right Column: Editorial Information & Interactive Elements */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 xl:col-span-6 flex flex-col items-start lg:pl-8 xl:pl-14 bg-white/95 sm:bg-white/90 lg:bg-transparent p-5 sm:p-7 lg:p-0 rounded-3xl lg:rounded-none shadow-xl lg:shadow-none backdrop-blur-md lg:backdrop-blur-none relative"
            >
              {/* Subtle Mediterranean Arch Watermark in Background */}
              <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full border-[20px] border-[#2B4C7E]/5 pointer-events-none" />

              {/* Editorial Content */}
              <div className="relative z-10 flex flex-col items-start text-left">
                
                {/* 1. Header Pill Tag */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2B4C7E]/10 border border-[#2B4C7E]/20 mb-3 sm:mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2B4C7E] animate-pulse" />
                  <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.2em] font-semibold text-[#2B4C7E] uppercase">
                    OUR PHILOSOPHY & FOOD
                  </span>
                </div>

                {/* 2. Main Headline */}
                <h2
                  style={{ fontFamily: '"Cormorant Garamond", "Belleza", "Italiana", serif' }}
                  className="text-3xl xs:text-4xl sm:text-5xl lg:text-[52px] leading-[1.08] font-normal tracking-tight text-[#1B365D] uppercase"
                >
                  GOOD PEOPLE.<br />GOOD FOOD.
                </h2>

                {/* 3. Flowing Cursive Tagline */}
                <p
                  style={{ fontFamily: '"Covered By Your Grace", "Caveat", cursive' }}
                  className="text-xl sm:text-2xl lg:text-[26px] text-[#416799] tracking-wide mt-1 mb-3.5 leading-none"
                >
                  Good Food. Brighter Days.
                </p>

                {/* 4. Description Paragraph */}
                <p
                  style={{ fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif' }}
                  className="text-xs sm:text-[13.5px] leading-relaxed max-w-[480px] text-[#486581] mb-5 sm:mb-6 font-normal"
                >
                  From slow mornings to comforting plates, Sage brings coffee, continental favourites and everyday cravings together. Fresh ingredients, honest flavours, and food made with care &mdash; for moments that feel a little more special.
                </p>

                {/* 5. 4 Feature Badges in 1 Row with Library Icons */}
                <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full max-w-[500px] pb-4 sm:pb-5 border-b border-[#2B4C7E]/15 mb-5 sm:mb-6">
                  
                  {/* 1. Specialty Coffee */}
                  <div className="flex flex-col items-center text-center pr-2 border-r border-[#2B4C7E]/15 group">
                    <Coffee className="w-5 h-5 sm:w-6 sm:h-6 text-[#2B4C7E] stroke-[1.75] mb-1.5 transition-transform group-hover:scale-110 duration-200" />
                    <span className="text-[9px] sm:text-[9.5px] tracking-[0.1em] font-medium uppercase text-[#23426A] leading-tight font-sans">
                      SPECIALTY<br />COFFEE
                    </span>
                  </div>

                  {/* 2. Pasta & Noodles */}
                  <div className="flex flex-col items-center text-center px-2 border-r border-[#2B4C7E]/15 group">
                    <Soup className="w-5 h-5 sm:w-6 sm:h-6 text-[#2B4C7E] stroke-[1.75] mb-1.5 transition-transform group-hover:scale-110 duration-200" />
                    <span className="text-[9px] sm:text-[9.5px] tracking-[0.1em] font-medium uppercase text-[#23426A] leading-tight font-sans">
                      PASTA &<br />NOODLES
                    </span>
                  </div>

                  {/* 3. Sandwiches & Snacks */}
                  <div className="flex flex-col items-center text-center px-2 border-r border-[#2B4C7E]/15 group">
                    <Sandwich className="w-5 h-5 sm:w-6 sm:h-6 text-[#2B4C7E] stroke-[1.75] mb-1.5 transition-transform group-hover:scale-110 duration-200" />
                    <span className="text-[9px] sm:text-[9.5px] tracking-[0.1em] font-medium uppercase text-[#23426A] leading-tight font-sans">
                      SANDWICHES<br />& SNACKS
                    </span>
                  </div>

                  {/* 4. Fresh Ingredients */}
                  <div className="flex flex-col items-center text-center pl-2 group">
                    <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-[#2B4C7E] stroke-[1.75] mb-1.5 transition-transform group-hover:scale-110 duration-200" />
                    <span className="text-[9px] sm:text-[9.5px] tracking-[0.1em] font-medium uppercase text-[#23426A] leading-tight font-sans">
                      FRESH<br />INGREDIENTS
                    </span>
                  </div>

                </div>
              </div>

              {/* 6. CTA Actions Row (EXPLORE MENU Blue Pill + Video Button) */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-6">
                
                {/* Lighter Mediterranean Blue Pill Button */}
                <Link
                  to="/menu"
                  className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-[#2B4C7E] text-white hover:bg-[#203D66] transition-all duration-300 font-sans text-xs sm:text-[12px] tracking-[0.2em] uppercase font-semibold group shadow-[0_4px_16px_rgba(43,76,126,0.22)] hover:shadow-[0_6px_22px_rgba(43,76,126,0.32)] hover:scale-105 cursor-pointer"
                >
                  <span>EXPLORE MENU</span>
                  <span className="text-sm font-normal transition-transform group-hover:translate-x-1">&rarr;</span>
                </Link>

                {/* Video Play Trigger */}
                <button
                  type="button"
                  onClick={() => setShowVideoModal(true)}
                  className="inline-flex items-center gap-3 text-left group cursor-pointer"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#2B4C7E]/40 flex items-center justify-center text-[#2B4C7E] group-hover:border-[#2B4C7E] group-hover:bg-[#2B4C7E]/5 transition-all group-hover:scale-105 shadow-sm">
                    <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#2B4C7E] text-[#2B4C7E] ml-0.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] sm:text-xs uppercase tracking-wider font-bold text-[#23426A] font-sans group-hover:text-[#203D66] transition-colors">
                      A TASTE OF SAGE
                    </span>
                    <span className="text-[9.5px] sm:text-[10px] text-[#5A7A9E] font-sans">
                      Watch Our Kitchen
                    </span>
                  </div>
                </button>

              </div>

              {/* 7. Bottom Centered Quote with Horizontal Decorative Lines */}
              <div className="w-full max-w-[480px] flex items-center justify-center gap-3 select-none pt-1">
                <span className="flex-1 h-[1px] bg-[#2B4C7E]/20 max-w-[60px]" />
                <p
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  className="text-xs sm:text-[13px] italic text-[#5A7A9E] tracking-wide text-center"
                >
                  &ldquo;Good food brings people together.&rdquo;
                </p>
                <span className="flex-1 h-[1px] bg-[#2B4C7E]/20 max-w-[60px]" />
              </div>

            </motion.div>

          </div>
        </div>

      </div>

      {/* =========================================================================
          INTERACTIVE KITCHEN VIDEO MODAL
          ========================================================================= */}
      <AnimatePresence>
        {showVideoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
            <div className="relative w-full max-w-2xl bg-[#16332E] text-white rounded-3xl overflow-hidden border border-[#D8C8B4]/40 shadow-2xl">
              
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <span className="text-xs uppercase tracking-[0.2em] font-serif text-[#F3D898]">
                  A Taste of Sagē Kitchen &bull; Hazratganj
                </span>
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="aspect-video w-full bg-black flex items-center justify-center relative">
                <img
                  src={ASSETS.snacks}
                  alt="Kitchen Craft"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-t from-black/80 via-black/40 to-black/20">
                  <div className="w-14 h-14 rounded-full bg-[#F3D898] text-[#16332E] flex items-center justify-center shadow-2xl mb-3">
                    <Play className="w-6 h-6 fill-[#16332E] ml-1" />
                  </div>
                  <h4
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                    className="text-2xl text-white font-serif uppercase tracking-wider"
                  >
                    Fresh Culinary Craft Daily
                  </h4>
                  <p className="text-xs text-white/80 max-w-sm mt-1 font-sans">
                    Handcrafted continental platters, artisanal roasts and comfort plates prepared fresh in our Hazratganj kitchen.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};

export default GoodPeopleStorySection;
