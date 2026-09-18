import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Coffee, Flame, ArrowUpRight, ChevronRight, Compass, Utensils } from 'lucide-react';
import { ASSETS } from '../assets/images';
import { useUIStore } from '../store/useUIStore';
import { WhiskeyGlassDoodle } from '../assets/icons/DoodleIcons';

export const OurStoryPage = () => {
  const { openReserveModal } = useUIStore();
  const [activeStackIndex, setActiveStackIndex] = useState(0);
  const [isScattered, setIsScattered] = useState(false);
  const section2Ref = useRef(null);
  const scrollCanvasRef = useRef(null);

  // 6 Curated Artisanal Photos for the Stack & Scrollable Canvas
  const teamCards = [
    {
      id: 1,
      title: 'Artisanal Coffee & Roast',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85',
      caption: 'The soul of our craft',
    },
    {
      id: 2,
      title: 'Master Roaster',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=85',
      caption: 'Precision in every extraction',
    },
    {
      id: 3,
      title: 'Hearth Baker & Pastries',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=85',
      caption: '36-hour wild yeast fermentation',
    },
    {
      id: 4,
      title: 'Artisanal Table Experience',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=85',
      caption: 'Passion at the hearth',
    },
    {
      id: 5,
      title: 'Golden Hour Pour',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=85',
      caption: 'Sunset specialty elixirs',
    },
    {
      id: 6,
      title: 'Artisanal Brunch Kitchen',
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=85',
      caption: 'Hand-laminated flaky layers',
    },

  ];

  // Mouse wheel horizontal scroll handler when in scattered view
  const handleCanvasWheel = (e) => {
    if (scrollCanvasRef.current && isScattered) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        scrollCanvasRef.current.scrollLeft += e.deltaY * 1.2;
      }
    }
  };

  // Extremely subtle micro-movement scroll parallax for Section 1 image
  const section1Ref = useRef(null);
  const { scrollYProgress: section1Progress } = useScroll({
    target: section1Ref,
    offset: ['start end', 'end start'],
  });
  const innerImageY = useTransform(section1Progress, [0, 1], [-8, 8]);
  const outerImageY = useTransform(section1Progress, [0, 1], [3, -3]);

  // Extremely subtle micro-movement scroll parallax for Section 4 image
  const section4Ref = useRef(null);
  const { scrollYProgress: section4Progress } = useScroll({
    target: section4Ref,
    offset: ['start end', 'end start'],
  });
  const innerImage4Y = useTransform(section4Progress, [0, 1], [-8, 8]);
  const outerImage4Y = useTransform(section4Progress, [0, 1], [3, -3]);

  const [activeMissionSlide, setActiveMissionSlide] = useState(0);
  const [loaderKey, setLoaderKey] = useState(0);

  // 2 Fixed Editorial Images from local images folder
  const MISSION_PHOTO_A = ASSETS.croissantCoffee || ASSETS.coffeeSnacks;
  const MISSION_PHOTO_B = ASSETS.frenchToast || ASSETS.heroPizzaTable;

  // 2 Text states that cycle when images swap
  const missionSlides = [
    {
      id: 1,
      tag: 'CRAFT & PATIENT RITUALS',
      titleLine1: 'HONEST COFFEE',
      titleLine2: '& GOOD FOOD',
      description:
        'We care about the details — quality beans, fresh ingredients, comforting recipes and food made with intention. Everything at Sage is prepared to make everyday moments feel special.',
      bottomQuote:
        'Rooted in patient craft, honest ingredients, and the everyday beauty of gathering over fresh coffee and good food.',
    },
    {
      id: 2,
      tag: 'ARTISANAL INTEGRITY',
      titleLine1: 'HONEST GRAINS',
      titleLine2: '& SLOW ROASTS',
      description:
        'Every loaf is shaped by 36-hour wild-yeast cold fermentation, and every single-origin extraction is calibrated daily to celebrate natural sweetness and origin clarity.',
      bottomQuote:
        'Rooted in patient craft, sustainable grower partnerships, and the everyday beauty of gathering over warm hearth bakes and fresh cups.',
    },
  ];

  // Auto-advance mission slider loader every 6 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setActiveMissionSlide((prev) => (prev === 0 ? 1 : 0));
      setLoaderKey((k) => k + 1);
    }, 6000);
    return () => clearTimeout(timer);
  }, [activeMissionSlide, loaderKey]);

  const handleNextMissionSlide = () => {
    setActiveMissionSlide((prev) => (prev === 0 ? 1 : 0));
    setLoaderKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen bg-white text-[#1B365D] selection:bg-[#F3D898] selection:text-[#0A6473]">

      {/* ========================================================================= */}
      {/* 1. HERO HEADER: DEEP TEAL / HERITAGE ATMOSPHERE (FULL PAGE 100VH)         */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-screen flex flex-col justify-between items-center text-center px-6 sm:px-10 pt-36 sm:pt-40 pb-12 overflow-hidden select-none bg-[#0A6473]">

        {/* Background Atmospheric Roastery & Warm Golden Lighting */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=2400&q=85"
            alt="Sagē Café Heritage Atmosphere"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center filter brightness-[0.55] contrast-[1.15]"
          />
          {/* Deep Teal Gradient & Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#06333c]/85 via-[#0A6473]/70 to-[#0A6473]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#06333c]/40 to-[#0A6473]" />
        </div>

        {/* Decorative Watermark Outline */}
        <div className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center">
          <span
            style={{ fontFamily: '"Tan Mon Cheri", "Italiana", "Cormorant Garamond", serif' }}
            className="text-[28vw] font-bold text-white tracking-tighter leading-none select-none"
          >
            SAGĒ
          </span>
        </div>

        {/* Top Spacer for perfect vertical alignment */}
        <div className="w-full h-4" />

        {/* Hero Central Content */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center my-auto">

          {/* Main Heritage Heading & Cursive Script */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <h1
              style={{ fontFamily: '"Cormorant Garamond", "Italiana", "Playfair Display", "Belleza", serif' }}
              className="text-white text-5xl sm:text-7xl md:text-8xl lg:text-[96px] font-normal tracking-[0.06em] uppercase leading-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
            >
              OUR HERITAGE
            </h1>

            <span
              style={{ fontFamily: '"Caveat", "Covered By Your Grace", "Marck Script", cursive' }}
              className="text-[#9BC49E] text-2xl sm:text-3xl md:text-5xl lg:text-[52px] -mt-2 sm:-mt-4 md:-mt-5 relative z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] font-medium"
            >
              in the heart of the city
            </span>
          </motion.div>

          {/* Subtitle Statement Box */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: '"Plus Jakarta Sans", "Outfit", sans-serif' }}
            className="text-white/85 text-xs sm:text-sm md:text-[15px] font-light tracking-[0.16em] uppercase max-w-2xl leading-relaxed mt-8 sm:mt-10 px-4 text-center"
          >
            Rooted in good food, artisan coffee and meaningful moments, Sage Café is a place to slow down, gather and stay a little longer.
          </motion.p>

        </div>

      </section>


      {/* ========================================================================= */}
      {/* 2. SECTION 1: THE GATHERING & PHILOSOPHY (WHITE 2-COLUMN EDITORIAL)        */}
      {/* ========================================================================= */}
      <section ref={section1Ref} className="relative w-full py-20 sm:py-28 md:py-32 px-6 sm:px-12 md:px-16 lg:px-24 bg-white text-[#1B365D] select-none overflow-hidden">
        <div className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Narrative & Philosophy */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6 sm:space-y-7">

            {/* Editorial Category Tag */}
            <span
              style={{ fontFamily: '"Plus Jakarta Sans", "Outfit", sans-serif' }}
              className="text-xs sm:text-sm font-semibold tracking-[0.26em] uppercase text-[#7A6455] block"
            >
              A WARM WELCOME
            </span>

            {/* Title with Cursive Accent */}
            <div className="relative">
              <h2
                style={{ fontFamily: '"Cormorant Garamond", "Italiana", "Belleza", serif' }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-normal tracking-[0.03em] uppercase leading-[1.05] text-[#1B365D]"
              >
                THE CAFÉ<br />BRINGS US TOGETHER
              </h2>
              <span
                style={{ fontFamily: '"Caveat", "Covered By Your Grace", cursive' }}
                className="text-[#7FA382] text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-medium block -mt-2.5 sm:-mt-3 md:-mt-4 ml-12 sm:ml-20"
              >
                in our own rhythm
              </span>
            </div>

            {/* Narrative Paragraph */}
            <div
              style={{ fontFamily: '"Plus Jakarta Sans", "Outfit", sans-serif' }}
              className="space-y-4 text-stone-600 text-sm sm:text-[15px] leading-relaxed font-normal pt-1"
            >
              <p>
                Sage Café is built around the simple joy of good food, great coffee and genuine connection. From quiet mornings to long lunches and evening conversations, every visit has its own rhythm.
              </p>
            </div>

            {/* Bottom Quote & Line */}
            <div className="pt-6 sm:pt-8 border-t border-stone-200/80">
              <p
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                className="text-stone-500 text-xs sm:text-[13px] leading-relaxed max-w-sm font-light"
              >
                Artisanal bakes, mindful coffee, and a table shaped by the rhythm of the city.
              </p>
            </div>

          </div>

          {/* Right Column: Outer Large Image + Nested Smaller Inner Image + Bottom Text */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[720px] xl:max-w-[760px] h-[440px] sm:h-[520px] md:h-[580px] lg:h-[620px] flex items-center justify-center overflow-hidden shadow-[0_25px_60px_rgba(27,54,93,0.18)] select-none">

              {/* 1. Outer Large Background Image with Counter-Parallax (Enlarged) */}
              <motion.div
                style={{
                  y: outerImageY,
                  willChange: 'transform',
                }}
                className="absolute inset-0 w-full h-[120%] -top-[10%]"
              >
                <img
                  src={ASSETS.story1}
                  alt="Sagē Café Atmosphere Background"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover filter brightness-[0.98] contrast-[1.02] scale-105"
                />
              </motion.div>

              {/* 2. Inner Centered Larger Framed Image with Gentle Scroll Parallax (Dead Center) */}
              <motion.div
                style={{
                  y: innerImageY,
                  willChange: 'transform',
                }}
                className="relative z-10 w-[78%] sm:w-[80%] md:w-[82%] h-[74%] sm:h-[76%] md:h-[80%] overflow-hidden shadow-[0_20px_45px_rgba(0,0,0,0.35)] border border-white/60"
              >
                <img
                  src={ASSETS.story1}
                  alt="Sagē Café Atmosphere"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover filter brightness-[1.0]"
                />
              </motion.div>

              {/* 3. Bottom Uppercase Spaced Typography Across Outer Image */}
              <div className="absolute bottom-2.5 sm:bottom-3 md:bottom-3.5 inset-x-0 flex items-center justify-center text-center px-4 pointer-events-none z-20">
                <p
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                  className="text-[8.5px] sm:text-[9.5px] md:text-[10.5px] tracking-[0.2em] sm:tracking-[0.26em] uppercase text-white/95 font-medium drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)] text-center leading-none"
                >
                  LONG LUNCHES / GOLDEN EVENINGS / THE RHYTHM OF THE CITY
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 3. SECTION 2: THE CRAFTSMANSHIP / FOUNDER HOUSE (FULL WINDOW 100VH STACK)  */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[82vh] lg:min-h-[86vh] flex flex-col justify-between py-6 sm:py-8 px-5 sm:px-8 md:px-10 lg:px-12 bg-[#0A6473] text-white select-none overflow-hidden">

        {/* Subtle Background Roastery Texture */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=2400&q=85"
            alt="Café Texture"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover filter brightness-[0.9] contrast-[1.1]"
          />
        </div>

        {/* Top Metadata Header (Full Corner Alignment) */}
        <div className="w-full relative z-20">
          <div className="flex items-center justify-between pt-1">
            <span
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              className="text-[11px] sm:text-xs tracking-[0.24em] uppercase text-white/90 font-medium transition-all duration-300"
            >
              {isScattered ? 'DRAG CARDS / DRAG OR SCROLL THE CANVAS' : 'THE PEOPLE BEHIND SAGE'}
            </span>

            {/* Toggle Link: SELECT THE IMAGES TO EXPLORE <-> GATHER IMAGES */}
            {isScattered ? (
              <button
                type="button"
                onClick={() => setIsScattered(false)}
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                className="text-[11px] sm:text-xs tracking-[0.24em] uppercase text-white/90 font-medium hover:text-white transition-all duration-200 cursor-pointer flex items-center gap-1.5 group border-b border-transparent hover:border-white/60 pb-0.5"
              >
                <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
                GATHER IMAGES
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsScattered(true)}
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                className="text-[11px] sm:text-xs tracking-[0.24em] uppercase text-white/90 font-medium hover:text-white transition-all duration-200 cursor-pointer flex items-center gap-1.5 group border-b border-transparent hover:border-white/60 pb-0.5"
              >
                SELECT THE IMAGES TO EXPLORE
                <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 -translate-y-0.5 transition-all">↗</span>
              </button>
            )}
          </div>
        </div>

        {/* Center Area: FULL-WIDTH 100% EDGE-TO-EDGE CANVAS (Gathered Stack OR Panoramic Scattered Canvas) */}
        <div ref={section2Ref} className="my-auto py-4 sm:py-6 flex justify-center items-center relative w-full overflow-hidden min-h-[350px] sm:min-h-[410px] z-10">

          <AnimatePresence mode="wait">
            {!isScattered ? (
              /* GATHERED STACK VIEW (Click to swap/cycle images) */
              <motion.div
                key="gathered-stack"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35 }}
                onClick={() => setIsScattered(true)}
                className="relative w-[185px] sm:w-[230px] md:w-[270px] lg:w-[300px] h-[250px] sm:h-[310px] md:h-[365px] lg:h-[400px] flex items-center justify-center cursor-pointer group"
              >
                {teamCards.slice(0, 4).map((card, idx) => {
                  const offset = (idx - activeStackIndex + 4) % 4;
                  const stackStyles = [
                    { rotate: -1, x: 0, y: 0, zIndex: 40, scale: 1, opacity: 1 },
                    { rotate: -7, x: -30, y: -10, zIndex: 30, scale: 0.96, opacity: 1 },
                    { rotate: 5, x: 24, y: -20, zIndex: 20, scale: 0.93, opacity: 1 },
                    { rotate: 9, x: 38, y: 14, zIndex: 10, scale: 0.90, opacity: 1 },
                  ];
                  const style = stackStyles[offset] || stackStyles[0];

                  return (
                    <motion.div
                      key={card.id}
                      layout
                      animate={{
                        rotate: style.rotate,
                        x: style.x,
                        y: style.y,
                        scale: style.scale,
                        opacity: 1,
                        zIndex: style.zIndex,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 280,
                        damping: 22,
                        mass: 0.8,
                      }}
                      whileHover={{ scale: style.scale * 1.04, y: style.y - 8, transition: { duration: 0.2 } }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsScattered(true);
                      }}
                      className="absolute inset-0 select-none rounded-none overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.25)] group-hover:shadow-[0_18px_40px_rgba(0,0,0,0.35)] transition-shadow duration-300 bg-transparent"
                    >
                      <img
                        src={card.image}
                        alt={card.title}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        className="w-full h-full object-cover object-center rounded-none pointer-events-none group-hover:scale-102 transition-transform duration-500"
                      />
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              /* SCATTERED HORIZONTALLY SCROLLABLE FULL-BLEED PANORAMIC CANVAS (NO OVERLAP) */
              <motion.div
                key="scattered-canvas"
                ref={scrollCanvasRef}
                onWheel={handleCanvasWheel}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4 }}
                className="w-full overflow-x-auto overflow-y-hidden py-4 sm:py-6 cursor-grab active:cursor-grabbing select-none scrollbar-none"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <div className="flex items-center gap-10 sm:gap-16 md:gap-20 lg:gap-24 xl:gap-28 px-4 sm:px-8 md:px-12 min-w-max">
                  {teamCards.map((card, idx) => {
                    const rotations = [-8, 9, -5, 11, -7, 6];
                    const yOffsets = [-18, 22, -14, 18, -20, 14];
                    const rot = rotations[idx % rotations.length];
                    const yOff = yOffsets[idx % yOffsets.length];

                    return (
                      <motion.div
                        key={card.id}
                        drag
                        dragConstraints={scrollCanvasRef}
                        dragElastic={0.12}
                        whileDrag={{ scale: 1.06, zIndex: 60, cursor: 'grabbing' }}
                        initial={{ opacity: 0, y: 30, rotate: 0 }}
                        animate={{ opacity: 1, y: yOff, rotate: rot }}
                        transition={{
                          type: 'spring',
                          stiffness: 190,
                          damping: 19,
                          delay: idx * 0.05,
                        }}
                        whileHover={{
                          y: yOff - 24,
                          scale: 1.05,
                          zIndex: 50,
                          transition: { type: 'spring', stiffness: 300, damping: 20 },
                        }}
                        className="flex-shrink-0 w-[240px] sm:w-[300px] md:w-[360px] lg:w-[390px] xl:w-[420px] h-[320px] sm:h-[390px] md:h-[450px] lg:h-[490px] shadow-[0_25px_60px_rgba(0,0,0,0.6)] hover:shadow-[0_35px_80px_rgba(0,0,0,0.85)] select-none rounded-none overflow-hidden cursor-grab active:cursor-grabbing relative group bg-black/20"
                      >
                        <img
                          src={card.image}
                          alt={card.title}
                          loading="lazy"
                          decoding="async"
                          draggable={false}
                          className="w-full h-full object-cover object-center rounded-none filter contrast-[1.05] brightness-[0.98] pointer-events-none transition-transform duration-500 group-hover:scale-104"
                        />
                        {/* Editorial title & caption overlay - appears smoothly on hover */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-5 sm:p-6 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300 pointer-events-none flex flex-col justify-end">
                          <span
                            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                            className="text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-white/80 font-medium mb-0.5"
                          >
                            {card.title}
                          </span>
                          <span
                            style={{ fontFamily: '"Caveat", cursive' }}
                            className="text-white text-xl sm:text-2xl font-normal drop-shadow-md"
                          >
                            {card.caption}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Split Footer (Full Corner Alignment Edge-to-Edge) */}
        <div className="w-full relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-end pb-1">

            {/* Left Title with Overlapping Cursive */}
            <div className="md:col-span-7">
              <div className="relative inline-block">
                <h3
                  style={{ fontFamily: '"Cormorant Garamond", "Italiana", "Belleza", serif' }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-normal tracking-[0.05em] uppercase leading-none text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                >
                  THE ARTISAN CAFÉ
                </h3>
                <span
                  style={{ fontFamily: '"Caveat", "Covered By Your Grace", cursive' }}
                  className="text-white text-xl sm:text-2xl md:text-3xl lg:text-[34px] font-normal block text-right -mt-2 sm:-mt-3 md:-mt-4 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
                >
                  stories behind the cup
                </span>
              </div>
            </div>

            {/* Right Quote with Dividing Line */}
            <div className="md:col-span-5 flex flex-col items-start md:items-end text-left md:text-right">
              <div className="w-14 h-[1px] bg-white/50 mb-3" />
              <p
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                className="text-white/85 text-[11px] sm:text-xs leading-[18px] sm:leading-[20px] font-light max-w-sm"
              >
                From carefully roasted coffee to thoughtfully prepared plates, we believe the best café experiences come from honest ingredients, skilled hands and a little patience.
              </p>
            </div>

          </div>
        </div>

        {/* Giant Artisanal Rocks Tumbler Glass Watermark Illustration (Positioned slightly left & downward) */}
        <div className="absolute right-[2%] sm:right-[6%] md:right-[10%] lg:right-[14%] xl:right-[16%] top-6 sm:top-12 md:top-16 lg:top-20 pointer-events-none opacity-25 sm:opacity-30 md:opacity-35 select-none z-0 flex items-center justify-end overflow-visible">
          <WhiskeyGlassDoodle className="w-[420px] sm:w-[580px] md:w-[760px] lg:w-[940px] xl:w-[1060px] h-auto text-white/90 rotate-[-4deg] flex-shrink-0 translate-y-4 sm:translate-y-8 md:translate-y-12" />
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 4. SECTION 3: OUR MISSION AT THE TABLE (ARTISANAL DUAL SLIDER)            */}
      {/* ========================================================================= */}
      <section className="relative w-full py-20 sm:py-28 md:py-32 px-6 sm:px-12 md:px-16 lg:px-20 bg-white text-[#1B365D] select-none overflow-hidden">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Mission Narrative & Pagination Loader */}
          <div className="lg:col-span-6 flex flex-col justify-center">

            {/* Top Category Tag */}
            <span
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              className="text-[11px] sm:text-xs font-semibold tracking-[0.24em] uppercase text-stone-500 block mb-10 sm:mb-14"
            >
              {missionSlides[activeMissionSlide].tag}
            </span>

            {/* Main Serif Title */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`title-${activeMissionSlide}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="mb-6 sm:mb-8"
              >
                <h2
                  style={{ fontFamily: '"Cormorant Garamond", "Italiana", "Belleza", serif' }}
                  className="text-4xl sm:text-5xl md:text-6xl font-normal uppercase tracking-[0.03em] leading-[1.05] text-[#1B365D]"
                >
                  {missionSlides[activeMissionSlide].titleLine1}
                  <br />
                  {missionSlides[activeMissionSlide].titleLine2}
                </h2>
              </motion.div>
            </AnimatePresence>

            {/* Description Paragraph */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`desc-${activeMissionSlide}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                className="text-stone-600 text-xs sm:text-sm md:text-[14px] leading-relaxed font-normal max-w-md mb-8 sm:mb-10"
              >
                {missionSlides[activeMissionSlide].description}
              </motion.p>
            </AnimatePresence>

            {/* Pagination & Animated Progress Loader Bar */}
            <div className="flex items-center gap-3.5 sm:gap-4 text-xs sm:text-sm text-[#1B365D] mb-12 sm:mb-16 select-none">
              <span
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                className="font-medium tracking-wider"
              >
                {activeMissionSlide + 1}/2
              </span>

              <button
                type="button"
                onClick={handleNextMissionSlide}
                className="cursor-pointer hover:translate-x-0.5 transition-transform text-[#1B365D] font-mono text-sm leading-none p-1"
                aria-label="Next slide"
              >
                &gt;
              </button>

              <div className="w-20 sm:w-28 h-[1.5px] bg-stone-200 relative overflow-hidden">
                <motion.div
                  key={loaderKey}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 6, ease: 'linear' }}
                  className="h-full bg-[#1B365D]"
                />
              </div>
            </div>

            {/* Bottom Quote & Horizontal Line */}
            <div className="pt-6 border-t border-stone-200/80 max-w-md">
              <AnimatePresence mode="wait">
                <motion.p
                  key={`quote-${activeMissionSlide}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                  className="text-stone-500 text-[11px] sm:text-xs leading-relaxed font-light"
                >
                  {missionSlides[activeMissionSlide].bottomQuote}
                </motion.p>
              </AnimatePresence>
            </div>

          </div>

          {/* Right Column: Borderless Overlapping Photos with Fast Interactive Swap */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div
              onClick={handleNextMissionSlide}
              className="relative w-full max-w-[560px] h-[400px] sm:h-[480px] md:h-[540px] cursor-pointer select-none group"
              title="Click to swap images"
            >
              {/* Photo A (Artisanal Coffee & Bakes) */}
              <motion.div
                layout
                animate={{
                  top: activeMissionSlide === 0 ? 0 : 'auto',
                  left: activeMissionSlide === 0 ? 0 : 'auto',
                  bottom: activeMissionSlide === 0 ? 'auto' : 0,
                  right: activeMissionSlide === 0 ? 'auto' : 0,
                  width: activeMissionSlide === 0 ? '56%' : '64%',
                  height: activeMissionSlide === 0 ? '82%' : '88%',
                  zIndex: activeMissionSlide === 0 ? 10 : 20,
                  boxShadow:
                    activeMissionSlide === 0
                      ? '0 15px 35px rgba(0,0,0,0.12)'
                      : '0 25px 50px rgba(0,0,0,0.24)',
                }}
                transition={{
                  type: 'spring',
                  stiffness: 420,
                  damping: 30,
                }}
                whileHover={{ scale: 1.015 }}
                className="absolute rounded-none overflow-hidden border-0"
              >
                <img
                  src={MISSION_PHOTO_A}
                  alt="Sagē Artisanal Morning Table"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover rounded-none filter brightness-[0.98] group-hover:scale-102 transition-transform duration-500 pointer-events-none"
                />
              </motion.div>

              {/* Photo B (Handcrafted Toast & Bakes) */}
              <motion.div
                layout
                animate={{
                  top: activeMissionSlide === 0 ? 'auto' : 0,
                  left: activeMissionSlide === 0 ? 'auto' : 0,
                  bottom: activeMissionSlide === 0 ? 0 : 'auto',
                  right: activeMissionSlide === 0 ? 0 : 'auto',
                  width: activeMissionSlide === 0 ? '64%' : '56%',
                  height: activeMissionSlide === 0 ? '88%' : '82%',
                  zIndex: activeMissionSlide === 0 ? 20 : 10,
                  boxShadow:
                    activeMissionSlide === 0
                      ? '0 25px 50px rgba(0,0,0,0.24)'
                      : '0 15px 35px rgba(0,0,0,0.12)',
                }}
                transition={{
                  type: 'spring',
                  stiffness: 420,
                  damping: 30,
                }}
                whileHover={{ scale: 1.015 }}
                className="absolute rounded-none overflow-hidden border-0"
              >
                <img
                  src={MISSION_PHOTO_B}
                  alt="Sagē Artisanal Kitchen & Bakes"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover rounded-none group-hover:scale-102 transition-transform duration-500 pointer-events-none"
                />
              </motion.div>
            </div>
          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 5. SECTION 4: MAKE IT AN OCCASION (PRIVATE DINING & CELEBRATIONS)         */}
      {/* ========================================================================= */}
      <section ref={section4Ref} className="relative w-full py-20 sm:py-28 md:py-32 px-6 sm:px-12 md:px-16 lg:px-24 bg-white text-[#1B365D] select-none overflow-hidden">
        <div className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Booking Details & CTA Buttons */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6 sm:space-y-8">

            {/* Tag */}
            <span
              style={{ fontFamily: '"Plus Jakarta Sans", "Outfit", sans-serif' }}
              className="text-xs sm:text-sm font-semibold tracking-[0.26em] uppercase text-[#7A6455] block"
            >
              EXPERIENCE SAGĒ
            </span>

            {/* Heading */}
            <div className="space-y-1">
              <h2
                style={{ fontFamily: '"Cormorant Garamond", "Italiana", "Belleza", serif' }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-normal tracking-[0.03em] uppercase leading-[1.08] text-[#1B365D]"
              >
                MAKE IT AN OCCASION
              </h2>
              <span
                style={{ fontFamily: '"Caveat", "Covered By Your Grace", cursive' }}
                className="text-[#7FA382] text-xl sm:text-2xl md:text-3xl font-medium block"
              >
                celebrate with us
              </span>
            </div>

            {/* Description */}
            <p
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              className="text-stone-600 text-sm sm:text-[15px] leading-relaxed font-normal"
            >
              Coffee dates, birthdays, intimate gatherings, conversations and celebrations — Sage Café is made for moments worth sharing.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/reservation"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                className="py-3.5 px-8 rounded bg-[#0A6473] text-white hover:bg-[#074752] transition-all font-semibold text-xs sm:text-sm tracking-[0.16em] uppercase shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2 hover:scale-[1.02] active:scale-95"
              >
                <span>RESERVE A TABLE</span>
                <ChevronRight className="w-4 h-4" />
              </Link>

              <Link
                to="/menu"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                className="py-3.5 px-8 rounded border border-[#0A6473] text-[#0A6473] hover:bg-[#0A6473] hover:text-white transition-all font-semibold text-xs sm:text-sm tracking-[0.16em] uppercase cursor-pointer flex items-center gap-2 hover:scale-[1.02] active:scale-95"
              >
                <span>EXPLORE MENU</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Fine Print Note */}
            <p
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              className="text-stone-400 text-xs tracking-wide pt-2"
            >
              Private table & tasting reservations available for parties of 2 to 40 guests.
            </p>

          </div>

          {/* Right Column: Outer Large Image + Nested Smaller Inner Image + Bottom Text */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[720px] xl:max-w-[760px] h-[440px] sm:h-[520px] md:h-[580px] lg:h-[620px] flex items-center justify-center overflow-hidden shadow-[0_25px_60px_rgba(27,54,93,0.18)] select-none">

              {/* 1. Outer Large Background Image with Counter-Parallax */}
              <motion.div
                style={{
                  y: outerImage4Y,
                  willChange: 'transform',
                }}
                className="absolute inset-0 w-full h-[120%] -top-[10%]"
              >
                <img
                  src={ASSETS.image2}
                  alt="Sagē Terrace Atmosphere Background"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover filter brightness-[0.98] contrast-[1.02] scale-105"
                />
              </motion.div>

              {/* 2. Inner Centered Larger Framed Image with Gentle Scroll Parallax (Dead Center) */}
              <motion.div
                style={{
                  y: innerImage4Y,
                  willChange: 'transform',
                }}
                className="relative z-10 w-[78%] sm:w-[80%] md:w-[82%] h-[74%] sm:h-[76%] md:h-[80%] overflow-hidden shadow-[0_20px_45px_rgba(0,0,0,0.35)] border border-white/60"
              >
                <img
                  src={ASSETS.image2}
                  alt="Sagē Terrace Dining Occasions"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover filter brightness-[1.0]"
                />
              </motion.div>

              {/* 3. Bottom Uppercase Spaced Typography Across Outer Image */}
              <div className="absolute bottom-2.5 sm:bottom-3 md:bottom-3.5 inset-x-0 flex items-center justify-center text-center px-4 pointer-events-none z-20">
                <p
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                  className="text-[8.5px] sm:text-[9.5px] md:text-[10.5px] tracking-[0.2em] sm:tracking-[0.26em] uppercase text-white/95 font-medium drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)] text-center leading-none"
                >
                  PRIVATE GATHERINGS / TERRACE PERGOLA / TASTING SALON
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default OurStoryPage;
