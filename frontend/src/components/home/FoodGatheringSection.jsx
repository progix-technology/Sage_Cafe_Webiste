import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ASSETS } from '../../assets/images';

const FOOD_ITEMS = [
  {
    id: '01',
    tag: 'PASTA / ITALIAN EASE / LONG LUNCH',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: '02',
    tag: 'PLATES / AT THE CENTRE / MADE TO SHARE',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: '03',
    tag: 'TO SHARE / FOR THE TABLE / STAY LONGER',
    image: ASSETS.heroPizzaTable || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: '04',
    tag: 'DESSERT / LAST COURSE / SOMETHING SWEET',
    image: ASSETS.cakePink || 'https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: '05',
    tag: 'GOURMET BISTRO / ARTISAN BURGER / CRISPY FRIES',
    image: ASSETS.burgerFriesPlatter || 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop',
  },
];

const SET_LENGTH = FOOD_ITEMS.length;

// Tripled items array for seamless infinite circular looping
const INFINITE_ITEMS = [
  ...FOOD_ITEMS.map((item, i) => ({ ...item, uniqueKey: `set1-${item.id}-${i}` })),
  ...FOOD_ITEMS.map((item, i) => ({ ...item, uniqueKey: `set2-${item.id}-${i}` })),
  ...FOOD_ITEMS.map((item, i) => ({ ...item, uniqueKey: `set3-${item.id}-${i}` })),
];

export const FoodGatheringSection = () => {
  const scrollContainerRef = useRef(null);
  // Start on the second card of the middle set (index SET_LENGTH + 1) to match Pier88 screenshot (02/05 or 03/05 with left peeking)
  const [virtualIndex, setVirtualIndex] = useState(SET_LENGTH + 1);
  const isResettingRef = useRef(false);

  // Position carousel initially so 1 partial card peeks on the left
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardElements = container.querySelectorAll('.food-card');
      const targetIdx = SET_LENGTH + 1;
      if (cardElements[targetIdx]) {
        const targetCard = cardElements[targetIdx];
        // Inset by ~80px to show partial card on the left
        const leftOffset = targetCard.offsetLeft - container.offsetLeft - 80;
        container.scrollTo({
          left: Math.max(0, leftOffset),
          behavior: 'instant',
        });
      }
    }
  }, []);

  const scrollToVirtualIndex = (targetIdx) => {
    setVirtualIndex(targetIdx);
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardElements = container.querySelectorAll('.food-card');
      if (cardElements[targetIdx]) {
        const targetCard = cardElements[targetIdx];
        const leftOffset = targetCard.offsetLeft - container.offsetLeft - 80;
        container.scrollTo({
          left: Math.max(0, leftOffset),
          behavior: 'smooth',
        });
      }
    }
  };

  const handleScroll = () => {
    if (isResettingRef.current || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const cardElements = container.querySelectorAll('.food-card');
    const scrollLeft = container.scrollLeft;

    let closestIdx = virtualIndex;
    let minDistance = Infinity;

    cardElements.forEach((el, idx) => {
      const targetPos = el.offsetLeft - container.offsetLeft - 80;
      const dist = Math.abs(targetPos - scrollLeft);
      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = idx;
      }
    });

    // Seamless loop reset
    if (closestIdx >= 2 * SET_LENGTH) {
      isResettingRef.current = true;
      const normalizedIdx = closestIdx - SET_LENGTH;
      setVirtualIndex(normalizedIdx);
      if (cardElements[normalizedIdx]) {
        const leftOffset = cardElements[normalizedIdx].offsetLeft - container.offsetLeft - 80;
        container.scrollTo({
          left: Math.max(0, leftOffset),
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
        const leftOffset = cardElements[normalizedIdx].offsetLeft - container.offsetLeft - 80;
        container.scrollTo({
          left: Math.max(0, leftOffset),
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

  const scrollPrev = () => {
    scrollToVirtualIndex(virtualIndex - 1);
  };

  const scrollNext = () => {
    scrollToVirtualIndex(virtualIndex + 1);
  };

  const realIndex = virtualIndex % SET_LENGTH;

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between bg-white text-[#1A2865] overflow-hidden pt-10 sm:pt-14 md:pt-16 pb-8 sm:pb-12">

      {/* =========================================================================
          TOP HEADER ROW: Title (Left) + Subtitle/Script + Tagline (Right)
          ========================================================================= */}
      <div className="w-full px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 mb-6 sm:mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 sm:gap-6">

          {/* Left Title & Cursive Script */}
          <div className="flex flex-col items-start">
            <h2
              style={{
                fontFamily: '"Belleza", "Cormorant Garamond", "Cinzel", serif',
                color: '#1A2865',
                fontWeight: 300,
              }}
              className="text-4xl sm:text-5xl lg:text-[54px] font-light uppercase tracking-[0.03em] leading-none"
            >
              MADE FOR GATHERING
            </h2>
            <span
              style={{
                fontFamily: '"Caveat", "Covered By Your Grace", cursive',
                color: '#88AA85',
              }}
              className="text-2xl sm:text-3xl lg:text-[32px] -mt-1 sm:-mt-2 block font-medium"
            >
              every reason to stay
            </span>
          </div>

          {/* Right Tagline (Aligned to Top) */}
          <div className="md:text-right pt-2 sm:pt-3">
            <span
              style={{
                fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
                color: '#8E97B8',
              }}
              className="text-[10.5px] sm:text-xs md:text-[12px] tracking-[0.25em] uppercase font-medium block"
            >
              FROM THE KITCHEN TO THE TABLE
            </span>
          </div>

        </div>
      </div>

      {/* =========================================================================
          FULL-BLEED CAROUSEL STRIP (4 Full Cards + Left & Right Slivers)
          ========================================================================= */}
      <div className="relative w-full flex items-center overflow-hidden my-auto group/slider">

        {/* Left Square Button (Overlapping left card boundary, visible on mobile & on desktop hover) */}
        <button
          onClick={scrollPrev}
          aria-label="Previous dishes"
          className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-30 w-10 sm:w-14 h-12 sm:h-16 bg-[#2B2B2B]/85 sm:bg-[#2B2B2B]/75 hover:bg-[#1C1C1C]/90 backdrop-blur-md text-white border border-white/40 flex items-center justify-center transition-all duration-300 shadow-2xl cursor-pointer opacity-90 sm:opacity-0 sm:pointer-events-none group-hover/slider:opacity-100 group-hover/slider:pointer-events-auto active:scale-95"
        >
          <ChevronLeft className="w-5 sm:w-6 h-5 sm:h-6 stroke-[2.2]" />
        </button>

        {/* Right Square Button (Overlapping right card boundary, visible on mobile & on desktop hover) */}
        <button
          onClick={scrollNext}
          aria-label="Next dishes"
          className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-30 w-10 sm:w-14 h-12 sm:h-16 bg-[#2B2B2B]/85 sm:bg-[#2B2B2B]/75 hover:bg-[#1C1C1C]/90 backdrop-blur-md text-white border border-white/40 flex items-center justify-center transition-all duration-300 shadow-2xl cursor-pointer opacity-90 sm:opacity-0 sm:pointer-events-none group-hover/slider:opacity-100 group-hover/slider:pointer-events-auto active:scale-95"
        >
          <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6 stroke-[2.2]" />
        </button>

        {/* Horizontal Carousel Track */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="w-full flex items-center gap-3 xs:gap-4 sm:gap-5 lg:gap-6 overflow-x-auto sm:overflow-x-hidden select-none"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {INFINITE_ITEMS.map((item, idx) => {
            const isActive = idx === virtualIndex;
            const isNext = idx === virtualIndex + 1;

            return (
              <div
                key={item.uniqueKey}
                onClick={() => scrollToVirtualIndex(idx)}
                className={`food-card w-[260px] xs:w-[290px] sm:w-[330px] md:w-[350px] lg:w-[365.73px] h-[350px] xs:h-[386px] sm:h-[440px] md:h-[466px] lg:h-[487.64px] shrink-0 relative overflow-hidden rounded-none bg-white cursor-pointer transition-all duration-500 origin-center group ${isActive
                  ? 'scale-100 opacity-100 z-10 shadow-xl ring-1 ring-black/5'
                  : isNext
                    ? 'scale-[0.96] opacity-40 shadow-none'
                    : 'scale-[0.93] opacity-25 shadow-none'
                  }`}
              >
                {/* Dish Image */}
                <img
                  src={item.image}
                  alt={item.tag}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1200&auto=format&fit=crop';
                  }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 select-none"
                  loading="lazy"
                  draggable={false}
                />

                {/* Bottom Subtle Gradient for Caption Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent pointer-events-none" />

                {/* Bottom Left Tagline Caption */}
                <div className="absolute bottom-5 left-5 right-5 z-10 pointer-events-none">
                  <span
                    style={{
                      fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
                    }}
                    className={`text-[10px] sm:text-[10.5px] md:text-[11px] font-bold tracking-[0.22em] text-white/95 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] block leading-snug transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-80'
                      }`}
                  >
                    {item.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* =========================================================================
          BOTTOM PROGRESS COUNTER & TRACK
          ========================================================================= */}
      <div className="w-full px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 mt-6 sm:mt-8">
        <div className="flex items-center gap-6 sm:gap-8">

          {/* Slide Counter (e.g. 03 / 05) */}
          <span
            style={{
              fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
              color: '#1A2865',
            }}
            className="text-xs sm:text-[12.5px] tracking-widest font-medium shrink-0 select-none"
          >
            {String(realIndex + 1).padStart(2, '0')} / {String(SET_LENGTH).padStart(2, '0')}
          </span>

          {/* Full-width Progress Track with Cumulative Fill */}
          <div className="relative flex-1 h-[1.5px] bg-[#E2E5F2] overflow-hidden">
            <div
              className="absolute top-0 bottom-0 left-0 bg-[#1A2865] transition-all duration-500 ease-out"
              style={{
                width: `${((realIndex + 1) / SET_LENGTH) * 100}%`,
              }}
            />
          </div>

        </div>
      </div>

    </section>
  );
};

export default FoodGatheringSection;
