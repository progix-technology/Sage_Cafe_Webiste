import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ASSETS } from '../../assets/images';
import {
  CoffeeCupDoodle,
  IceCreamDoodle,
  CoffeeBeansDoodle,
  NoodlesDoodle,
  BreadDoodle,
  WineGlassDoodle,
  FastFoodDoodle,
  CakeDoodle,
  CookieDoodle,
  WhiskeyGlassDoodle,
} from '../../assets/icons/DoodleIcons';

// 5 Curated Sagē Story Chapters (Reflecting Sagē Café Menu & Identity)
const CHAPTERS = [
  {
    id: 1,
    num: '01',
    heading: 'MORNING ROASTS',
    script: 'at morning light',
    desc: 'Single-origin espresso, golden buttery croissants, fluffy brioche toast, and quiet morning conversations.',
    image: ASSETS.coffeeSnacks,
    rotate: -4,
  },
  {
    id: 2,
    num: '02',
    heading: 'ARTISAN BAKERY',
    script: 'warm from the hearth',
    desc: '36-hour slow-fermented croissants, artisanal berry tarts, and rustic sourdough bakes fresh every morning.',
    image: ASSETS.croissantCoffee,
    rotate: 3,
  },
  {
    id: 3,
    num: '03',
    heading: 'CONTINENTAL & BISTRO',
    script: 'sunset pours & gourmet bites',
    desc: 'Wood-fired Neapolitan pizzas, loaded smash burgers, botanical cold brews, and continental sharing plates under the warm glow.',
    image: ASSETS.heroPizzaTable,
    rotate: -3,
  },
  {
    id: 4,
    num: '04',
    heading: 'CURATED EVENTS',
    script: 'moments to remember',
    desc: 'Private gatherings, acoustic evenings, birthday dinners, and special tables hosted with heartfelt hospitality.',
    image: ASSETS.cafeBrickWall,
    rotate: 4,
  },
  {
    id: 5,
    num: '05',
    heading: 'EVENING VIBES',
    script: 'under the amber lights',
    desc: 'Handcrafted mocktails, molten lava fondant, chilled espresso tonics, and slow conversations that linger into the night.',
    image: ASSETS.cocktailGlass,
    rotate: -2,
  },
];

export const BlankWaveSection = () => {
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll progression tracker across the 800vh story narrative track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Disk rises from bottom to center in initial scroll, then stays locked in center
  const diskY = useTransform(
    scrollYProgress,
    [0, 0.16, 1],
    shouldReduceMotion ? [0, 0, 0] : [700, 0, 0]
  );

  // Disk rotates continuously throughout the entire scroll
  const diskRotate = useTransform(
    scrollYProgress,
    [0, 0.16, 1],
    shouldReduceMotion ? [0, 0, 0] : [0, 45, 270]
  );

  // Subtle 3D depth scale expansion for disk
  const diskScale = useTransform(
    scrollYProgress,
    [0, 0.16, 1],
    shouldReduceMotion ? [1, 1, 1] : [0.75, 1.05, 1.05]
  );

  // Asymmetrical Staggered Photo Card Transforms (Upar-Niche diagonal layout):
  const card1Y = useTransform(
    scrollYProgress,
    [0, 0.18, 0.38, 1.0],
    shouldReduceMotion ? [0, 0, 0, 0] : [750, -120, -1100, -3200]
  );
  const card1Rotate = useTransform(scrollYProgress, [0, 0.38], shouldReduceMotion ? [0, 0] : [-8, -4]);

  const card2Y = useTransform(
    scrollYProgress,
    [0, 0.18, 0.38, 0.58, 1.0],
    shouldReduceMotion ? [0, 0, 0, 0, 0] : [1600, 750, 160, -1100, -3200]
  );
  const card2Rotate = useTransform(scrollYProgress, [0.18, 0.58], shouldReduceMotion ? [0, 0] : [7, 3]);

  const card3Y = useTransform(
    scrollYProgress,
    [0, 0.38, 0.58, 0.78, 1.0],
    shouldReduceMotion ? [0, 0, 0, 0, 0] : [2400, 750, -180, -900, -2400]
  );
  const card3Rotate = useTransform(scrollYProgress, [0.38, 0.78], shouldReduceMotion ? [0, 0] : [-7, -3.5]);

  const card4TopRightY = useTransform(
    scrollYProgress,
    [0, 0.44, 0.64, 0.84, 1.0],
    shouldReduceMotion ? [0, 0, 0, 0, 0] : [2200, 700, -260, -1100, -2200]
  );
  const card4TopRotate = useTransform(scrollYProgress, [0.44, 0.84], shouldReduceMotion ? [0, 0] : [6.5, 3.5]);

  const card4BottomRightY = useTransform(
    scrollYProgress,
    [0, 0.50, 0.70, 0.90, 1.0],
    shouldReduceMotion ? [0, 0, 0, 0, 0] : [2600, 850, 260, -900, -1800]
  );
  const card4BottomRotate = useTransform(scrollYProgress, [0.50, 0.90], shouldReduceMotion ? [0, 0] : [-5.5, -2.5]);

  const card5Y = useTransform(
    scrollYProgress,
    [0, 0.68, 0.88, 1.0],
    shouldReduceMotion ? [0, 0, 0, 0] : [2500, 750, 160, -350]
  );
  const card5Rotate = useTransform(scrollYProgress, [0.68, 1.0], shouldReduceMotion ? [0, 0] : [-6.5, -3]);

  const card5RightY = useTransform(
    scrollYProgress,
    [0, 0.68, 0.88, 1.0],
    shouldReduceMotion ? [0, 0, 0, 0] : [2400, 750, -150, -450]
  );
  const card5RightRotate = useTransform(scrollYProgress, [0.68, 1.0], shouldReduceMotion ? [0, 0] : [6.5, 3]);

  // Dynamic Per-Slide Chapter Doodle Transforms (Icons scroll up from bottom along with corresponding images):
  // Slide 1 (Breakfast): Coffee Cup, Ice Cream, Coffee Beans (Stay solid dark, scroll offscreen cleanly)
  const doodleCupY = useTransform(scrollYProgress, [0, 0.18, 0.38, 1.0], shouldReduceMotion ? [0, 0, 0, 0] : [750, 0, -950, -2600]);
  const doodleCupOpacity = useTransform(scrollYProgress, [0, 0.03, 0.36, 0.40], [0, 1, 1, 0]);

  const doodleIceCreamY = useTransform(scrollYProgress, [0, 0.18, 0.38, 1.0], shouldReduceMotion ? [0, 0, 0, 0] : [700, 0, -900, -2400]);
  const doodleIceCreamOpacity = useTransform(scrollYProgress, [0, 0.03, 0.36, 0.40], [0, 1, 1, 0]);

  const doodleBeansY = useTransform(scrollYProgress, [0, 0.18, 0.38, 1.0], shouldReduceMotion ? [0, 0, 0, 0] : [720, 0, -900, -2300]);
  const doodleBeansOpacity = useTransform(scrollYProgress, [0, 0.03, 0.36, 0.40], [0, 1, 1, 0]);

  // Slide 2 & 3 (Artisan Bakery & Kitchen): Croissant (Left) & Noodles (Right Bottom)
  const doodleBreadY = useTransform(scrollYProgress, [0, 0.18, 0.38, 0.58, 1.0], shouldReduceMotion ? [0, 0, 0, 0, 0] : [1600, 750, 0, -900, -2400]);
  const doodleBreadOpacity = useTransform(scrollYProgress, [0, 0.18, 0.24, 0.54, 0.58], [0, 0, 1, 1, 0]);

  const doodleNoodlesY = useTransform(scrollYProgress, [0, 0.18, 0.38, 0.58, 1.0], shouldReduceMotion ? [0, 0, 0, 0, 0] : [1600, 750, 0, -900, -2400]);
  const doodleNoodlesOpacity = useTransform(scrollYProgress, [0, 0.18, 0.24, 0.54, 0.58], [0, 0, 1, 1, 0]);

  // Fast Food (Burger + Soda) Doodle for Slide 3 (Dinner on Left side)
  const doodleFastFoodY = useTransform(scrollYProgress, [0, 0.38, 0.58, 0.78, 1.0], shouldReduceMotion ? [0, 0, 0, 0, 0] : [1800, 750, 0, -900, -2200]);
  const doodleFastFoodOpacity = useTransform(scrollYProgress, [0, 0.38, 0.44, 0.74, 0.78], [0, 0, 1, 1, 0]);

  // Slide 4 (Events): Cake Doodle (Left side, appears synchronously with Events slide)
  const doodleCakeY = useTransform(scrollYProgress, [0, 0.58, 0.78, 0.94, 1.0], shouldReduceMotion ? [0, 0, 0, 0, 0] : [1800, 750, 0, -900, -2200]);
  const doodleCakeOpacity = useTransform(scrollYProgress, [0, 0.58, 0.66, 0.84, 0.88], [0, 0, 1, 1, 0]);

  // Slide 4 (Events): Cookie Doodle (Right side - stays solid without disappearing)
  const doodleCookieY = useTransform(scrollYProgress, [0, 0.50, 0.72, 0.90, 1.0], shouldReduceMotion ? [0, 0, 0, 0, 0] : [1800, 750, 0, -450, -900]);
  const doodleCookieOpacity = useTransform(scrollYProgress, [0, 0.48, 0.56, 1.0], [0, 0, 1, 1]);

  // Slide 4 & 5 (Events & Nights): Wine Glass
  const doodleWineY = useTransform(scrollYProgress, [0, 0.50, 0.72, 0.90, 1.0], shouldReduceMotion ? [0, 0, 0, 0, 0] : [2000, 750, 0, -450, -900]);
  const doodleWineOpacity = useTransform(scrollYProgress, [0, 0.50, 0.56, 0.95, 1.0], [0, 0, 1, 1, 1]);

  // Slide 5 (Nights): Handcrafted Whiskey / Cocktail Tumbler on Right side
  const doodleWhiskeyY = useTransform(scrollYProgress, [0, 0.70, 0.88, 1.0], shouldReduceMotion ? [0, 0, 0, 0] : [1800, 750, 0, -80]);
  const doodleWhiskeyOpacity = useTransform(scrollYProgress, [0, 0.74, 0.86, 1.0], [0, 0, 1, 1]);

  // Plate Center Story Text Opacity Transformations (Clean transitions with zero overlapping):
  const text1Opacity = useTransform(scrollYProgress, [0, 0.08, 0.18, 0.23, 0.28], [0, 0.2, 1, 1, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.26, 0.30, 0.38, 0.43, 0.48], [0, 0.2, 1, 1, 0]);
  const text3Opacity = useTransform(scrollYProgress, [0.46, 0.50, 0.58, 0.63, 0.68], [0, 0.2, 1, 1, 0]);
  const text4Opacity = useTransform(scrollYProgress, [0.66, 0.70, 0.78, 0.83, 0.88], [0, 0.2, 1, 1, 0]);
  const text5Opacity = useTransform(scrollYProgress, [0.86, 0.90, 0.96, 1.0], [0, 0.2, 1, 1]);

  const textOpacities = [text1Opacity, text2Opacity, text3Opacity, text4Opacity, text5Opacity];

  // Real Continuous Smooth Scroll Loader (Static loader scaleX increases with scroll progress from chapter 1 to 5)
  const loaderScaleX = useTransform(
    scrollYProgress,
    [0.08, 0.28, 0.48, 0.68, 0.88, 1.0],
    [0.2, 0.4, 0.6, 0.8, 0.95, 1.0]
  );
  const loaderContainerOpacity = useTransform(
    scrollYProgress,
    [0, 0.06, 0.95, 1.0],
    [0, 1, 1, 1]
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-white text-[#1D120B] z-10 -mt-[2px]"
      style={{ height: '800vh' }}
    >

      {/* Pinned Sticky Viewport (100vh) */}
      <div className="sticky top-0 w-full h-screen overflow-hidden z-10">
        
        {/* Top-Left Editorial Brand Tag */}
        <div className="absolute top-8 sm:top-12 md:top-14 left-6 sm:left-12 md:left-16 z-30 pointer-events-none select-none">
          <span className="font-serif text-xs sm:text-sm tracking-[0.3em] uppercase text-[#7A6455] font-semibold">
            SAGĒ IN THE CITY
          </span>
        </div>

        {/* =========================================================================
            DECORATIVE SAGE GREEN ARTISANAL CAFE DOODLES (Synchronized with each story slide)
            ========================================================================= */}
        <div className="absolute inset-0 pointer-events-none select-none z-10 overflow-hidden">
          {/* 1. Coffee Cup Doodle (Slide 1: Breakfast Hero Icon on Right Side) */}
          <motion.div
            style={{ y: doodleCupY, opacity: doodleCupOpacity, rotate: -8, willChange: 'transform, opacity' }}
            className="absolute bottom-10 sm:bottom-14 md:bottom-16 right-4 sm:right-10 md:right-16 lg:right-20"
          >
            <CoffeeCupDoodle className="w-24 sm:w-36 md:w-44 lg:w-48 h-24 sm:h-36 md:h-44 lg:h-48 text-[#7FA382]" />
          </motion.div>

          {/* 2. Ice Cream Doodle (Slide 1: Top-Left Icon with Right Tilt & Larger Size) */}
          <motion.div
            style={{ y: doodleIceCreamY, opacity: doodleIceCreamOpacity, rotate: 15, willChange: 'transform, opacity' }}
            className="absolute top-14 sm:top-18 md:top-20 left-6 sm:left-12 md:left-16"
          >
            <IceCreamDoodle className="w-20 sm:w-28 md:w-36 h-20 sm:h-28 md:h-36 text-[#7FA382]" />
          </motion.div>

          {/* 3. Coffee Beans Doodle (Slide 1: Top-Right Icon) */}
          <motion.div
            style={{ y: doodleBeansY, opacity: doodleBeansOpacity, rotate: 12, willChange: 'transform, opacity' }}
            className="absolute top-8 sm:top-12 md:top-14 right-6 sm:right-12 md:right-16 lg:right-20"
          >
            <CoffeeBeansDoodle className="w-20 sm:w-28 md:w-36 lg:w-40 h-18 sm:h-24 md:h-30 lg:h-34 text-[#7FA382]" />
          </motion.div>

          {/* 4. Croissant Doodle (Slide 2: Glides up with Bakery slide on Left side) */}
          <motion.div
            style={{ y: doodleBreadY, opacity: doodleBreadOpacity, rotate: -12, willChange: 'transform, opacity' }}
            className="absolute top-32 sm:top-40 md:top-48 lg:top-52 left-6 sm:left-12 md:left-16 lg:left-24"
          >
            <BreadDoodle className="w-20 sm:w-28 md:w-36 lg:w-40 h-20 sm:h-28 md:h-36 lg:h-40 text-[#7FA382]" />
          </motion.div>

          {/* 5. Noodles / Ramen Bowl Doodle (Slide 2: Glides up with Bakery slide on Right Bottom) */}
          <motion.div
            style={{ y: doodleNoodlesY, opacity: doodleNoodlesOpacity, rotate: -8, willChange: 'transform, opacity' }}
            className="absolute bottom-8 sm:bottom-12 md:bottom-16 lg:bottom-20 right-2 sm:right-4 md:right-6 lg:right-8"
          >
            <NoodlesDoodle className="w-20 sm:w-28 md:w-36 lg:w-40 h-18 sm:h-24 md:h-30 lg:h-34 text-[#7FA382]" />
          </motion.div>

          {/* 6. Fast Food / Burger + Soda Doodle (Slide 3: Glides up with Dinner slide on Left Side) */}
          <motion.div
            style={{ y: doodleFastFoodY, opacity: doodleFastFoodOpacity, rotate: -12, willChange: 'transform, opacity' }}
            className="absolute top-24 sm:top-32 md:top-36 lg:top-40 left-6 sm:left-12 md:left-16 lg:left-24"
          >
            <FastFoodDoodle className="w-20 sm:w-28 md:w-36 lg:w-40 h-20 sm:h-28 md:h-36 lg:h-40 text-[#7FA382]" />
          </motion.div>

          {/* 7. Cake Doodle (Slide 4: Glides up with Events slide on Left side) */}
          <motion.div
            style={{ y: doodleCakeY, opacity: doodleCakeOpacity, rotate: -12, willChange: 'transform, opacity' }}
            className="absolute top-28 sm:top-36 md:top-40 lg:top-44 left-6 sm:left-12 md:left-16 lg:left-24"
          >
            <CakeDoodle className="w-20 sm:w-28 md:w-36 lg:w-40 h-20 sm:h-28 md:h-36 lg:h-40 text-[#7FA382]" />
          </motion.div>

          {/* 8. Cookie Doodle (Slide 4: Glides up with Events slide on Right side) */}
          <motion.div
            style={{ y: doodleCookieY, opacity: doodleCookieOpacity, rotate: 14, willChange: 'transform, opacity' }}
            className="absolute bottom-12 sm:bottom-16 md:bottom-20 lg:bottom-24 right-6 sm:right-12 md:right-16 lg:right-24"
          >
            <CookieDoodle className="w-20 sm:w-28 md:w-36 lg:w-40 h-20 sm:h-28 md:h-36 lg:h-40 text-[#7FA382]" />
          </motion.div>

          {/* 9. Wine / Cocktail Glass Doodle (Slide 4 & 5: Glides up with Events slide) */}
          <motion.div
            style={{ y: doodleWineY, opacity: doodleWineOpacity, rotate: 8, willChange: 'transform, opacity' }}
            className="absolute top-10 sm:top-14 md:top-16 left-[22%] sm:left-[26%] md:left-[29%]"
          >
            <WineGlassDoodle className="w-12 sm:w-16 md:w-18 h-14 sm:h-18 md:h-22 text-[#7FA382]" />
          </motion.div>

          {/* 10. Whiskey / Cocktail Tumbler Doodle (Slide 5: Glides up with Nights slide on Right side) */}
          <motion.div
            style={{ y: doodleWhiskeyY, opacity: doodleWhiskeyOpacity, rotate: -18, willChange: 'transform, opacity' }}
            className="absolute bottom-10 sm:bottom-14 md:bottom-16 lg:bottom-20 right-6 sm:right-12 md:right-16 lg:right-24"
          >
            <WhiskeyGlassDoodle className="w-20 sm:w-28 md:w-36 lg:w-40 h-22 sm:h-30 md:h-40 lg:h-44 text-[#7FA382]" />
          </motion.div>
        </div>

        {/* =========================================================================
            LAYER 1: SCATTERED PHOTO CARDS (BEHIND DISK at z-10)
            Every single card continuously glides upwards smoothly with organic tilt
            ========================================================================= */}
        <div className="absolute inset-0 z-10 pointer-events-none select-none overflow-hidden">
          {/* Card 1: Left (Breakfast) */}
          <motion.div
            style={{
              y: card1Y,
              rotate: card1Rotate,
              willChange: 'transform',
            }}
            className="absolute left-[3%] sm:left-[6%] md:left-[9%] lg:left-[13%] top-1/2 -translate-y-1/2 w-[210px] sm:w-[270px] md:w-[330px] lg:w-[370px]"
          >
            <div className="bg-white p-1.5 sm:p-2.5 shadow-md border border-stone-200/50">
              <img
                src={CHAPTERS[0].image}
                alt={CHAPTERS[0].heading}
                className="w-full h-[180px] sm:h-[230px] md:h-[280px] lg:h-[310px] object-cover"
              />
            </div>
          </motion.div>

          {/* Card 2: Right (Artisan Bakery) */}
          <motion.div
            style={{
              y: card2Y,
              rotate: card2Rotate,
              willChange: 'transform',
            }}
            className="absolute right-[3%] sm:right-[6%] md:right-[9%] lg:right-[13%] top-1/2 -translate-y-1/2 w-[210px] sm:w-[270px] md:w-[330px] lg:w-[370px]"
          >
            <div className="bg-white p-1.5 sm:p-2.5 shadow-md border border-stone-200/50">
              <img
                src={CHAPTERS[1].image}
                alt={CHAPTERS[1].heading}
                className="w-full h-[180px] sm:h-[230px] md:h-[280px] lg:h-[310px] object-cover"
              />
            </div>
          </motion.div>

          {/* Card 3: Left / Top-Left during EVENTS (Dinner / French Toast) */}
          <motion.div
            style={{
              y: card3Y,
              rotate: card3Rotate,
              willChange: 'transform',
            }}
            className="absolute left-[2%] sm:left-[5%] md:left-[8%] lg:left-[12%] top-1/2 -translate-y-1/2 w-[210px] sm:w-[270px] md:w-[330px] lg:w-[370px]"
          >
            <div className="bg-white p-1.5 sm:p-2.5 shadow-md border border-stone-200/50">
              <img
                src={CHAPTERS[2].image}
                alt={CHAPTERS[2].heading}
                className="w-full h-[180px] sm:h-[230px] md:h-[280px] lg:h-[310px] object-cover"
              />
            </div>
          </motion.div>

          {/* Card 4A: Top-Right during EVENTS (Buffet / Canopy Counter) */}
          <motion.div
            style={{
              y: card4TopRightY,
              rotate: card4TopRotate,
              willChange: 'transform',
            }}
            className="absolute right-[2%] sm:right-[5%] md:right-[8%] lg:right-[11%] top-1/2 -translate-y-1/2 w-[240px] sm:w-[300px] md:w-[370px] lg:w-[410px]"
          >
            <div className="bg-white p-1.5 sm:p-2.5 shadow-md border border-stone-200/50">
              <img
                src={ASSETS.cafeBrickWall}
                alt="Sagē Events Canopy Bar"
                className="w-full h-[160px] sm:h-[200px] md:h-[240px] lg:h-[260px] object-cover"
              />
            </div>
          </motion.div>

          {/* Card 4B: Bottom-Left during EVENTS (Dining & Table Seating) */}
          <motion.div
            style={{
              y: card4BottomRightY,
              rotate: card4BottomRotate,
              willChange: 'transform',
            }}
            className="absolute left-[3%] sm:left-[6%] md:left-[9%] lg:left-[13%] top-1/2 -translate-y-1/2 w-[210px] sm:w-[260px] md:w-[310px] lg:w-[350px]"
          >
            <div className="bg-white p-1.5 sm:p-2.5 shadow-md border border-stone-200/50">
              <img
                src={ASSETS.heroPizzaTable}
                alt="Sagē Events Private Tables"
                className="w-full h-[180px] sm:h-[230px] md:h-[280px] lg:h-[320px] object-cover"
              />
            </div>
          </motion.div>

          {/* Card 5: Left (Nights / Cocktails) */}
          <motion.div
            style={{
              y: card5Y,
              rotate: card5Rotate,
              willChange: 'transform',
            }}
            className="absolute left-[3%] sm:left-[6%] md:left-[10%] lg:left-[14%] top-1/2 -translate-y-1/2 w-[210px] sm:w-[270px] md:w-[330px] lg:w-[380px]"
          >
            <div className="bg-white p-1.5 sm:p-2.5 shadow-md border border-stone-200/50">
              <img
                src={CHAPTERS[4].image}
                alt={CHAPTERS[4].heading}
                className="w-full h-[180px] sm:h-[230px] md:h-[280px] lg:h-[320px] object-cover"
              />
            </div>
          </motion.div>

          {/* Card 5 (Right): Nights Neon Lounge & Bar */}
          <motion.div
            style={{
              y: card5RightY,
              rotate: card5RightRotate,
              willChange: 'transform',
            }}
            className="absolute right-[3%] sm:right-[6%] md:right-[10%] lg:right-[14%] top-1/2 -translate-y-1/2 w-[210px] sm:w-[270px] md:w-[330px] lg:w-[380px]"
          >
            <div className="bg-white p-1.5 sm:p-2.5 shadow-md border border-stone-200/50">
              <img
                src={ASSETS.neonCoffeeSign}
                alt="Sagē Evening Lounge"
                className="w-full h-[180px] sm:h-[230px] md:h-[280px] lg:h-[320px] object-cover"
              />
            </div>
          </motion.div>
        </div>

        {/* =========================================================================
            LAYER 2: CENTERPIECE DISK (IN FRONT OF CARDS at z-20) + STORY TEXT at z-30
            ========================================================================= */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none select-none flex items-center justify-center">
          
          {/* Rotating Ceramic Disk Layer */}
          <motion.div
            style={{
              y: diskY,
              rotate: diskRotate,
              scale: diskScale,
              willChange: 'transform',
            }}
            className="w-[300px] xs:w-[340px] sm:w-[420px] md:w-[490px] lg:w-[560px] xl:w-[620px] h-auto flex items-center justify-center drop-shadow-[0_35px_70px_rgba(50,25,10,0.22)]"
          >
            <img
              src={ASSETS.disk}
              alt="Sagē Luxury Ceramic Disk"
              className="w-full h-auto object-contain select-none"
            />
          </motion.div>

          {/* Upright Chapter Story Text Display Inside Plate (z-30) */}
          <motion.div
            style={{
              y: diskY,
              scale: diskScale,
            }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
          >
            <div className="relative w-[180px] xs:w-[205px] sm:w-[260px] md:w-[300px] lg:w-[350px] h-[180px] xs:h-[205px] sm:h-[260px] md:h-[300px] lg:h-[350px] flex items-center justify-center">
              {CHAPTERS.map((chapter, idx) => (
                <motion.div
                  key={chapter.id}
                  style={{
                    opacity: textOpacities[idx],
                    willChange: 'opacity',
                  }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center px-1 xs:px-2 sm:px-3 md:px-4 -translate-y-2.5 xs:-translate-y-3 sm:-translate-y-4 md:-translate-y-5"
                >
                  {/* Chapter Heading + Signature Flowing Cursive Script Overlay */}
                  <div className="relative flex flex-col items-center justify-center">
                    <h2
                      style={{
                        fontFamily: '"Stevie Sans", "Belleza", "Italiana", "Poiret One", "Syne", "Helvetica Neue", Arial, sans-serif',
                        color: 'rgb(15, 10, 103)',
                      }}
                      className="text-[13.5px] xs:text-[15px] sm:text-2xl md:text-3xl lg:text-[36px] font-normal tracking-[0.03em] uppercase select-none leading-snug max-w-[130px] xs:max-w-[150px] sm:max-w-[240px] md:max-w-none text-center"
                    >
                      {chapter.heading}
                    </h2>
                    <span
                      style={{
                        fontFamily: '"Caveat", "Covered By Your Grace", "Marck Script", "Nothing You Could Do", cursive',
                        color: '#7FA382',
                      }}
                      className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-[21px] -mt-0.5 sm:-mt-1 md:-mt-1.5 relative z-10 select-none font-medium"
                    >
                      {chapter.script}
                    </span>
                  </div>

                  {/* Editorial Description Paragraph with clean separation */}
                  <p
                    style={{
                      fontFamily: '"Stevie Sans", "Plus Jakarta Sans", "Helvetica Neue", Arial, sans-serif',
                      color: 'rgb(15, 10, 103)',
                      fontWeight: 400,
                    }}
                    className="text-[8.5px] xs:text-[9.5px] sm:text-[11px] md:text-[12px] lg:text-[13px] leading-[12px] xs:leading-[13.5px] sm:leading-[16px] md:leading-[18px] max-w-[135px] xs:max-w-[160px] sm:max-w-[220px] md:max-w-[260px] mt-1 sm:mt-1.5 md:mt-2 select-none text-center opacity-85"
                  >
                    {chapter.desc}
                  </p>
                </motion.div>
              ))}

              {/* Static / Fixed Real Scroll Loader - Positioned cleanly right under the story text */}
              <motion.div
                style={{
                  opacity: loaderContainerOpacity,
                }}
                className="absolute bottom-3 xs:bottom-3.5 sm:bottom-5 md:bottom-6 lg:bottom-7 w-full max-w-[85px] xs:max-w-[100px] sm:max-w-[130px] md:max-w-[150px] flex flex-col gap-0.5 sm:gap-1 select-none pointer-events-none"
              >
                <div
                  style={{
                    fontFamily: '"Stevie Sans", "Plus Jakarta Sans", "Helvetica Neue", Arial, sans-serif',
                    color: 'rgb(15, 10, 103)',
                  }}
                  className="flex items-center justify-between text-[9px] sm:text-[10px] md:text-[11px] font-normal"
                >
                  {/* Active Chapter Number - Smooth Fade between 01 to 05 */}
                  <div className="relative h-3.5 w-5">
                    {CHAPTERS.map((ch, i) => (
                      <motion.span
                        key={ch.id}
                        style={{ opacity: textOpacities[i] }}
                        className="absolute left-0 top-0 font-medium"
                      >
                        {ch.num}
                      </motion.span>
                    ))}
                  </div>
                  <span className="opacity-50 font-normal">/ 05</span>
                </div>

                {/* Real Continuous Scroll Progress Track */}
                <div className="w-full h-[1.5px] bg-[rgba(15,10,103,0.18)] relative overflow-hidden rounded-full">
                  <motion.div
                    className="h-full bg-[rgb(15,10,103)] origin-left rounded-full"
                    style={{
                      scaleX: loaderScaleX,
                      willChange: 'transform',
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default BlankWaveSection;
