import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Eye, 
  ChevronRight, 
  ArrowUpRight, 
  X, 
  ChevronLeft, 
  Maximize2, 
  Share2, 
  Camera,
  Coffee,
  Utensils,
  Sun,
  Moon,
  Compass
} from 'lucide-react';
import { ASSETS } from '../assets/images';
import { useUIStore } from '../store/useUIStore';
// -------------------------------------------------------------
// Vuetify-Style Skeleton Loader & Gallery Card Component
// (type: "card-avatar, image, article, actions")
// -------------------------------------------------------------
const GalleryCard = ({ item, index, onSelect }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Clean, tightly proportional aspect ratios that eliminate empty gaps
  const aspectClass = 
    item.aspect === 'portrait' 
      ? 'aspect-[4/5]' 
      : item.aspect === 'landscape'
      ? 'aspect-[16/11]'
      : 'aspect-square';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.06 }}
      onClick={() => onSelect(item)}
      className={`group relative w-full ${aspectClass} mb-6 sm:mb-8 break-inside-avoid bg-[#EFECE6] overflow-hidden cursor-pointer shadow-[0_12px_35px_rgba(0,0,0,0.08)] hover:shadow-[0_25px_60px_rgba(10,100,115,0.25)] transition-all duration-500 select-none block border border-stone-200/40`}
    >
      {/* SKELETON LOADER (Vuetify "card-avatar, image, article, actions" style) */}
      <div 
        className={`absolute inset-0 z-10 flex flex-col justify-between p-5 bg-[#E8E4DC] border border-stone-300/40 transition-opacity duration-500 overflow-hidden ${
          isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Shimmer Wave Highlight */}
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none z-20" />

        {/* Top: Card Avatar / Chip Badge Skeleton */}
        <div className="flex items-center justify-between z-10">
          <div className="h-6 w-28 bg-stone-300/80 rounded-full animate-pulse" />
          <div className="w-7 h-7 rounded-full bg-stone-300/70 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-stone-400" />
          </div>
        </div>

        {/* Center: Image / Camera Icon Skeleton Placeholder */}
        <div className="my-auto flex flex-col items-center justify-center text-stone-400/80 gap-2 z-10">
          <div className="w-14 h-14 rounded-2xl bg-stone-300/60 flex items-center justify-center shadow-inner">
            <Camera className="w-7 h-7 text-stone-400 stroke-[1.5]" />
          </div>
          <div className="w-20 h-2 bg-stone-300/70 rounded-full" />
        </div>

        {/* Bottom: Article Skeleton (Heading, Paragraph lines & Actions) */}
        <div className="space-y-2.5 z-10">
          <div className="flex items-center justify-between">
            <div className="h-3 w-16 bg-stone-300/80 rounded" />
            <div className="h-3 w-14 bg-stone-300/60 rounded" />
          </div>
          {/* Article Heading */}
          <div className="h-5 w-4/5 bg-stone-400/80 rounded-sm" />
          {/* Article Paragraph Lines */}
          <div className="space-y-1.5 pt-0.5">
            <div className="h-2.5 w-full bg-stone-300/70 rounded-sm" />
            <div className="h-2.5 w-2/3 bg-stone-300/60 rounded-sm" />
          </div>
        </div>
      </div>

      {/* Photo Image with Micro Hover Zoom & Fade-in */}
      <img
        src={item.image}
        alt={item.title}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover filter brightness-[0.97] contrast-[1.03] group-hover:scale-108 transition-all duration-700 ease-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Top Badge Overlay */}
      <div className={`absolute top-4 left-4 z-10 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <span 
          style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
          className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold tracking-[0.2em] uppercase rounded-full border border-white/20"
        >
          {item.tag}
        </span>
      </div>

      {/* Bottom Dark Gradient & Title Caption */}
      <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-5 sm:p-6 translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex flex-col justify-end ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}>
        
        <div className="flex items-center justify-between text-[#F3D898] text-[10.5px] font-semibold tracking-widest uppercase mb-1">
          <span>{item.time}</span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1 text-[10px]">
            EXPAND <Maximize2 className="w-3 h-3" />
          </span>
        </div>

        <h3
          style={{ fontFamily: '"Cormorant Garamond", "Italiana", serif' }}
          className="text-white text-xl sm:text-2xl font-normal leading-tight tracking-[0.02em] uppercase drop-shadow-md"
        >
          {item.title}
        </h3>

        <p
          style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
          className="text-white/80 text-xs font-light leading-relaxed mt-1 line-clamp-2"
        >
          {item.subtitle}
        </p>
      </div>
    </motion.div>
  );
};

// -------------------------------------------------------------
// Story Reel Card Component with Shimmer Skeleton Loader
// -------------------------------------------------------------
const StoryCard = ({ story }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="group relative h-[360px] bg-[#E8E4DC] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-stone-200/50">
      {/* Skeleton Shimmer */}
      <div 
        className={`absolute inset-0 z-10 flex flex-col justify-between p-5 bg-[#E8E4DC] transition-opacity duration-500 overflow-hidden ${
          isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none z-20" />
        <div className="h-5 w-24 bg-stone-300/80 rounded-full animate-pulse" />
        <div className="my-auto flex flex-col items-center justify-center text-stone-400/80 gap-2">
          <Camera className="w-8 h-8 text-stone-400 stroke-[1.5]" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-3/4 bg-stone-400/80 rounded" />
          <div className="h-3 w-full bg-stone-300/70 rounded" />
        </div>
      </div>

      <img
        src={story.image}
        alt={story.title}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover filter contrast-[1.05] brightness-[0.95] group-hover:scale-106 transition-all duration-700 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 flex flex-col justify-end text-white transition-opacity duration-300 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}>
        <h4 
          style={{ fontFamily: '"Cormorant Garamond", serif' }}
          className="text-xl font-normal tracking-wide uppercase mb-1 text-white group-hover:text-[#F3D898] transition-colors"
        >
          {story.title}
        </h4>
        <p className="text-white/80 text-xs font-light leading-relaxed">
          {story.desc}
        </p>
      </div>
    </div>
  );
};

export const GalleryPage = () => {
  const navigate = useNavigate();
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [menuPdfInfo, setMenuPdfInfo] = useState(null);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const data = await getMenuPdf();
        if (data?.success) {
          setMenuPdfInfo(data);
        }
      } catch (err) {
        console.error('Failed to load menu PDF in GalleryPage:', err);
      }
    };
    fetchPdf();
  }, []);

  const handleOpenPdfMenu = () => {
    const targetUrl =
      menuPdfInfo?.sections?.all?.url ||
      menuPdfInfo?.menuPdfUrl ||
      menuPdfInfo?.sections?.['lunch-dinner']?.url ||
      menuPdfInfo?.sections?.breakfast?.url ||
      menuPdfInfo?.sections?.beverages?.url ||
      menuPdfInfo?.sections?.dessert?.url;

    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } else {
      navigate('/menu');
    }
  };

  // Parallax for bottom editorial invitation image
  const inviteSectionRef = useRef(null);
  const { scrollYProgress: inviteProgress } = useScroll({
    target: inviteSectionRef,
    offset: ['start end', 'end start'],
  });
  const innerImageY = useTransform(inviteProgress, [0, 1], [-8, 8]);
  const outerImageY = useTransform(inviteProgress, [0, 1], [3, -3]);

  // Curated High-Definition Gallery Items
  const galleryItems = [
    {
      id: 1,
      category: 'coffee',
      title: 'Single-Origin Ethiopian Pour-Over',
      subtitle: 'Notes of jasmine, bergamot & wild peach',
      image: ASSETS.croissantCoffee || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85',
      aspect: 'portrait', // tall
      featured: true,
      time: '07:30 AM',
      tag: 'DAILY CALIBRATION',
    },
    {
      id: 2,
      category: 'spaces',
      title: 'Sunlit Reading Salon & Library',
      subtitle: 'Natural oak tables with quiet corner nooks',
      image: ASSETS.library || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=85',
      aspect: 'landscape', // wide
      featured: false,
      time: '10:15 AM',
      tag: 'THE LIBRARY',
    },
    {
      id: 3,
      category: 'bakery',
      title: 'Hand-Laminated Cardamom Croissant',
      subtitle: '36-hour slow cold fermentation with cultured French butter',
      image: ASSETS.frenchToast || 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=85',
      aspect: 'square',
      featured: false,
      time: '06:00 AM',
      tag: 'HEARTH BAKE',
    },
    {
      id: 4,
      category: 'kitchen',
      title: 'Artisanal Hearth Brunch Platter',
      subtitle: 'Avocado rose, poached eggs & sourdough toast',
      image: ASSETS.heroPizzaTable || 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=85',
      aspect: 'landscape',
      featured: true,
      time: '11:45 AM',
      tag: 'BRUNCH TABLE',
    },
    {
      id: 5,
      category: 'coffee',
      title: 'Velvet Flat White & Microfoam Art',
      subtitle: 'Double ristretto with silky textured oat milk',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=85',
      aspect: 'portrait',
      featured: false,
      time: '09:00 AM',
      tag: 'ESPRESSO BAR',
    },
    {
      id: 6,
      category: 'spaces',
      title: 'Terrace Pergola & Lush Greenery',
      subtitle: 'Open-air al fresco dining under warm string lights',
      image: ASSETS.sagePatioTerrace || ASSETS.image2,
      aspect: 'portrait',
      featured: true,
      time: '04:30 PM',
      tag: 'AL FRESCO PATIO',
    },
    {
      id: 7,
      category: 'evenings',
      title: 'Acoustic Soul & Live Vinyl Nights',
      subtitle: 'Intimate candlelit sessions every Thursday & Saturday',
      image: ASSETS.openMic || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=85',
      aspect: 'square',
      featured: false,
      time: '08:00 PM',
      tag: 'LIVE SESSIONS',
    },
    {
      id: 8,
      category: 'bakery',
      title: 'Wild Berry Pistachio Chiffon',
      subtitle: 'Layered sponge with fresh organic raspberry compote',
      image: ASSETS.cakePink || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=85',
      aspect: 'portrait',
      featured: false,
      time: '02:15 PM',
      tag: 'PATISSERIE',
    },
    {
      id: 9,
      category: 'coffee',
      title: 'Cold Drip Cold Brew Tower',
      subtitle: '12-hour slow iced water extraction for delicate fruit sweetness',
      image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1200&q=85',
      aspect: 'square',
      featured: false,
      time: '01:00 PM',
      tag: 'SLOW BAR',
    },
    {
      id: 10,
      category: 'kitchen',
      title: 'Woodfired Sourdough Truffle Pizza',
      subtitle: 'Wild forest mushrooms, fior di latte & fresh thyme',
      image: ASSETS.snacks || ASSETS.dishCenterpiece,
      aspect: 'portrait',
      featured: false,
      time: '07:15 PM',
      tag: 'WOODFIRED OVEN',
    },
    {
      id: 11,
      category: 'spaces',
      title: 'The Heritage Brick & Neon Corner',
      subtitle: 'Warm industrial brick textures with glowing neon vibes',
      image: ASSETS.neonCoffeeSign || ASSETS.cafeBrickWall,
      aspect: 'square',
      featured: false,
      time: '05:45 PM',
      tag: 'CAFÉ INTERIOR',
    },
    {
      id: 12,
      category: 'evenings',
      title: 'Golden Sunset Elixirs & Aperitifs',
      subtitle: 'Handcrafted botanical spritzes and housemocktails',
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=85',
      aspect: 'landscape',
      featured: true,
      time: '06:30 PM',
      tag: 'GOLDEN HOUR',
    },
  ];

  // Lightbox Navigation
  const handlePrevPhoto = (e) => {
    e?.stopPropagation();
    if (!selectedPhoto) return;
    const currentIndex = galleryItems.findIndex((item) => item.id === selectedPhoto.id);
    const prevIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    setSelectedPhoto(galleryItems[prevIndex]);
  };

  const handleNextPhoto = (e) => {
    e?.stopPropagation();
    if (!selectedPhoto) return;
    const currentIndex = galleryItems.findIndex((item) => item.id === selectedPhoto.id);
    const nextIndex = (currentIndex + 1) % galleryItems.length;
    setSelectedPhoto(galleryItems[nextIndex]);
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedPhoto) return;
      if (e.key === 'Escape') setSelectedPhoto(null);
      if (e.key === 'ArrowLeft') handlePrevPhoto();
      if (e.key === 'ArrowRight') handleNextPhoto();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1B365D] selection:bg-[#F3D898] selection:text-[#0A6473]">

      {/* ========================================================================= */}
      {/* 1. HERO HEADER: DEEP TEAL LUXURY ATMOSPHERE (FULL SCREEN 100VH BANNER)    */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-screen flex flex-col justify-between items-center text-center px-6 sm:px-10 pt-36 sm:pt-40 pb-12 overflow-hidden select-none bg-[#0A6473]">

        {/* Background Atmospheric Lighting & Warm Roastery Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=2400&q=85"
            alt="Sagē Roastery Background"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-[1.15]"
          />
          {/* Deep Teal Gradient & Subtle Radial Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#06333c]/90 via-[#0A6473]/75 to-[#0A6473]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#06333c]/40 to-[#0A6473]" />
        </div>

        {/* Giant Watermark Background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.07] flex items-center justify-center">
          <span
            style={{ fontFamily: '"Tan Mon Cheri", "Italiana", "Cormorant Garamond", serif' }}
            className="text-[32vw] font-bold text-white tracking-tighter leading-none select-none"
          >
            SAGĒ
          </span>
        </div>

        {/* Top Spacer */}
        <div className="w-full h-2" />

        {/* Hero Central Content (Perfect Middle Alignment) */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center text-center my-auto">
          
          {/* Main Serif Heading & Cursive Script */}
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
              SCENES & CRAFT
            </h1>

            <span
              style={{ fontFamily: '"Caveat", "Covered By Your Grace", cursive' }}
              className="text-[#9BC49E] text-2xl sm:text-3xl md:text-5xl lg:text-[52px] -mt-2 sm:-mt-4 md:-mt-5 relative z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] font-medium"
            >
              moments gathered around the cup
            </span>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: '"Plus Jakarta Sans", "Outfit", sans-serif' }}
            className="text-white/85 text-xs sm:text-sm md:text-[15px] font-light tracking-[0.16em] uppercase max-w-2xl leading-relaxed mt-8 sm:mt-10 px-4 text-center"
          >
            AN IMMERSIVE LOOK INTO OUR SPECIALTY ROASTS, WILD-YEAST SOURDOUGH BAKERY, SUNLIT SPACES, AND MEMORABLE EVENINGS.
          </motion.p>

        </div>

        {/* Quick Archive Metrics Strip */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="relative z-10 w-full max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/15 text-white text-center"
        >
          <div>
            <div className="text-xl sm:text-2xl font-serif text-[#F3D898]">50+</div>
            <div className="text-[10px] sm:text-[11px] tracking-widest uppercase text-white/75 font-sans">Single-Origin Lots</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-serif text-[#F3D898]">36h</div>
            <div className="text-[10px] sm:text-[11px] tracking-widest uppercase text-white/75 font-sans">Slow Fermentation</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-serif text-[#F3D898]">4</div>
            <div className="text-[10px] sm:text-[11px] tracking-widest uppercase text-white/75 font-sans">Distinct Spaces</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-serif text-[#F3D898]">100%</div>
            <div className="text-[10px] sm:text-[11px] tracking-widest uppercase text-white/75 font-sans">Artisanal Hospitality</div>
          </div>
        </motion.div>

      </section>


      {/* ========================================================================= */}
      {/* 2. DYNAMIC EDITORIAL MASONRY GALLERY (PERFECTLY ALIGNED, ZERO GAP ISSUES) */}
      {/* ========================================================================= */}
      <section className="relative w-full py-16 sm:py-20 md:py-24 px-4 sm:px-8 md:px-12 lg:px-16 max-w-[1440px] mx-auto">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 sm:gap-8 [column-fill:_balance]">
          {galleryItems.map((item, index) => (
            <GalleryCard
              key={item.id}
              item={item}
              index={index}
              onSelect={setSelectedPhoto}
            />
          ))}
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 4. VISUAL STORY REEL: BEHIND THE COUNTER (HORIZONTAL CAROUSEL STRIP)     */}
      {/* ========================================================================= */}
      <section className="relative w-full py-16 sm:py-24 px-6 sm:px-12 bg-white border-t border-stone-200/80 overflow-hidden select-none">
        <div className="max-w-[1400px] mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                className="text-xs sm:text-sm font-semibold tracking-[0.26em] uppercase text-[#7A6455] block mb-2"
              >
                UNFOLDING DAILY
              </span>
              <h2
                style={{ fontFamily: '"Cormorant Garamond", "Italiana", serif' }}
                className="text-3xl sm:text-4xl md:text-5xl font-normal uppercase tracking-[0.04em] text-[#1B365D]"
              >
                THE RHYTHM OF THE HOUSE
              </h2>
            </div>
            
            <p
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              className="text-stone-500 text-xs sm:text-sm max-w-md leading-relaxed"
            >
              A glimpse into the patient craft, early morning bakes, and late afternoon light that makes Sagē feel like home.
            </p>
          </div>

          {/* 4 Story Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: '05:00 AM • The Hearth Awakes',
                desc: 'Wild-yeast sourdough loaves scoring and entering stone deck ovens.',
                image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=85',
              },
              {
                title: '07:00 AM • First Extraction',
                desc: 'Tasting and dialling in the daily single-origin espresso origins.',
                image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=85',
              },
              {
                title: '01:00 PM • The Sunlit Hours',
                desc: 'Warm conversations, long lunches, and fresh pour-overs at the table.',
                image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=85',
              },
              {
                title: '07:30 PM • Candlelit Rhythm',
                desc: 'Vinyl beats spinning as twilight settles over the terrace pergola.',
                image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=85',
              },
            ].map((story, idx) => (
              <StoryCard key={idx} story={story} />
            ))}
          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 5. IMMERSIVE INVITATION / RESERVATION (WHITE 2-COLUMN LUXURY EDITORIAL)    */}
      {/* ========================================================================= */}
      <section ref={inviteSectionRef} className="relative w-full py-20 sm:py-28 md:py-32 px-6 sm:px-12 md:px-16 lg:px-24 bg-white text-[#1B365D] select-none overflow-hidden">
        <div className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Narrative & CTA Buttons */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6 sm:space-y-8">

            {/* Tag */}
            <span
              style={{ fontFamily: '"Plus Jakarta Sans", "Outfit", sans-serif' }}
              className="text-xs sm:text-sm font-semibold tracking-[0.26em] uppercase text-[#7A6455] block"
            >
              A WARM INVITATION
            </span>

            {/* Heading with Cursive Accent */}
            <div className="space-y-1">
              <h2
                style={{ fontFamily: '"Cormorant Garamond", "Italiana", "Belleza", serif' }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-normal tracking-[0.03em] uppercase leading-[1.08] text-[#1B365D]"
              >
                EXPERIENCE SAGĒ IN PERSON
              </h2>
              <span
                style={{ fontFamily: '"Caveat", "Covered By Your Grace", cursive' }}
                className="text-[#7FA382] text-xl sm:text-2xl md:text-3xl font-medium block"
              >
                reserve your corner with us
              </span>
            </div>

            {/* Description */}
            <p
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              className="text-stone-600 text-sm sm:text-[15px] leading-relaxed font-normal"
            >
              From quiet morning single-origin pour-overs in the sunlit library nook to golden hour dinners on the terrace pergola, our doors and tables are open for every gathering.
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

              <button
                type="button"
                onClick={handleOpenPdfMenu}
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                className="py-3.5 px-8 rounded border border-[#0A6473] text-[#0A6473] hover:bg-[#0A6473] hover:text-white transition-all font-semibold text-xs sm:text-sm tracking-[0.16em] uppercase cursor-pointer flex items-center gap-2 hover:scale-[1.02] active:scale-95"
              >
                <span>VIEW FULL MENU</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* Fine Print Note */}
            <p
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              className="text-stone-400 text-xs tracking-wide pt-2"
            >
              Private table & tasting salon reservations available for parties of 2 to 40 guests.
            </p>

          </div>

          {/* Right Column: Outer Large Image + Nested Smaller Inner Image + Bottom Text */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[720px] xl:max-w-[760px] h-[440px] sm:h-[520px] md:h-[580px] lg:h-[620px] flex items-center justify-center overflow-hidden shadow-[0_25px_60px_rgba(27,54,93,0.18)] select-none">

              {/* 1. Outer Large Background Image with Counter-Parallax */}
              <motion.div
                style={{
                  y: outerImageY,
                  willChange: 'transform',
                }}
                className="absolute inset-0 w-full h-[120%] -top-[10%]"
              >
                <img
                  src={ASSETS.image2}
                  alt="Sagē Café Gathering Atmosphere Background"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover filter brightness-[0.98] contrast-[1.02] scale-105"
                />
              </motion.div>

              {/* 2. Inner Centered Larger Framed Image with Gentle Scroll Parallax */}
              <motion.div
                style={{
                  y: innerImageY,
                  willChange: 'transform',
                }}
                className="relative z-10 w-[78%] sm:w-[80%] md:w-[82%] h-[74%] sm:h-[76%] md:h-[80%] overflow-hidden shadow-[0_20px_45px_rgba(0,0,0,0.35)] border border-white/60"
              >
                <img
                  src={ASSETS.image2}
                  alt="Sagē Café Gathering Atmosphere"
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
                  LONG MORNINGS / SPECIALTY ROASTS / THE RHYTHM OF SAGĒ
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 6. FULLSCREEN CINEMA-GRADE LIGHTBOX MODAL                                 */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 select-none"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              aria-label="Close Lightbox"
              className="absolute top-6 right-6 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white hover:text-[#F3D898] transition-all cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev Photo Arrow */}
            <button
              type="button"
              onClick={handlePrevPhoto}
              aria-label="Previous photo"
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-black/50 hover:bg-white/20 text-white hover:text-[#F3D898] transition-all cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Photo Arrow */}
            <button
              type="button"
              onClick={handleNextPhoto}
              aria-label="Next photo"
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-black/50 hover:bg-white/20 text-white hover:text-[#F3D898] transition-all cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Lightbox Content Container */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[90vh] bg-stone-900 rounded-none overflow-hidden flex flex-col md:flex-row shadow-[0_30px_90px_rgba(0,0,0,0.8)] border border-white/10"
            >
              {/* Main Expanded Image */}
              <div className="md:w-7/12 h-[350px] sm:h-[420px] md:h-[600px] relative bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={selectedPhoto.image}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-cover md:object-contain"
                />
              </div>

              {/* Sidebar Details */}
              <div className="md:w-5/12 p-6 sm:p-8 md:p-10 flex flex-col justify-between bg-stone-900 text-white">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 bg-[#0A6473] text-[#F3D898] text-[10px] font-semibold tracking-[0.22em] uppercase rounded-full">
                      {selectedPhoto.tag}
                    </span>
                    <span className="text-white/60 text-xs font-mono">
                      {selectedPhoto.time}
                    </span>
                  </div>

                  <h2
                    style={{ fontFamily: '"Cormorant Garamond", "Italiana", serif' }}
                    className="text-2xl sm:text-3xl md:text-4xl font-normal uppercase leading-tight tracking-[0.02em] mb-4 text-white"
                  >
                    {selectedPhoto.title}
                  </h2>

                  <p
                    style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                    className="text-stone-300 text-xs sm:text-sm leading-relaxed font-light"
                  >
                    {selectedPhoto.subtitle}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPhoto(null);
                      navigate('/menu');
                    }}
                    className="px-4 py-2.5 rounded-sm bg-white/10 hover:bg-white/20 text-white text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer"
                  >
                    Explore Menu
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPhoto(null);
                      navigate('/reservation');
                    }}
                    className="px-6 py-2.5 rounded-sm bg-[#0A6473] hover:bg-[#0c7587] text-[#F3D898] hover:text-white text-xs font-bold tracking-wider uppercase transition-all cursor-pointer shadow-lg"
                  >
                    Reserve Table
                  </button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default GalleryPage;
