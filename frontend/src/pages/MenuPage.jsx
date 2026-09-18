import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Check, 
  FileText, 
  Download, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Star, 
  SlidersHorizontal,
  X,
  ExternalLink,
  Utensils,
  Camera,
  Leaf
} from 'lucide-react';
import { ASSETS } from '../assets/images';
import { useCartStore } from '../store/useCartStore';
import { useUIStore } from '../store/useUIStore';
import { getMenuPdf } from '../services/api';

// Structured Menu Categories aligned with the reference editorial layout
const MENU_SECTIONS = [
  {
    id: 'breakfast',
    title: 'BREAKFAST',
    subtitle: 'Morning Selections',
    accent: 'Fresh bakes & morning pour-overs',
    pdfName: 'BREAKFAST PDF MENU',
    icon: ASSETS.croissantIcon,
    items: [
      {
        id: 'bk-1',
        name: 'Artisanal Butter Croissant & Wild Berry Preserves',
        price: 180,
        dietary: 'veg',
        description: 'Laminated slow-fermented French pastry with cultured Normandy butter and homemade berry compote.',
        image: ASSETS.croissantCoffee,
        isChefSpecial: true,
      },
      {
        id: 'bk-2',
        name: 'Honey Butter Brioche French Toast',
        price: 320,
        dietary: 'veg',
        description: 'Thick-cut golden brioche topped with vanilla gelato, fresh blueberries, cherries, and dark chocolate drizzle.',
        image: ASSETS.frenchToast,
        isChefSpecial: true,
      },
      {
        id: 'bk-3',
        name: 'Avocado Tartine on Sourdough',
        price: 290,
        dietary: 'vegan',
        description: 'Crushed Hass avocado, heirloom cherry tomatoes, toasted pumpkin seeds, and cold-pressed olive oil on country sourdough.',
        image: ASSETS.snacks,
        isChefSpecial: false,
      },
      {
        id: 'bk-4',
        name: 'Single-Origin Hand Pour-Over',
        price: 210,
        dietary: 'vegan',
        description: 'Hand-dripped Ethiopian Yirgacheffe beans with notes of jasmine, bergamot, and sweet citrus finish.',
        image: ASSETS.dayView,
        isChefSpecial: false,
      },
    ],
  },
  {
    id: 'lunch-dinner',
    title: 'LUNCH & DINNER',
    subtitle: 'Selected Dishes',
    accent: 'Woodfired ovens & artisanal plates',
    pdfName: 'LUNCH & DINNER PDF MENU',
    icon: ASSETS.dishCenterpiece,
    items: [
      {
        id: 'ld-1',
        name: 'Woodfired Neapolitan Burrata & Pesto Pizza',
        price: 499,
        dietary: 'veg',
        description: '72-hour fermented blistered crust, San Marzano tomato sauce, fresh artisan burrata, and garden basil pesto.',
        image: ASSETS.heroPizzaTable,
        isChefSpecial: true,
      },
      {
        id: 'ld-2',
        name: 'Loaded Double Smash Burger & Seasoned Fries',
        price: 349,
        dietary: 'non-veg',
        description: 'Double smashed crispy patty, melted aged gouda, grilled brioche bun, house relish, and golden seasoned fries.',
        image: ASSETS.burgerFriesPlatter,
        isChefSpecial: true,
      },
      {
        id: 'ld-3',
        name: 'Artisan Gourmet Mezze Platter',
        price: 480,
        dietary: 'veg',
        description: 'Whipped artisanal labneh, roasted spiced chickpeas, kalamata tapenade, herb-marinated olives, and warm toasted pita.',
        image: ASSETS.startImage,
        isChefSpecial: true,
      },
      {
        id: 'ld-4',
        name: 'Charred Garden Vegetable Quinoa Bowl',
        price: 360,
        dietary: 'vegan',
        description: 'Wood-roasted seasonal veggies, spiced chickpeas, tri-color quinoa, tahini cream, and toasted pine nuts.',
        image: ASSETS.snacks,
        isChefSpecial: false,
      },
    ],
  },
  {
    id: 'dessert',
    title: 'DESSERT',
    subtitle: 'Artisanal Sweets',
    accent: 'House churned gelato & warm bakes',
    pdfName: 'DESSERT PDF MENU',
    icon: ASSETS.iceCreamIcon,
    items: [
      {
        id: 'ds-1',
        name: 'Warm Belgian Dark Chocolate Lava Fondant',
        price: 290,
        dietary: 'veg',
        description: 'Molten Valrhona 70% dark chocolate cake served with Madagascan vanilla bean gelato and cocoa crumble.',
        image: ASSETS.dessertLavaFondant,
        isChefSpecial: true,
      },
      {
        id: 'ds-2',
        name: 'Artisan Roasted Hazelnut & Chocolate Cookies',
        price: 160,
        dietary: 'veg',
        description: 'Batch-baked chocolate chunk cookies with roasted Piedmont hazelnuts, fine salt flakes, and dark cocoa nibs.',
        image: ASSETS.dessertHazelnutCookies,
        isChefSpecial: false,
      },
      {
        id: 'ds-3',
        name: 'Seasonal Berry & Pistachio Brioche Tart',
        price: 310,
        dietary: 'veg',
        description: 'Crisp pastry shell filled with Sicilian pistachio ganache, fresh raspberries, and edible gold leaf.',
        image: ASSETS.dessertBerryTart,
        isChefSpecial: true,
      },
      {
        id: 'ds-4',
        name: 'House Churned Stracciatella & Fig Gelato',
        price: 240,
        dietary: 'veg',
        description: 'Velvety gelato swirled with caramelized Turkish figs and dark Belgian chocolate shavings.',
        image: ASSETS.dessertFigGelato,
        isChefSpecial: false,
      },
    ],
  },
  {
    id: 'beverages',
    title: 'COFFEE & BEVERAGES',
    subtitle: 'Specialty Roastery & Brew Bar',
    accent: 'Single-origin pour-overs & crafted brews',
    pdfName: 'COFFEE & BEVERAGES PDF MENU',
    icon: ASSETS.branch,
    items: [
      {
        id: 'bv-1',
        name: 'Sagē Signature Citrus Sunset Spritz',
        price: 320,
        dietary: 'vegan',
        description: 'Blood orange reduction, wild rosemary, sparkling botanical tonic, and organic herb-spiced rim.',
        image: ASSETS.bg1,
        isChefSpecial: true,
      },
      {
        id: 'bv-2',
        name: 'Velvet Cold Brew with Sweet Vanilla Cream',
        price: 240,
        dietary: 'veg',
        description: '18-hour cold steeped Arabica topped with lightly whipped sweet vanilla cream and cinnamon dust.',
        image: ASSETS.dayView,
        isChefSpecial: false,
      },
      {
        id: 'bv-3',
        name: 'Sagē Artisanal Sparkling Hibiscus Cooler',
        price: 220,
        dietary: 'vegan',
        description: 'Infused wild hibiscus petals, pomegranate pearls, crushed mint, and sparkling mineral spring water.',
        image: ASSETS.openMic,
        isChefSpecial: false,
      },
    ],
  },
];

// Vuetify-style Skeleton Loader for Dish Menu Items
const MenuItemSkeleton = () => (
  <div className="bg-[#0C5866]/50 p-4 sm:p-6 rounded-sm border border-white/10 shadow-lg backdrop-blur-sm flex flex-col sm:flex-row gap-5">
    {/* Dish Thumbnail Shimmer */}
    <div className="relative w-full sm:w-36 h-44 sm:h-36 flex-shrink-0 rounded overflow-hidden bg-white/10">
      <div className="absolute inset-0 animate-shimmer" />
      <div className="absolute inset-0 flex items-center justify-center text-white/20">
        <Utensils className="w-8 h-8 opacity-30" />
      </div>

      {/* Dietary Badge Pill Skeleton */}
      <div className="absolute top-2 left-2">
        <div className="h-4 w-20 rounded bg-white/20 animate-shimmer" />
      </div>
    </div>

    {/* Dish Details Skeleton */}
    <div className="flex-1 flex flex-col justify-between">
      <div>
        {/* Title & Price Row */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="h-5 w-7/12 rounded bg-white/20 animate-shimmer" />
          <div className="h-5 w-14 rounded bg-white/20 animate-shimmer" />
        </div>

        {/* Dietary info sub-badge skeleton */}
        <div className="h-3 w-24 rounded bg-white/10 animate-shimmer mb-2.5" />

        {/* Ingredients Description Lines */}
        <div className="space-y-1.5 mb-4">
          <div className="h-3 w-full rounded bg-white/10 animate-shimmer" />
          <div className="h-3 w-5/6 rounded bg-white/10 animate-shimmer" />
        </div>
      </div>

      {/* Bottom Row: "+ Add to Order" Quick Button Skeleton */}
      <div className="flex items-center justify-between pt-2 border-t border-white/10">
        <div className="h-3 w-16 rounded bg-white/10 animate-shimmer" />
        <div className="h-7 w-28 rounded bg-white/20 animate-shimmer" />
      </div>
    </div>
  </div>
);

// Individual Dish Card with Image Loading Shimmer & Smooth Fade-In
const MenuItemCard = ({ item, isAdded, onAddToCart }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      layout
      className="bg-[#0C5866]/50 hover:bg-[#0C5866]/80 p-4 sm:p-6 rounded-sm border border-white/10 hover:border-white/25 shadow-lg backdrop-blur-sm transition-all duration-300 flex flex-col sm:flex-row gap-5 group/card"
    >
      {/* Dish Photo */}
      <div className="relative w-full sm:w-36 h-44 sm:h-36 flex-shrink-0 rounded overflow-hidden bg-white/10">
        {/* Shimmer placeholder while image loads */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-white/10 flex items-center justify-center animate-shimmer">
            <Utensils className="w-8 h-8 text-white/20" />
          </div>
        )}

        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover group-hover/card:scale-105 transition-all duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Dietary / Chef Signature Badge */}
        {item.isChefSpecial ? (
          <span className="absolute top-2 left-2 z-10 bg-[#F3D898] text-[#0A6473] text-[9px] font-bold px-2 py-0.5 rounded shadow-sm tracking-wider uppercase font-sans">
            CHEF'S SIGNATURE
          </span>
        ) : item.dietary === 'vegan' ? (
          <span className="absolute top-2 left-2 z-10 bg-emerald-700/90 text-emerald-100 text-[9px] font-semibold px-2 py-0.5 rounded shadow-sm tracking-wider uppercase font-sans flex items-center gap-1">
            <Leaf className="w-2.5 h-2.5" />
            <span>VEGAN</span>
          </span>
        ) : item.dietary === 'veg' ? (
          <span className="absolute top-2 left-2 z-10 bg-emerald-600/90 text-white text-[9px] font-semibold px-2 py-0.5 rounded shadow-sm tracking-wider uppercase font-sans">
            VEG
          </span>
        ) : (
          <span className="absolute top-2 left-2 z-10 bg-amber-600/90 text-white text-[9px] font-semibold px-2 py-0.5 rounded shadow-sm tracking-wider uppercase font-sans">
            NON-VEG
          </span>
        )}
      </div>

      {/* Dish Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <h3
              className="text-lg sm:text-xl font-normal text-white group-hover/card:text-[#F3D898] transition-colors leading-snug"
              style={{ fontFamily: "'Cormorant Garamond', 'Belleza', serif" }}
            >
              {item.name}
            </h3>
            <span className="text-base sm:text-lg font-bold text-[#F3D898] font-sans whitespace-nowrap">
              &#8377;{item.price}
            </span>
          </div>

          <p className="text-white/70 text-xs leading-relaxed font-sans line-clamp-2 sm:line-clamp-3 mb-4">
            {item.description}
          </p>
        </div>

        {/* Bottom Row: Add To Order Action */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
            {item.dietary?.toUpperCase() || 'ARTISAN'}
          </span>

          <button
            onClick={() => onAddToCart(item)}
            className={`py-1.5 px-4 rounded text-xs tracking-wider uppercase font-sans font-medium transition-all duration-300 flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              isAdded
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-[#F3D898] hover:bg-white text-[#0A6473] font-bold shadow-md hover:shadow-lg'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>ADDED</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>ADD TO ORDER</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const MenuPage = () => {
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);
  const { openCart, openTableOrderModal } = useUIStore();

  // Accordion State: Default all collapsed matching reference preview
  const [expandedSections, setExpandedSections] = useState({
    breakfast: false,
    'lunch-dinner': false,
    dessert: false,
    beverages: false,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [addedItemIds, setAddedItemIds] = useState([]);

  const [menuPdfInfo, setMenuPdfInfo] = useState({
    hasMenuPdf: false,
    menuPdfUrl: '',
    sections: {
      all: null,
      breakfast: null,
      'lunch-dinner': null,
      dessert: null,
      beverages: null,
    }
  });
  const [isLoadingPdf, setIsLoadingPdf] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    // Initial mount loading state
    const timer = setTimeout(() => setIsPageLoading(false), 400);

    const fetchPdfMenu = async () => {
      setIsLoadingPdf(true);
      try {
        const data = await getMenuPdf();
        if (data?.success) {
          setMenuPdfInfo(data);
        }
      } catch (e) {
        console.error('Failed to load menu PDF info:', e);
      } finally {
        setIsLoadingPdf(false);
      }
    };
    fetchPdfMenu();

    return () => clearTimeout(timer);
  }, []);

  const handleOpenPdfMenu = (section = null) => {
    // 1. Check for section-specific PDF or Master PDF from Cloudinary
    const sectionKey = section?.id;
    const sectionPdfUrl = sectionKey && menuPdfInfo?.sections?.[sectionKey]?.url;
    const masterPdfUrl = menuPdfInfo?.sections?.all?.url || menuPdfInfo?.menuPdfUrl;
    const targetUrl = sectionPdfUrl || masterPdfUrl;

    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // 2. Direct high-res PDF preview window fallback (instant print/PDF view without modal)
    const targetSections = section ? [section] : MENU_SECTIONS;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const sectionsHtml = targetSections.map((sec) => `
      <div style="margin-bottom: 28px; page-break-inside: avoid;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid #0A6473; padding-bottom: 6px; margin-bottom: 14px;">
          <h2 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 22px; color: #0A6473; margin: 0; letter-spacing: 2px; text-transform: uppercase;">${sec.title}</h2>
          <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748B;">${sec.subtitle}</span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
          ${sec.items.map((item) => `
            <div style="background: #F8FAFC; padding: 12px 14px; border-radius: 8px; border: 1px solid #E2E8F0;">
              <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 13px; color: #0B1728; margin-bottom: 4px;">
                <span>${item.name}</span>
                <span style="color: #0A6473;">₹${item.price}</span>
              </div>
              <p style="font-size: 11px; color: #64748B; margin: 0 0 4px 0; line-height: 1.4;">${item.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Sagē Café — Official Dine-In Menu</title>
          <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
          <style>
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; padding: 20px !important; }
              .no-print { display: none !important; }
            }
            body {
              font-family: 'Inter', -apple-system, sans-serif;
              color: #0F172A;
              margin: 0;
              padding: 36px 48px;
              background: #FFFFFF;
            }
          </style>
        </head>
        <body>
          <div class="no-print" style="position: sticky; top: 0; background: #0A6473; color: white; padding: 12px 24px; border-radius: 8px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
            <div><strong>Sagē Café Official Menu Preview</strong> &bull; Hazratganj, Lucknow</div>
            <button onclick="window.print()" style="background: #F3D898; color: #0A6473; border: none; padding: 8px 18px; border-radius: 6px; font-weight: bold; cursor: pointer; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Print / Save as PDF</button>
          </div>
          <div style="text-align: center; margin-bottom: 28px; border-bottom: 1px solid #E2E8F0; padding-bottom: 18px;">
            <h1 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 34px; color: #0A6473; margin: 0; letter-spacing: 4px; text-transform: uppercase;">SAGĒ CAFÉ & ROASTERY</h1>
            <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #64748B; margin-top: 4px;">Artisanal Dine-In Catalogue &bull; Hazratganj, Lucknow</p>
          </div>
          ${sectionsHtml}
          <div style="text-align: center; margin-top: 36px; padding-top: 16px; border-top: 1px solid #E2E8F0; font-size: 11px; color: #94A3B8;">
            Sagē Café & Roastery &bull; Hazratganj, Lucknow &bull; Contact: +91 522 402 8899 &bull; Website: sagecafe.in
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const toggleSection = (id) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAddToCart = (item) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      dietaryType: item.dietary,
    });
    setAddedItemIds((prev) => [...prev, item.id]);
    setTimeout(() => {
      setAddedItemIds((prev) => prev.filter((id) => id !== item.id));
    }, 1800);
    openTableOrderModal(item);
  };

  // Filter sections by search
  const filteredSections = useMemo(() => {
    return MENU_SECTIONS.map((section) => {
      const items = section.items.filter((item) => {
        // Search Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = item.name.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          if (!matchName && !matchDesc) return false;
        }
        return true;
      });

      return {
        ...section,
        items,
      };
    });
  }, [searchQuery]);

  const scrollToSection = (sectionId) => {
    setExpandedSections((prev) => ({ ...prev, [sectionId]: true }));
    setTimeout(() => {
      const el = document.getElementById(`section-${sectionId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#0A6473] text-white selection:bg-[#F3D898] selection:text-[#0A6473]">
      
      {/* ========================================================================= */}
      {/* 1. FULL-PAGE LUXURY BANNER / HERO SECTION WITH 3 SVG ICONS */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[68vh] sm:min-h-[75vh] flex flex-col items-center justify-between text-center px-6 sm:px-10 pt-36 pb-16 overflow-hidden select-none">
        
        {/* Background Subtle Gradient & Deep Artisanal Emerald Tone */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#06343C] via-[#09505D] to-[#0A6473]" />
        
        {/* ======================================================================= */}
        {/* UPPER BANNER: SEAMLESS REPEATING WALLPAPER PATTERN (CROISSANT, ICE CREAM, COOKIE) */}
        {/* ======================================================================= */}
        <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
          
          {/* Tiled Seamless Wallpaper Pattern using the 3 SVG Icons */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.14] select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="bakeryWallpaperPattern"
                x="0"
                y="0"
                width="160"
                height="160"
                patternUnits="userSpaceOnUse"
              >
                {/* 1. Croissant SVG Icon */}
                <image
                  href={ASSETS.croissantIcon}
                  x="12"
                  y="12"
                  width="56"
                  height="56"
                  preserveAspectRatio="xMidYMid meet"
                />

                {/* 2. Ice Cream Gelato SVG Icon */}
                <image
                  href={ASSETS.iceCreamIcon}
                  x="92"
                  y="12"
                  width="56"
                  height="56"
                  preserveAspectRatio="xMidYMid meet"
                />

                {/* 3. Cookie SVG Icon */}
                <image
                  href={ASSETS.cookieIcon}
                  x="12"
                  y="92"
                  width="56"
                  height="56"
                  preserveAspectRatio="xMidYMid meet"
                />

                {/* 4. Alternate Ice Cream / Croissant Icon */}
                <image
                  href={ASSETS.croissantIcon}
                  x="92"
                  y="92"
                  width="56"
                  height="56"
                  preserveAspectRatio="xMidYMid meet"
                  transform="rotate(25 120 120)"
                />
              </pattern>
            </defs>

            <rect width="100%" height="100%" fill="url(#bakeryWallpaperPattern)" />
          </svg>

          {/* Vignette Gradient Overlay so center text pops with maximum elegance */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0A6473]/30 via-[#0A6473]/60 to-[#0A6473]/95 pointer-events-none" />

          {/* Ambient Monogram Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
            <span
              style={{ fontFamily: '"Tan Mon Cheri", "Italiana", "Cormorant Garamond", serif' }}
              className="text-[34vw] font-bold text-white tracking-tighter leading-none"
            >
              SAGĒ
            </span>
          </div>
        </div>

        {/* Hero Central Content */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          
          {/* Main Title with Cursive Accent Centered Beneath */}
          <div className="flex flex-col items-center mb-6 sm:mb-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-[0.14em] uppercase text-white leading-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
              style={{ fontFamily: "'Cormorant Garamond', 'Belleza', serif" }}
            >
              THE MENU
            </motion.h1>

            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#E8DCC4] font-normal tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] mt-1 sm:mt-2 block"
              style={{ fontFamily: "'Covered By Your Grace', 'Caveat', cursive" }}
            >
              artisanal craft & warmth
            </motion.span>
          </div>

          {/* Subtitle Paragraph matching urban artisanal cafe style */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-[11px] sm:text-xs md:text-[13px] tracking-[0.22em] uppercase text-white/90 max-w-2xl leading-relaxed font-sans mt-4 sm:mt-6 px-4"
          >
            ARTISANAL COFFEES, FRESHLY BAKED PASTRIES, WOODFIRED BITES, AND COMFORTING PLATES &mdash; CRAFTED FOR SLOW MORNINGS, AFTERNOON WORK BREAKS, AND WARM EVENINGS WITH FRIENDS.
          </motion.p>

          {/* 3 Interactive Upper Banner Quick Jump Badges (Croissant, Ice Cream, Cookie) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-xl"
          >
            {/* Croissant Badge */}
            <button
              onClick={() => scrollToSection('breakfast')}
              className="group bg-[#0C5866]/80 hover:bg-[#F3D898] text-white hover:text-[#0A6473] py-2.5 px-4 sm:px-5 rounded-full border border-white/20 hover:border-[#F3D898] shadow-lg backdrop-blur-md transition-all duration-300 flex items-center gap-2.5 cursor-pointer transform hover:scale-105 active:scale-95"
            >
              <img src={ASSETS.croissantIcon} alt="Croissant" className="w-4 h-4 object-contain filter group-hover:invert-0 group-hover:brightness-0 brightness-200 transition-all" />
              <span className="text-[11px] sm:text-xs tracking-[0.16em] uppercase font-sans font-medium">
                BREAKFAST &amp; BAKES
              </span>
            </button>

            {/* Ice Cream Badge */}
            <button
              onClick={() => scrollToSection('dessert')}
              className="group bg-[#0C5866]/80 hover:bg-[#F3D898] text-white hover:text-[#0A6473] py-2.5 px-4 sm:px-5 rounded-full border border-white/20 hover:border-[#F3D898] shadow-lg backdrop-blur-md transition-all duration-300 flex items-center gap-2.5 cursor-pointer transform hover:scale-105 active:scale-95"
            >
              <img src={ASSETS.iceCreamIcon} alt="Ice Cream" className="w-4 h-4 object-contain filter group-hover:invert-0 group-hover:brightness-0 brightness-200 transition-all" />
              <span className="text-[11px] sm:text-xs tracking-[0.16em] uppercase font-sans font-medium">
                GELATO &amp; DESSERT
              </span>
            </button>

            {/* Cookie Badge */}
            <button
              onClick={() => scrollToSection('lunch-dinner')}
              className="group bg-[#0C5866]/80 hover:bg-[#F3D898] text-white hover:text-[#0A6473] py-2.5 px-4 sm:px-5 rounded-full border border-white/20 hover:border-[#F3D898] shadow-lg backdrop-blur-md transition-all duration-300 flex items-center gap-2.5 cursor-pointer transform hover:scale-105 active:scale-95"
            >
              <img src={ASSETS.cookieIcon} alt="Cookie" className="w-4 h-4 object-contain filter group-hover:invert-0 group-hover:brightness-0 brightness-200 transition-all" />
              <span className="text-[11px] sm:text-xs tracking-[0.16em] uppercase font-sans font-medium">
                LUNCH &amp; MAINS
              </span>
            </button>
          </motion.div>

        </div>

        {/* Global Search Bar */}
        <div className="relative z-10 w-full max-w-2xl mx-auto mt-12 sm:mt-16 flex items-center">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#F3D898] absolute top-1/2 -translate-y-1/2 left-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search croissants, burrata, gelato, pizzas..."
              className="w-full pl-11 pr-10 py-3.5 rounded-full bg-[#084854]/80 border border-white/20 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#F3D898] backdrop-blur-md shadow-inner transition-colors font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. EDITORIAL CATEGORY SECTIONS (ACCORDIONS MATCHING REFERENCE SCREENSHOT) */}
      {/* ========================================================================= */}
      <section className="relative w-full bg-[#0A6473] border-t border-white/15">
        
        {filteredSections.map((section, sIndex) => {
          const isExpanded = expandedSections[section.id] ?? false;

          return (
            <div
              key={section.id}
              id={`section-${section.id}`}
              className="border-b border-white/15 transition-colors"
            >
              <div className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-14 lg:px-20">
                
                {/* Section Main Header Row (Large Serif Title + Explore Trigger) */}
                <div
                  onClick={() => toggleSection(section.id)}
                  className="py-10 sm:py-14 md:py-16 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer group select-none"
                >
                  {/* Left: Category Title */}
                  <div className="flex items-baseline">
                    <h2
                      className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-[0.06em] uppercase text-white group-hover:text-[#F3D898] transition-colors leading-none"
                      style={{ fontFamily: "'Cormorant Garamond', 'Belleza', serif" }}
                    >
                      {section.title}
                    </h2>
                  </div>

                  {/* Right: Explore Trigger Button with Line Extension */}
                  <div className="flex items-center gap-4 sm:gap-6 self-end md:self-auto">
                    <div className="flex items-center gap-3 text-xs sm:text-sm tracking-[0.2em] uppercase font-sans text-white/80 group-hover:text-white transition-colors">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/30 flex items-center justify-center group-hover:border-[#F3D898] group-hover:bg-[#F3D898] group-hover:text-[#0A6473] transition-all">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 transition-transform" />
                        ) : (
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        )}
                      </div>
                      <span className="font-normal">
                        Explore &bull; {section.subtitle}
                      </span>
                    </div>

                    {/* Decorative Horizontal Line */}
                    <div className="w-16 sm:w-28 md:w-40 h-[1px] bg-white/25 group-hover:bg-[#F3D898]/60 transition-colors hidden sm:block" />
                  </div>
                </div>

                {/* Expandable Items Drawer */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden pb-12 sm:pb-16"
                    >
                      {/* Sub-Header Bar: PDF Menu Download Action (Only visible when explored) */}
                      <div className="flex items-center justify-between pb-6 pt-1 mb-4 text-xs text-white/60 font-sans border-t border-white/10">
                        <span className="tracking-[0.2em] uppercase text-[11px] sm:text-xs">
                          {section.pdfName}
                        </span>

                        {isLoadingPdf ? (
                          <div className="h-7 w-24 rounded bg-white/20 animate-shimmer" />
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenPdfMenu(section);
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 rounded border border-white/25 hover:border-[#F3D898] text-white hover:text-[#F3D898] text-[11px] uppercase tracking-widest transition-all cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>PDF MENU</span>
                          </button>
                        )}
                      </div>
                      {isPageLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
                          {[...Array(4)].map((_, i) => (
                            <MenuItemSkeleton key={i} />
                          ))}
                        </div>
                      ) : section.items.length === 0 ? (
                        <p className="py-8 text-center text-white/50 text-xs tracking-widest uppercase font-sans">
                          No dishes found matching your current search.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
                          {section.items.map((item) => {
                            const isAdded = addedItemIds.includes(item.id);

                            return (
                              <MenuItemCard
                                key={item.id}
                                item={item}
                                isAdded={isAdded}
                                onAddToCart={handleAddToCart}
                              />
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>
          );
        })}

      </section>

    </div>
  );
};
