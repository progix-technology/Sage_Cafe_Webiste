import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ASSETS } from '../../assets/images';

const CALENDAR_EVENTS = [
  {
    id: '01',
    dateNumber: '01',
    dateStamp: '01 / 04TH AUGUST / SUNSET GATHERING VOL. 1',
    title: 'SUNSET GATHERING VOL. 1',
    note: 'golden light & aperitifs',
    image: ASSETS.startImage,
  },
  {
    id: '02',
    dateNumber: '02',
    dateStamp: '02 / 08TH AUGUST / VINO E NOTE VOL. 1',
    title: 'VINO E NOTE VOL. 1',
    note: 'acoustic guitar under stars',
    image: ASSETS.openMic,
  },
  {
    id: '03',
    dateNumber: '03',
    dateStamp: '03 / 12TH AUGUST / VINO E NOTE VOL. 2',
    title: 'VINO E NOTE VOL. 2',
    note: 'pour-overs & candlelight',
    image: ASSETS.cafeBrickWall,
  },
  {
    id: '04',
    dateNumber: '04',
    dateStamp: '04 / 16TH AUGUST / SUNSET GATHERING VOL. 2',
    title: 'SUNSET GATHERING VOL. 2',
    note: 'evening breeze & vinyl beats',
    image: ASSETS.dayView,
  },
  {
    id: '05',
    dateNumber: '05',
    dateStamp: '05 / 19TH AUGUST / DISCO DOM',
    title: 'DISCO DOM',
    note: 'warm jazz & late cocktails',
    image: ASSETS.neonCoffeeSign,
  },
  {
    id: '06',
    dateNumber: '06',
    dateStamp: '06 / 22ND AUGUST / VINO E NOTE VOL. 3',
    title: 'VINO E NOTE VOL. 3',
    note: 'one last summer note',
    image: ASSETS.bg1,
  },
  {
    id: '07',
    dateNumber: '07',
    dateStamp: '07 / 29TH AUGUST / & FRIENDS',
    title: '& FRIENDS',
    note: 'a table for everyone',
    image: ASSETS.heroPizzaTable,
  },
];

export const EveningAtmosphereSection = () => {
  // Default to index 5 ('VINO E NOTE VOL. 3') matching the exact reference screenshot
  const [activeIndex, setActiveIndex] = useState(5);
  const currentEvent = CALENDAR_EVENTS[activeIndex] || CALENDAR_EVENTS[5];

  return (
    <section className="relative w-full bg-white text-[#1B365D] py-16 sm:py-24 md:py-28 px-6 sm:px-10 md:px-14 lg:px-20 overflow-hidden border-t border-stone-100">
      <div className="max-w-[1440px] mx-auto w-full">

        {/* Top Tag */}
        <span className="text-xs uppercase tracking-[0.25em] text-[#1B365D] font-bold font-sans mb-12 sm:mb-16 md:mb-20 block">
          THE SAGE CALENDAR
        </span>

        {/* 3-Column Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

          {/* Column 1: Left Editorial Headline & Narrative (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div>
              <h2
                className="text-4xl sm:text-5xl md:text-6xl font-light tracking-[0.03em] uppercase text-[#152E5E] leading-[1.05]"
                style={{ fontFamily: "'Cormorant Garamond', 'Belleza', serif" }}
              >
                EVENINGS AT SAGE
              </h2>
              <span
                className="text-2xl sm:text-3xl md:text-4xl text-[#7DA37B] -mt-1 sm:-mt-2 block font-normal tracking-wide"
                style={{ fontFamily: "'Covered By Your Grace', 'Caveat', cursive" }}
              >
                seven nights to remember
              </span>

              <p className="text-[#1B365D] text-xs sm:text-sm md:text-[15px] leading-relaxed mt-6 max-w-md font-sans">
                From golden-hour coffees to artisanal brews, live music, and nights with friends. Choose your date and join us around the table.
              </p>
            </div>

            {/* Bottom Footnote with Thin Rule */}
            <div className="mt-14 sm:mt-20 lg:mt-32">
              <div className="w-20 sm:w-24 h-[1px] bg-[#1B365D]/30 mb-4" />
              <p className="text-[11px] sm:text-xs text-[#2C4A7C] max-w-xs leading-relaxed font-sans">
                Seven dates shaped by music, slow food, fine coffee, familiar faces, and lingering conversations.
              </p>
            </div>
          </div>

          {/* Column 2: Middle Interactive Event List (3 cols) */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-end justify-center gap-4 sm:gap-5 py-4 select-none">
            {CALENDAR_EVENTS.map((event, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={event.id}
                  onClick={() => setActiveIndex(index)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`text-xs sm:text-[13px] tracking-[0.2em] uppercase transition-all duration-300 text-right cursor-pointer ${
                    isActive
                      ? 'text-[#152E5E] font-bold scale-105'
                      : 'text-[#CBD5E1] hover:text-[#64748B] font-normal'
                  }`}
                  style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
                >
                  {event.title}
                </button>
              );
            })}
          </div>

          {/* Column 3: Right Polaroid / Stacked Physical Card Deck (4 cols) */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end relative">
            
            {/* Background Decorative Leaves Branch - Peeking from behind the upper part of the card */}
            <div className="absolute -top-24 sm:-top-32 md:-top-40 right-2 sm:right-6 md:right-10 pointer-events-none select-none z-0 w-[200px] sm:w-[260px] md:w-[320px] opacity-95">
              <img
                src={ASSETS.branch}
                alt="Decorative Leaves Branch"
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-contain transform -scale-x-100 filter drop-shadow-[0_4px_16px_rgba(27,54,93,0.12)]"
              />
            </div>

            <div className="relative z-10 max-w-[420px] w-full">
              
              {/* Stacked Deck Ghost Cards Peeking in Background */}
              <div className="absolute inset-0 bg-[#E4DFC7]/70 -rotate-3 -translate-x-3.5 -translate-y-2 rounded-sm shadow-md pointer-events-none" />
              <div className="absolute inset-0 bg-[#ECE8DC]/90 -rotate-1.5 -translate-x-1.5 -translate-y-1 rounded-sm shadow-lg pointer-events-none" />

              {/* Main Active Polaroid Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentEvent.id}
                  initial={{ opacity: 0, y: 10, rotate: -1.5, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="relative bg-[#ECE8DF] p-4 sm:p-5 pb-6 sm:pb-7 rounded-sm shadow-2xl border border-stone-300/80 w-full select-none"
                >
                  {/* Photo Viewport */}
                  <div className="relative aspect-[4/3.6] w-full overflow-hidden bg-stone-300 shadow-inner">
                    <img
                      src={currentEvent.image}
                      alt={currentEvent.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-center select-none"
                      draggable={false}
                    />
                  </div>

                  {/* Polaroid Bottom Caption Row */}
                  <div className="mt-4 sm:mt-5 flex items-center justify-between gap-2 px-1">
                    <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#4A5568] uppercase font-medium">
                      {currentEvent.dateStamp}
                    </span>
                    <span
                      className="text-lg sm:text-xl md:text-2xl text-[#7DA37B] font-normal tracking-wide whitespace-nowrap"
                      style={{ fontFamily: "'Covered By Your Grace', 'Caveat', cursive" }}
                    >
                      {currentEvent.note}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default EveningAtmosphereSection;
