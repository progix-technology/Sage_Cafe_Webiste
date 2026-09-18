import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Camera } from 'lucide-react';
import { ASSETS } from '../../assets/images';
import branchImg from '../../assets/icons/branch.png';

const CARDS = [
  {
    id: '01',
    titleLine1: 'MORNING',
    titleLine2: 'ROASTS',
    desc: 'Start early with our signature single-origin brew, freshly baked flaky croissants, and calm quiet moments.',
    tags: 'ESPRESSO / FRESH BAKERY / SLOW MORNINGS',
    image: ASSETS.croissantCoffee || 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: '02',
    titleLine1: 'ARTISAN',
    titleLine2: 'BRUNCH',
    desc: 'Gather around the table for generous shared platters, freshly toasted sourdough, and cold brewed tonics.',
    tags: 'BRUNCH / SOURDOUGH / SHARED PLATES',
    image: ASSETS.heroPizzaTable || 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: '03',
    titleLine1: 'AFTERNOON',
    titleLine2: 'POUR-OVERS',
    desc: 'Take a leisurely pause as the sun shifts, savoring handcrafted manual drips and delicate patisserie.',
    tags: 'SINGLE ORIGIN / DESSERT / COFFEE PAUSE',
    image: ASSETS.coffeeSnacks || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: '04',
    titleLine1: 'SWEET',
    titleLine2: 'MOMENTS',
    desc: 'Signature strawberry tarts, velvety lattes, and artisanal cakes baked fresh in our bakery every morning.',
    tags: 'PATISSERIE / SWEET BITES / SPECIALTIES',
    image: ASSETS.cakePink || 'https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: '05',
    titleLine1: 'EVENING',
    titleLine2: 'GATHERINGS',
    desc: 'Unwind under warm amber lights with refreshing iced tonics, signature mocktails, and easy conversations.',
    tags: 'COLD BREW / MOCKTAILS / SAGE NIGHTS',
    image: ASSETS.midImg || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop',
  },
];

// Tripled cards array to provide seamless infinite circular looping
const INFINITE_CARDS = [
  ...CARDS.map((c, i) => ({ ...c, uniqueKey: `set1-${c.id}-${i}` })),
  ...CARDS.map((c, i) => ({ ...c, uniqueKey: `set2-${c.id}-${i}` })),
  ...CARDS.map((c, i) => ({ ...c, uniqueKey: `set3-${c.id}-${i}` })),
];

const SET_LENGTH = CARDS.length;

// Vuetify-style Skeleton Loader for Days at Sage Card (type="image, article, actions")
export const DaysCardSkeleton = () => (
  <div
    className="carousel-card w-[240px] xs:w-[270px] sm:w-[310px] md:w-[340px] lg:w-[360px] xl:w-[380px] 2xl:w-[400px] bg-white border border-[#E4E7F2] shadow-sm flex flex-col justify-between shrink-0"
    style={{ minHeight: '430px' }}
  >
    <div className="flex flex-col h-full justify-between flex-1">
      <div>
        {/* Photo Container Shimmer (type="image") */}
        <div className="relative w-full h-[180px] sm:h-[195px] md:h-[210px] overflow-hidden bg-stone-200">
          <div className="absolute inset-0 animate-shimmer" />
          <div className="absolute inset-0 flex items-center justify-center text-stone-400 opacity-40">
            <Camera className="w-8 h-8" />
          </div>
        </div>

        {/* Editorial Text Area Skeleton (type="article") */}
        <div className="p-5 sm:p-6 pb-3 space-y-2">
          {/* Headline Skeleton Lines */}
          <div className="h-6 w-3/4 rounded bg-stone-200 animate-shimmer" />
          <div className="h-6 w-1/2 rounded bg-stone-200 animate-shimmer" />

          {/* Description Lines */}
          <div className="pt-2 space-y-1.5">
            <div className="h-3 w-full rounded bg-stone-100 animate-shimmer" />
            <div className="h-3 w-4/5 rounded bg-stone-100 animate-shimmer" />
          </div>
        </div>
      </div>

      {/* Card Bottom Tag Skeleton (type="actions") */}
      <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-3">
        <div className="w-full h-[1px] bg-[#E8EBF5] mb-3" />
        <div className="h-3 w-36 rounded bg-stone-200 animate-shimmer" />
      </div>
    </div>
  </div>
);

// Individual Card Component with Image Loading Shimmer & Smooth Fade-In
const DaysCard = ({ card, isActive, isNext }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className={`carousel-card w-[240px] xs:w-[270px] sm:w-[310px] md:w-[340px] lg:w-[360px] xl:w-[380px] 2xl:w-[400px] bg-white border border-[#E4E7F2] transition-all duration-500 flex flex-col justify-between shrink-0 ${
        isActive
          ? 'opacity-100 scale-100 shadow-md ring-1 ring-[#1A2865]/5 z-10'
          : isNext
          ? 'opacity-40 scale-[0.985] shadow-none'
          : 'opacity-25 scale-[0.97] shadow-none'
      }`}
      style={{ minHeight: '430px' }}
    >
      <div className="flex flex-col h-full justify-between flex-1">
        <div>
          {/* Photo Container */}
          <div className="relative w-full h-[180px] sm:h-[195px] md:h-[210px] overflow-hidden bg-stone-100">
            {/* Shimmer skeleton while image loads */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-stone-200 flex items-center justify-center animate-shimmer">
                <Camera className="w-8 h-8 text-stone-400 opacity-40" />
              </div>
            )}

            <img
              src={card.image}
              alt={`${card.titleLine1} ${card.titleLine2}`}
              loading="lazy"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover object-center transition-all duration-700 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              } ${isActive ? 'group-hover:scale-105' : ''}`}
            />
          </div>

          {/* Large & Spacious Editorial Text Area */}
          <div className="p-5 sm:p-6 pb-3">
            {/* Big Card Headline in Deep Blue */}
            <h3
              style={{
                fontFamily: '"Belleza", "Cormorant Garamond", "Cinzel", serif',
                color: '#1A2865',
              }}
              className="text-2xl sm:text-[26px] lg:text-[28px] font-normal uppercase tracking-wide leading-[1.05]"
            >
              {card.titleLine1}<br />{card.titleLine2}
            </h3>

            {/* Card Description in Slate Blue */}
            <p
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#556384' }}
              className="text-[11.5px] sm:text-xs leading-relaxed mt-2.5 max-w-[250px]"
            >
              {card.desc}
            </p>
          </div>
        </div>

        {/* Card Bottom Thin Line & Tag */}
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-3">
          <div className="w-full h-[1px] bg-[#E8EBF5] mb-3" />
          <span
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#8E97B8' }}
            className="text-[9.5px] sm:text-[10px] tracking-[0.2em] uppercase font-bold block"
          >
            {card.tags}
          </span>
        </div>
      </div>
    </div>
  );
};

export const DaysAtSageSection = () => {
  const scrollContainerRef = useRef(null);
  const [virtualIndex, setVirtualIndex] = useState(SET_LENGTH);
  const isResettingRef = useRef(false);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardElements = container.querySelectorAll('.carousel-card');
      if (cardElements[SET_LENGTH]) {
        container.scrollTo({
          left: cardElements[SET_LENGTH].offsetLeft - container.offsetLeft,
          behavior: 'instant',
        });
      }
    }
  }, []);

  const scrollToVirtualIndex = (targetIdx) => {
    setVirtualIndex(targetIdx);
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardElements = container.querySelectorAll('.carousel-card');
      if (cardElements[targetIdx]) {
        const targetCard = cardElements[targetIdx];
        container.scrollTo({
          left: targetCard.offsetLeft - container.offsetLeft,
          behavior: 'smooth',
        });
      }
    }
  };

  const handleScroll = () => {
    if (isResettingRef.current || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const cardElements = container.querySelectorAll('.carousel-card');
    const scrollLeft = container.scrollLeft;

    let closestIdx = virtualIndex;
    let minDistance = Infinity;

    cardElements.forEach((el, idx) => {
      const dist = Math.abs((el.offsetLeft - container.offsetLeft) - scrollLeft);
      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = idx;
      }
    });

    if (closestIdx >= 2 * SET_LENGTH) {
      isResettingRef.current = true;
      const normalizedIdx = closestIdx - SET_LENGTH;
      setVirtualIndex(normalizedIdx);
      if (cardElements[normalizedIdx]) {
        container.scrollTo({
          left: cardElements[normalizedIdx].offsetLeft - container.offsetLeft,
          behavior: 'instant',
        });
      }
      setTimeout(() => {
        isResettingRef.current = false;
      }, 50);
      return;
    }

    if (closestIdx < SET_LENGTH) {
      isResettingRef.current = true;
      const normalizedIdx = closestIdx + SET_LENGTH;
      setVirtualIndex(normalizedIdx);
      if (cardElements[normalizedIdx]) {
        container.scrollTo({
          left: cardElements[normalizedIdx].offsetLeft - container.offsetLeft,
          behavior: 'instant',
        });
      }
      setTimeout(() => {
        isResettingRef.current = false;
      }, 50);
      return;
    }

    setVirtualIndex(closestIdx);
  };

  const scrollNext = () => {
    scrollToVirtualIndex(virtualIndex + 1);
  };

  const realIndex = virtualIndex % SET_LENGTH;

  return (
    <section className="relative w-full bg-white text-[#1A2865] overflow-hidden pt-10 pb-12 sm:pt-12 sm:pb-16 lg:pt-14 lg:pb-18">

      {/* Botanical Branch Element emerging from left corner edge */}
      <div className="absolute -left-10 sm:-left-16 lg:-left-20 top-[18%] sm:top-[22%] w-[180px] sm:w-[230px] lg:w-[280px] pointer-events-none select-none z-0 opacity-25 sm:opacity-35 mix-blend-multiply rotate-[-10deg]">
        <img
          src={branchImg}
          alt=""
          className="w-full h-auto object-contain filter contrast-125"
        />
      </div>

      {/* Main Grid / Full-Bleed Flex Layout */}
      <div className="w-full flex flex-col lg:flex-row items-stretch px-6 sm:px-10 md:px-12 lg:pl-14 xl:pl-16 lg:pr-0">

        {/* =========================================================================
            LEFT COLUMN: Corner Anchored Editorial Column
            ========================================================================= */}
        <div className="w-full lg:w-[300px] xl:w-[340px] 2xl:w-[380px] shrink-0 flex flex-col justify-between pt-1 pb-2 pr-6 lg:pr-8 xl:pr-10">

          {/* Top Corner Label */}
          <div className="mb-6 lg:mb-0">
            <span
              style={{
                fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
                color: '#8E97B8',
              }}
              className="text-[10.5px] sm:text-xs tracking-[0.25em] uppercase font-medium block"
            >
              WAYS TO SPEND THE DAY
            </span>
          </div>

          {/* Middle Headline Block */}
          <div className="my-auto py-6 lg:py-8">
            <h2
              style={{
                fontFamily: '"Belleza", "Cormorant Garamond", "Cinzel", serif',
                color: '#1A2865',
              }}
              className="text-4xl sm:text-5xl lg:text-[54px] xl:text-[58px] font-normal uppercase leading-[0.95] tracking-[-0.01em]"
            >
              DAYS AT<br />SAGĒ
            </h2>

            {/* Flowing Script */}
            <span
              style={{
                fontFamily: '"Caveat", "Covered By Your Grace", cursive',
                color: '#88AA85',
              }}
              className="text-2xl sm:text-3xl lg:text-[34px] -mt-1 sm:-mt-1.5 mb-5 block font-medium select-none"
            >
              choose your rhythm
            </span>

            {/* Editorial Paragraph */}
            <p
              style={{
                fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
                color: '#556384',
              }}
              className="text-xs sm:text-[12.5px] md:text-[13px] leading-[1.7] max-w-[260px]"
            >
              Begin with morning espresso, gather over artisan brunch, or unwind with late afternoon brews and desserts. Every hour has its own flavor at Sagē.
            </p>
          </div>

          {/* Bottom Left Corner Note */}
          <div className="pt-4 lg:pt-0">
            <div className="w-16 h-[1.5px] bg-[#687699] mb-3 opacity-70" />
            <p
              style={{
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                color: '#707D9E',
              }}
              className="text-[11px] sm:text-[11.5px] leading-relaxed max-w-[230px]"
            >
              Handcrafted brews, warm pastries, seasonal tables, and quiet conversations shaped around you.
            </p>
          </div>

        </div>

        {/* =========================================================================
            RIGHT COLUMN: Exactly 2 Full Cards + Tiny Sliver Peeking
            ========================================================================= */}
        <div className="flex-1 min-w-0 relative mt-8 lg:mt-0 pl-0 lg:pl-2 flex flex-col justify-between">

          <div className="relative w-full">
            {/* Horizontal Track */}
            <div
              ref={scrollContainerRef}
              className="flex gap-4 sm:gap-6 overflow-x-auto sm:overflow-hidden scroll-smooth pb-4 pr-0 select-none"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {INFINITE_CARDS.map((card, idx) => {
                const isActive = idx === virtualIndex;
                const isNext = idx === virtualIndex + 1;

                return (
                  <DaysCard
                    key={card.uniqueKey}
                    card={card}
                    isActive={isActive}
                    isNext={isNext}
                  />
                );
              })}
            </div>

            {/* Floating Right Arrow Button */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex items-center pr-2 sm:pr-4">
              <button
                onClick={scrollNext}
                aria-label="Next slide"
                className="w-12 sm:w-14 h-16 sm:h-18 bg-[#8A93BA]/90 hover:bg-[#6872A2] backdrop-blur-md border border-white/50 text-white flex items-center justify-center transition-all cursor-pointer shadow-xl rounded-md group"
              >
                <ChevronRight className="w-6 h-6 stroke-[2.2] group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* =========================================================================
              BOTTOM CAROUSEL PROGRESS TRACK / LOADER DIRECTLY UNDER CARDS
              ========================================================================= */}
          <div className="mt-8 sm:mt-12 flex items-center gap-5 pb-2 pr-0 w-full">
            <div className="flex items-baseline gap-2.5 select-none shrink-0">
              <span
                style={{
                  fontFamily: '"Belleza", "Italiana", "Cormorant Garamond", serif',
                  color: '#1A2865',
                }}
                className="text-4xl sm:text-[44px] font-normal font-serif tracking-tight"
              >
                {CARDS[realIndex].id}
              </span>
              <span
                style={{ color: '#8E97B8' }}
                className="text-[10.5px] sm:text-[11.5px] font-sans tracking-[0.25em] font-medium"
              >
                / 0{SET_LENGTH}
              </span>
            </div>

            {/* Progress Line */}
            <div className="flex-1 h-[1.5px] bg-[#E2E5F5] relative overflow-hidden rounded-l-full">
              <motion.div
                className="h-full bg-[#8E97B8] rounded-l-full"
                animate={{
                  width: `${((realIndex + 1) / SET_LENGTH) * 100}%`,
                }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              />
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};

export default DaysAtSageSection;
