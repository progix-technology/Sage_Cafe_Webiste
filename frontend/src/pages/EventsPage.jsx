import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Sparkles,
  Music,
  Coffee,
  Utensils,
  Mic2,
  Wine,
  ChevronRight,
  ArrowUpRight,
  Check,
  X,
  Flame,
  Tag,
  Sliders,
  Send,
  Ticket,
  CreditCard,
  ShieldCheck,
  Phone,
  Mail,
  User,
  Loader2,
  Download,
  Printer,
  QrCode,
  Smartphone,
  Building,
  Lock,
  CheckCircle2,
  Copy,
  Camera
} from 'lucide-react';
import { ASSETS } from '../assets/images';
import { useUIStore } from '../store/useUIStore';
import { getEvents, createEventPaymentOrder, verifyEventPayment } from '../services/api';

// Helper to load Razorpay Checkout SDK dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Default initial events fallback
const INITIAL_CURATED_EVENTS = [
  {
    _id: 'evt-1',
    id: 1,
    category: 'music',
    title: 'Midnight Vinyl & Velvet Jazz Sessions',
    tag: 'RESIDENT NIGHT',
    host: 'Featuring The Sagē Trio & DJ Julian',
    date: 'THURSDAY, SEPT 18',
    time: '08:00 PM – 11:30 PM',
    location: 'Terrace Pergola & Cocktail Lounge',
    price: '₹250 / guest',
    includes: 'Welcome botanical spritz & house sourdough bites',
    spotsLeft: 6,
    featured: true,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=85',
    description:
      'An intimate candlelit evening with rare 1970s soul & modal jazz vinyl records spun live, paired with house herbal tonics and warm hearth bakes under the terrace string lights.',
  },
  {
    _id: 'evt-2',
    id: 2,
    category: 'coffee',
    title: 'Single-Origin Cupping & Sensory Workshop',
    tag: 'MASTERCLASS',
    host: 'Led by Master Roaster Marco Vance',
    date: 'SATURDAY, SEPT 20',
    time: '10:00 AM – 12:30 PM',
    location: 'Artisanal Roastery Salon',
    price: '₹450 / guest',
    includes: 'Tasting of 6 rare microlots + 250g bean bag to take home',
    spotsLeft: 4,
    featured: false,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85',
    description:
      'Explore origin terroir, processing methods (anaerobic, honey, natural), and calibration techniques. Learn how to smell, slurp, and score coffee like certified Q-graders.',
  },
  {
    _id: 'evt-3',
    id: 3,
    category: 'bakery',
    title: '36-Hour Wild Yeast Sourdough & Lamination',
    tag: 'HANDS-ON BAKING',
    host: 'With Head Baker Elena Moreau',
    date: 'SUNDAY, SEPT 21',
    time: '09:00 AM – 01:00 PM',
    location: 'Hearth Bakery Kitchen',
    price: '₹650 / guest',
    includes: 'Freshly baked loaf, starter jar & artisanal brunch platter',
    spotsLeft: 3,
    featured: true,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=85',
    description:
      'Demystify sourdough baking from nurturing a wild starter, mixing high hydration doughs, to intricate scoring techniques and hand-laminating cardamom brioche.',
  },
  {
    _id: 'evt-4',
    id: 4,
    category: 'community',
    title: 'Sagē Words: Acoustic & Spoken Word Open Mic',
    tag: 'COMMUNITY STAGE',
    host: 'Curated by The City Writers Collective',
    date: 'TUESDAY, SEPT 23',
    time: '07:30 PM – 10:30 PM',
    location: 'The Library Lounge',
    price: 'Free Entry / RSVP Required',
    includes: 'Complimentary pour-over coffee bar for performers',
    spotsLeft: 12,
    featured: false,
    image: ASSETS.openMic || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=85',
    description:
      'A warm, welcoming stage for songwriters, poets, and storytellers. Enjoy acoustic guitars, candid stories, and fresh herbal teas in our cozy bookshelf salon.',
  },
  {
    _id: 'evt-5',
    id: 5,
    category: 'music',
    title: 'Golden Hour Acoustic Chillout: Strings & Soul',
    tag: 'TERRACE VIBES',
    host: 'Featuring Cello & Guitar Duo Maya & Leon',
    date: 'FRIDAY, SEPT 26',
    time: '06:00 PM – 09:00 PM',
    location: 'Al Fresco Terrace Pergola',
    price: '₹200 / guest',
    includes: 'Table reserve + choice of botanical mocktail or specialty elixir',
    spotsLeft: 8,
    featured: false,
    image: ASSETS.sagePatioTerrace || 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=85',
    description:
      'Unwind as the sunset filters through our climbing jasmine pergolas with classical meets indie folk arrangements and shared mezze platters.',
  },
  {
    _id: 'evt-6',
    id: 6,
    category: 'coffee',
    title: 'Latte Art & Microfoam Calibration Lab',
    tag: 'INTENSIVE CLINIC',
    host: 'Senior Barista & Latte Art Champion Keith',
    date: 'SUNDAY, SEPT 28',
    time: '03:00 PM – 05:30 PM',
    location: 'Main Espresso Bar',
    price: '₹400 / guest',
    includes: 'Unlimited espresso extractions & milk pitcher toolkit',
    spotsLeft: 5,
    featured: false,
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=85',
    description:
      'Master milk steaming physics, milk pitcher ergonomics, and pour hearts, rosettas, and swans under hands-on expert coaching.',
  },
];

// Vuetify-style Skeleton Loader for Event Ticket Card
const EventCardSkeleton = () => (
  <div className="relative bg-white border border-stone-200/90 shadow-[0_15px_40px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col md:flex-row">
    {/* Left Image Shimmer (Banner) */}
    <div className="md:w-5/12 h-[260px] md:h-auto min-h-[260px] relative overflow-hidden bg-stone-200 flex-shrink-0">
      <div className="absolute inset-0 animate-shimmer" />
      <div className="absolute inset-0 flex items-center justify-center text-stone-300">
        <Camera className="w-8 h-8 opacity-40" />
      </div>

      {/* Category Badge Skeleton */}
      <div className="absolute top-4 left-4">
        <div className="h-5 w-24 rounded-full bg-stone-300/80 animate-shimmer" />
      </div>

      {/* Spots Remaining Pill Skeleton */}
      <div className="absolute bottom-4 left-4">
        <div className="h-6 w-28 rounded bg-black/30 backdrop-blur-sm animate-shimmer" />
      </div>
    </div>

    {/* Right Details & RSVP Ticket Actions Skeleton */}
    <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between space-y-4 bg-white">
      <div>
        {/* Date / Time */}
        <div className="flex items-center justify-between mb-3">
          <div className="h-3.5 w-28 rounded bg-stone-200 animate-shimmer" />
          <div className="h-3.5 w-20 rounded bg-stone-200 animate-shimmer" />
        </div>

        {/* Title Lines */}
        <div className="space-y-2 mb-2">
          <div className="h-6 w-11/12 rounded bg-stone-200 animate-shimmer" />
          <div className="h-6 w-3/4 rounded bg-stone-200 animate-shimmer" />
        </div>

        {/* Host Skeleton */}
        <div className="h-3 w-40 rounded bg-stone-200 animate-shimmer mt-2 mb-3" />

        {/* Description Lines */}
        <div className="space-y-1.5 mb-4">
          <div className="h-2.5 w-full rounded bg-stone-100 animate-shimmer" />
          <div className="h-2.5 w-full rounded bg-stone-100 animate-shimmer" />
          <div className="h-2.5 w-4/5 rounded bg-stone-100 animate-shimmer" />
        </div>

        {/* Location & Price Box Skeleton */}
        <div className="p-3 bg-stone-50 rounded border border-stone-200/60 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-stone-200 animate-shimmer shrink-0" />
            <div className="h-3 w-48 rounded bg-stone-200 animate-shimmer" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-stone-200 animate-shimmer shrink-0" />
            <div className="h-3 w-36 rounded bg-stone-200 animate-shimmer" />
          </div>
        </div>
      </div>

      {/* Book RSVP Button Skeleton */}
      <div className="pt-3 flex items-center justify-between border-t border-stone-100">
        <div className="h-3 w-20 rounded bg-stone-200 animate-shimmer" />
        <div className="h-10 w-36 rounded-md bg-stone-200 animate-shimmer" />
      </div>
    </div>
  </div>
);

// Individual Event Card with Image Load State & Smooth Fade-In
const EventCard = ({ evt, onReserve }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className="group relative bg-white border border-stone-200/90 shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_25px_60px_rgba(10,100,115,0.18)] transition-all duration-500 overflow-hidden flex flex-col md:flex-row"
    >
      {/* Left Photo & Date Badge */}
      <div className="md:w-5/12 h-[260px] md:h-auto min-h-[260px] relative overflow-hidden bg-stone-900 flex-shrink-0">
        {/* Shimmer skeleton while image loads */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-stone-200 flex items-center justify-center animate-shimmer">
            <Camera className="w-8 h-8 text-stone-400 opacity-50" />
          </div>
        )}

        <img
          src={evt.image}
          alt={evt.title}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover filter contrast-[1.05] brightness-[0.95] group-hover:scale-108 transition-all duration-700 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {/* Event Tag */}
        <div className="absolute top-4 left-4 z-10">
          <span
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
            className="px-3 py-1 bg-[#0A6473] text-[#F3D898] text-[9.5px] font-semibold tracking-[0.2em] uppercase rounded-full shadow"
          >
            {evt.tag}
          </span>
        </div>

        {/* Spots Remaining Pill */}
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/60 backdrop-blur-md text-white text-[10px] font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{evt.spotsLeft} SPOTS LEFT</span>
        </div>
      </div>

      {/* Right Details & RSVP Ticket Actions */}
      <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs font-mono text-stone-500 mb-1.5">
            <span className="text-[#0A6473] font-semibold">{evt.date}</span>
            <span>{evt.time}</span>
          </div>

          <h3
            style={{ fontFamily: '"Cormorant Garamond", "Italiana", serif' }}
            className="text-2xl sm:text-[26px] font-normal leading-tight uppercase text-[#1B365D] group-hover:text-[#0A6473] transition-colors"
          >
            {evt.title}
          </h3>

          <div className="text-xs text-stone-500 font-sans italic mt-1 mb-2">
            {evt.host}
          </div>

          <p
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
            className="text-stone-600 text-xs leading-relaxed font-light line-clamp-3 mb-3"
          >
            {evt.description}
          </p>

          <div className="p-2.5 bg-stone-50 rounded border border-stone-200/60 text-[11px] text-stone-600 space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3 text-[#0A6473] shrink-0" />
              <span className="truncate">{evt.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Ticket className="w-3 h-3 text-[#0A6473] shrink-0" />
              <span className="font-semibold text-[#1B365D]">{evt.price}</span>
              <span className="text-stone-400 truncate">({evt.includes})</span>
            </div>
          </div>
        </div>

        {/* Book RSVP Button */}
        <div className="pt-2 flex items-center justify-between border-t border-stone-100">
          <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase">
            PASS #{1000 + (evt.id || 1)}
          </span>

          <button
            type="button"
            onClick={() => onReserve(evt)}
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
            className="py-2.5 px-6 rounded bg-[#0A6473] text-white hover:bg-[#074752] transition-all font-semibold text-xs tracking-[0.16em] uppercase shadow-sm flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
          >
            <span>RESERVE PASS</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </motion.div>
  );
};

export const EventsPage = () => {
  const { openReserveModal } = useUIStore();
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  
  // Dynamic Events State from DB
  const [eventsList, setEventsList] = useState(INITIAL_CURATED_EVENTS);
  const [loadingEvents, setLoadingEvents] = useState(false);

  // Booking Modal State
  const [selectedEventForModal, setSelectedEventForModal] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingProcessing, setBookingProcessing] = useState(false);
  const [confirmedBookingDetails, setConfirmedBookingDetails] = useState(null);
  const [bookingError, setBookingError] = useState('');

  // Attendee Form State
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [attendeePhone, setAttendeePhone] = useState('');
  const [attendeeCount, setAttendeeCount] = useState(1);
  const [attendeeNotes, setAttendeeNotes] = useState('');

  // Interactive Razorpay Checkout Modal State
  const [razorpayModalOpen, setRazorpayModalOpen] = useState(false);
  const [razorpayOrderContext, setRazorpayOrderContext] = useState(null);
  const [selectedPayTab, setSelectedPayTab] = useState('upi'); // 'upi', 'card', 'netbanking', 'qr'
  const [upiIdInput, setUpiIdInput] = useState('');
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [razorpaySubmitting, setRazorpaySubmitting] = useState(false);

  // Private Event Calculator State
  const [eventType, setEventType] = useState('birthday');
  const [guestCount, setGuestCount] = useState(15);
  const [selectedSpace, setSelectedSpace] = useState('pergola');
  const [selectedAddons, setSelectedAddons] = useState(new Set(['coffee_bar', 'pastry_tower']));
  const [inquirySent, setInquirySent] = useState(false);

  // Load Events from Database
  const fetchLiveEvents = async () => {
    setLoadingEvents(true);
    try {
      const data = await getEvents();
      if (data && Array.isArray(data) && data.length > 0) {
        setEventsList(data);
      }
    } catch (err) {
      console.error('Failed to fetch events, using curated backup:', err);
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    fetchLiveEvents();
  }, []);

  // Event Categories
  const categories = [
    { id: 'all', label: 'ALL GATHERINGS', icon: Sparkles },
    { id: 'music', label: 'LIVE JAZZ & VINYL', icon: Music },
    { id: 'coffee', label: 'COFFEE WORKSHOPS', icon: Coffee },
    { id: 'bakery', label: 'BAKING MASTERCLASSES', icon: Utensils },
    { id: 'community', label: 'OPEN MIC & POETRY', icon: Mic2 },
  ];

  // Helper to extract numeric price from string
  const parseNumericPrice = (priceStr) => {
    if (!priceStr && priceStr !== 0) return 0;
    if (typeof priceStr === 'number') return priceStr;
    const clean = priceStr.toString().replace(/[^0-9.]/g, '');
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : num;
  };

  // Weekly Resident Schedule
  const weeklySchedule = [
    {
      day: 'WEDNESDAY',
      title: 'Acoustic Soul Sessions',
      time: '07:30 PM',
      space: 'The Library Nook',
      highlight: 'Live unamplified guitar & candlelit filter brews.',
    },
    {
      day: 'THURSDAY',
      title: 'Vinyl & Botanical Spritz Nights',
      time: '08:00 PM',
      space: 'Terrace Pergola',
      highlight: 'Rare analog soul, house spritzes & woodfired pizzas.',
    },
    {
      day: 'FRIDAY',
      title: 'Twilight Roastery Social',
      time: '06:30 PM',
      space: 'Main Roaster Bar',
      highlight: 'Chef tapas pairing with cold drip elixir tastings.',
    },
    {
      day: 'SATURDAY',
      title: 'Sunrise Origin Cupping Club',
      time: '09:00 AM',
      space: 'Cupping Lab',
      highlight: 'Freshly roasted Ethiopian, Colombian & Gesha flights.',
    },
    {
      day: 'SUNDAY',
      title: 'Hearth Bakery & Wild Sourdough Morning',
      time: '08:30 AM',
      space: 'Bakery Hearth',
      highlight: 'Fresh cardamom buns, croissants & sourdough loaves.',
    },
  ];

  const filteredEvents = activeFilter === 'all'
    ? eventsList
    : eventsList.filter((e) => e.category === activeFilter);

  // Private Event Pricing Calculation
  const calculateEstimate = () => {
    let base = 0;
    if (selectedSpace === 'pergola') base = 400;
    else if (selectedSpace === 'library') base = 300;
    else base = 500; // roastery salon

    let perGuest = eventType === 'birthday' ? 25 : eventType === 'workshop' ? 35 : 45;
    let addonsTotal = 0;
    if (selectedAddons.has('coffee_bar')) addonsTotal += 150;
    if (selectedAddons.has('pastry_tower')) addonsTotal += 120;
    if (selectedAddons.has('vinyl_dj')) addonsTotal += 200;
    if (selectedAddons.has('pizza_buffet')) addonsTotal += 220;

    return base + (guestCount * perGuest) + addonsTotal;
  };

  const toggleAddon = (addonKey) => {
    setSelectedAddons((prev) => {
      const next = new Set(prev);
      if (next.has(addonKey)) next.delete(addonKey);
      else next.add(addonKey);
      return next;
    });
  };

  // Open booking modal
  const handleOpenBookingModal = (evt) => {
    setSelectedEventForModal(evt);
    setBookingSuccess(false);
    setBookingError('');
    setConfirmedBookingDetails(null);
    setRazorpayModalOpen(false);
    if (!attendeeCount) setAttendeeCount(1);
  };

  // Razorpay Payment & Ticket Booking Handler
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEventForModal) return;

    setBookingProcessing(true);
    setBookingError('');

    const unitPrice = parseNumericPrice(selectedEventForModal.price);
    const totalAmount = unitPrice * attendeeCount;

    try {
      // 1. Initialize payment order in backend
      const orderRes = await createEventPaymentOrder({
        eventId: selectedEventForModal._id || selectedEventForModal.id,
        eventTitle: selectedEventForModal.title,
        eventDate: selectedEventForModal.date,
        eventTime: selectedEventForModal.time,
        ticketPrice: unitPrice,
        ticketsCount: attendeeCount,
        guestName: attendeeName.trim(),
        guestEmail: attendeeEmail.trim(),
        guestPhone: attendeePhone.trim(),
        specialRequests: attendeeNotes.trim(),
      });

      if (!orderRes.success) {
        throw new Error(orderRes.message || 'Failed to initialize payment.');
      }

      // Case A: Free Event ($0 / RSVP)
      if (orderRes.isFree || unitPrice === 0 || totalAmount === 0) {
        const verifyRes = await verifyEventPayment({
          eventId: selectedEventForModal._id || selectedEventForModal.id,
          eventTitle: selectedEventForModal.title,
          ticketsCount: attendeeCount,
          guestName: attendeeName.trim(),
          guestEmail: attendeeEmail.trim(),
          guestPhone: attendeePhone.trim(),
          specialRequests: attendeeNotes.trim(),
          razorpayOrderId: orderRes.orderId || `FREE_RSVP_${Date.now()}`,
          razorpayPaymentId: `free_pass_${Date.now()}`,
          razorpaySignature: 'free_event_signature',
          isFree: true,
        });

        if (verifyRes.success) {
          setConfirmedBookingDetails(verifyRes.booking);
          setBookingSuccess(true);
          fetchLiveEvents(); // Refresh remaining spots
        } else {
          throw new Error(verifyRes.message || 'Booking confirmation failed.');
        }
        setBookingProcessing(false);
        return;
      }

      // Case B: Paid Event - Launch Official Razorpay JS SDK if configured with live key
      if (orderRes.keyId && !orderRes.isSandbox && !orderRes.keyId.includes('simulated')) {
        const isScriptLoaded = await loadRazorpayScript();
        if (isScriptLoaded && window.Razorpay) {
          const options = {
            key: orderRes.keyId,
            amount: Math.round(totalAmount * 100),
            currency: orderRes.currency || 'INR',
            name: 'Sagē Café & Roastery',
            description: `Ticket Pass for "${selectedEventForModal.title}" (${attendeeCount} ${attendeeCount > 1 ? 'passes' : 'pass'})`,
            image: 'https://res.cloudinary.com/dmvxv9wjc/image/upload/v1726050000/sage-logo.png',
            order_id: orderRes.orderId,
            prefill: {
              name: attendeeName,
              email: attendeeEmail,
              contact: attendeePhone,
            },
            theme: {
              color: '#0A6473',
            },
            modal: {
              ondismiss: () => {
                setBookingProcessing(false);
              },
            },
            handler: async (response) => {
              try {
                const verifyRes = await verifyEventPayment({
                  eventId: selectedEventForModal._id || selectedEventForModal.id,
                  eventTitle: selectedEventForModal.title,
                  ticketsCount: attendeeCount,
                  guestName: attendeeName.trim(),
                  guestEmail: attendeeEmail.trim(),
                  guestPhone: attendeePhone.trim(),
                  specialRequests: attendeeNotes.trim(),
                  razorpayOrderId: response.razorpay_order_id || orderRes.orderId,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                  isFree: false,
                });

                if (verifyRes.success) {
                  setConfirmedBookingDetails(verifyRes.booking);
                  setBookingSuccess(true);
                  fetchLiveEvents();
                } else {
                  setBookingError(verifyRes.message || 'Payment verification failed.');
                }
              } catch (verErr) {
                setBookingError(verErr.message || 'Payment verification encountered an issue.');
              } finally {
                setBookingProcessing(false);
              }
            },
          };

          const razorpayInstance = new window.Razorpay(options);
          razorpayInstance.on('payment.failed', (failRes) => {
            setBookingError(`Payment failed: ${failRes.error.description || 'Transaction declined'}`);
            setBookingProcessing(false);
          });
          razorpayInstance.open();
          return;
        }
      }

      // Case C: Interactive Razorpay Checkout Modal (Authentic Payment Dialog with UPI/Card/NetBanking)
      setRazorpayOrderContext({
        orderId: orderRes.orderId || `order_rzp_${Date.now()}`,
        amount: totalAmount,
        currency: 'INR',
        eventTitle: selectedEventForModal.title,
        attendeeName,
        attendeeEmail,
        attendeePhone,
        attendeeCount,
        unitPrice,
      });
      setRazorpayModalOpen(true);
      setBookingProcessing(false);

    } catch (err) {
      console.error('Booking error:', err);
      setBookingError(err.message || 'Failed to initialize payment. Please try again.');
      setBookingProcessing(false);
    }
  };

  // Complete Payment in Razorpay Checkout Dialog
  const handleConfirmRazorpayPayment = async () => {
    if (!razorpayOrderContext || !selectedEventForModal) return;
    setRazorpaySubmitting(true);
    setBookingError('');

    try {
      // Simulate authentic payment gateway processing delay
      await new Promise((resolve) => setTimeout(resolve, 1400));

      const paymentMethodLabel = selectedPayTab === 'upi'
        ? `Razorpay UPI (${selectedUpiApp.toUpperCase()}${upiIdInput ? ` - ${upiIdInput}` : ''})`
        : selectedPayTab === 'card'
        ? `Razorpay Card (${cardDetails.number ? `Ending ${cardDetails.number.slice(-4)}` : 'Visa/Mastercard'})`
        : selectedPayTab === 'netbanking'
        ? `Razorpay NetBanking (${selectedBank})`
        : 'Razorpay UPI QR Code';

      const simPaymentId = `pay_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString().slice(-6)}`;

      const verifyRes = await verifyEventPayment({
        eventId: selectedEventForModal._id || selectedEventForModal.id,
        eventTitle: selectedEventForModal.title,
        ticketsCount: attendeeCount,
        guestName: attendeeName.trim(),
        guestEmail: attendeeEmail.trim(),
        guestPhone: attendeePhone.trim(),
        specialRequests: attendeeNotes.trim(),
        razorpayOrderId: razorpayOrderContext.orderId,
        razorpayPaymentId: simPaymentId,
        razorpaySignature: `sig_verified_${Date.now()}`,
        paymentMethod: paymentMethodLabel,
        isFree: false,
      });

      if (verifyRes.success) {
        setConfirmedBookingDetails(verifyRes.booking);
        setBookingSuccess(true);
        setRazorpayModalOpen(false);
        fetchLiveEvents(); // Refresh remaining spots in database
      } else {
        throw new Error(verifyRes.message || 'Payment verification failed.');
      }
    } catch (err) {
      console.error('Razorpay payment error:', err);
      setBookingError(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setRazorpaySubmitting(false);
      setBookingProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1B365D] selection:bg-[#F3D898] selection:text-[#0A6473]">

      {/* ========================================================================= */}
      {/* 1. HERO HEADER: FULL-SCREEN 100VH GATHERING BANNER                        */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-screen flex flex-col justify-between items-center text-center px-6 sm:px-10 pt-36 sm:pt-40 pb-12 overflow-hidden select-none bg-[#0A6473]">

        {/* Background Atmospheric Stage & Warm Roastery Lights */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=2400&q=85"
            alt="Sagē Live Gathering Atmosphere"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-[1.2]"
          />
          {/* Deep Teal Gradient & Warm Amber Radial Overlay */}
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

        {/* Central Content Box (Perfect Middle Alignment) */}
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
              GATHERINGS & RHYTHMS
            </h1>

            <span
              style={{ fontFamily: '"Caveat", "Covered By Your Grace", cursive' }}
              className="text-[#9BC49E] text-2xl sm:text-3xl md:text-5xl lg:text-[52px] -mt-2 sm:-mt-4 md:-mt-5 relative z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] font-medium"
            >
              where coffee, vinyl & people come alive
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
            LIVE ACOUSTIC SESSIONS, SPECIALTY CUPPING MASTERCLASSES, WILD-YEAST WORKSHOPS, AND CANDLELIT COMMUNITY NIGHTS.
          </motion.p>

          {/* Quick CTA Pill Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-8 flex items-center gap-4"
          >
            <a
              href="#upcoming-events"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              className="py-3 px-7 rounded-full bg-[#F3D898] text-[#0A6473] hover:bg-white transition-all font-semibold text-xs tracking-[0.18em] uppercase shadow-lg flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <span>EXPLORE UPCOMING PASSES</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </motion.div>

        </div>

        {/* Quick Highlights Ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="relative z-10 w-full max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/15 text-white text-center"
        >
          <div>
            <div className="text-xl sm:text-2xl font-serif text-[#F3D898]">WEEKLY</div>
            <div className="text-[10px] sm:text-[11px] tracking-widest uppercase text-white/75 font-sans">Resident Vinyl Nights</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-serif text-[#F3D898]">MONTHLY</div>
            <div className="text-[10px] sm:text-[11px] tracking-widest uppercase text-white/75 font-sans">Sensory Cupping Labs</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-serif text-[#F3D898]">50 MAX</div>
            <div className="text-[10px] sm:text-[11px] tracking-widest uppercase text-white/75 font-sans">Intimate Salon Seating</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-serif text-[#F3D898]">HANDS-ON</div>
            <div className="text-[10px] sm:text-[11px] tracking-widest uppercase text-white/75 font-sans">Master Baker Workshops</div>
          </div>
        </motion.div>

      </section>


      {/* ========================================================================= */}
      {/* 2. WEEKLY RESIDENT CALENDAR DECK (DAY-BY-DAY INTERACTIVE RIBBON)           */}
      {/* ========================================================================= */}
      <section className="relative w-full py-16 sm:py-20 px-6 sm:px-12 bg-white border-b border-stone-200/80 select-none">
        <div className="max-w-[1400px] mx-auto">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                className="text-xs sm:text-sm font-semibold tracking-[0.26em] uppercase text-[#7A6455] block mb-2"
              >
                WEEKLY RESIDENCY
              </span>
              <h2
                style={{ fontFamily: '"Cormorant Garamond", "Italiana", serif' }}
                className="text-3xl sm:text-4xl md:text-5xl font-normal uppercase tracking-[0.03em] text-[#1B365D]"
              >
                THE WEEK AT SAGĒ
              </h2>
            </div>
            <p
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              className="text-stone-500 text-xs sm:text-sm max-w-md leading-relaxed"
            >
              Every day brings its own special rhythm. Click a day below to explore our scheduled resident gatherings.
            </p>
          </div>

          {/* Day Selector Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
            {weeklySchedule.map((sched, idx) => {
              const isSelected = selectedDayIndex === idx;
              return (
                <button
                  key={sched.day}
                  type="button"
                  onClick={() => setSelectedDayIndex(idx)}
                  className={`p-4 sm:p-5 text-left border transition-all duration-300 cursor-pointer ${isSelected
                    ? 'bg-[#0A6473] text-white border-[#0A6473] shadow-lg scale-[1.02]'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-[#0A6473]/50 hover:bg-white'
                    }`}
                >
                  <div className={`text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] uppercase mb-1 ${isSelected ? 'text-[#F3D898]' : 'text-[#7A6455]'}`}>
                    {sched.day}
                  </div>
                  <div className="text-base sm:text-lg font-serif font-normal leading-snug line-clamp-1">
                    {sched.title}
                  </div>
                  <div className={`text-xs mt-2 font-mono ${isSelected ? 'text-white/80' : 'text-stone-500'}`}>
                    {sched.time}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Day Showcase Box */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDayIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="p-6 sm:p-8 md:p-10 bg-[#FAF7F2] border border-stone-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-[#0A6473] uppercase">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{weeklySchedule[selectedDayIndex].day} • {weeklySchedule[selectedDayIndex].time}</span>
                  <span>•</span>
                  <span>{weeklySchedule[selectedDayIndex].space}</span>
                </div>
                <h3
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  className="text-2xl sm:text-3xl md:text-4xl font-normal uppercase text-[#1B365D]"
                >
                  {weeklySchedule[selectedDayIndex].title}
                </h3>
                <p
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                  className="text-stone-600 text-sm max-w-2xl leading-relaxed"
                >
                  {weeklySchedule[selectedDayIndex].highlight}
                </p>
              </div>

              <Link
                to="/reservation"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                className="py-3 px-6 rounded bg-[#0A6473] text-white hover:bg-[#074752] transition-all font-semibold text-xs tracking-[0.16em] uppercase shadow-md cursor-pointer flex-shrink-0 flex items-center gap-2"
              >
                <span>RESERVE FOR {weeklySchedule[selectedDayIndex].day}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </AnimatePresence>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 3. UPCOMING SPECIAL EVENTS: LUXURY "TICKET PASS" CARD GRID                */}
      {/* ========================================================================= */}
      <section id="upcoming-events" className="relative w-full py-20 sm:py-28 px-4 sm:px-8 md:px-12 lg:px-16 max-w-[1440px] mx-auto select-none">

        <div className="text-center max-w-3xl mx-auto mb-16">
          <span
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
            className="text-xs sm:text-sm font-semibold tracking-[0.26em] uppercase text-[#7A6455] block mb-3"
          >
            LIMITED SEATING PASSES
          </span>
          <h2
            style={{ fontFamily: '"Cormorant Garamond", "Italiana", serif' }}
            className="text-4xl sm:text-5xl md:text-6xl font-normal uppercase tracking-[0.03em] text-[#1B365D] leading-tight"
          >
            CURATED SPECIAL EVENTS
          </h2>
          <p
            style={{ fontFamily: '"Caveat", cursive' }}
            className="text-[#7FA382] text-2xl sm:text-3xl font-medium mt-1 mb-6"
          >
            reserve your ticket pass before spots fill
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold tracking-[0.16em] uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer ${isActive
                    ? 'bg-[#0A6473] text-white shadow-md shadow-[#0A6473]/20 scale-105'
                    : 'bg-white text-stone-600 hover:text-[#0A6473] hover:bg-stone-100 border border-stone-200'
                    }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#F3D898]' : 'text-stone-400'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Events Ticket Stub Grid (Unique Boarding Pass Style) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
          {loadingEvents ? (
            [...Array(4)].map((_, i) => <EventCardSkeleton key={i} />)
          ) : filteredEvents.length === 0 ? (
            <div className="col-span-1 lg:col-span-2 text-center py-16 bg-stone-50 border border-dashed border-stone-200 rounded-xl">
              <Sparkles className="w-8 h-8 text-[#0A6473] mx-auto mb-3 opacity-60" />
              <p className="font-serif text-xl text-stone-700">No events found in this category.</p>
              <p className="text-stone-500 text-xs mt-1">Please select another category or check back later!</p>
            </div>
          ) : (
            filteredEvents.map((evt) => (
              <EventCard
                key={evt._id || evt.id}
                evt={evt}
                onReserve={setSelectedEventForModal}
              />
            ))
          )}
        </div>

      </section>


      {/* ========================================================================= */}
      {/* 4. INNOVATIVE "HOST YOUR PRIVATE GATHERING" CALCULATOR                    */}
      {/* ========================================================================= */}
      <section className="relative w-full py-20 sm:py-28 px-6 sm:px-12 bg-white border-y border-stone-200/80 select-none overflow-hidden">
        <div className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Heading & Interactive Controls */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <span
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                className="text-xs sm:text-sm font-semibold tracking-[0.26em] uppercase text-[#7A6455] block mb-2"
              >
                CUSTOM OCCASIONS
              </span>
              <h2
                style={{ fontFamily: '"Cormorant Garamond", "Italiana", serif' }}
                className="text-3xl sm:text-4xl md:text-5xl font-normal uppercase tracking-[0.03em] text-[#1B365D]"
              >
                HOST A PRIVATE SALON
              </h2>
              <p
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                className="text-stone-600 text-sm leading-relaxed mt-2"
              >
                Customize your birthday dinner, corporate coffee cupping, or private book club under the terrace pergola.
              </p>
            </div>

            {/* 1. Select Gathering Type */}
            <div>
              <label className="text-xs font-semibold tracking-wider text-[#1B365D] uppercase block mb-2">
                1. Occasion Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'birthday', label: 'Celebration' },
                  { id: 'workshop', label: 'Masterclass' },
                  { id: 'dinner', label: 'Private Dinner' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setEventType(item.id)}
                    className={`py-2.5 px-3 text-xs font-semibold tracking-wider uppercase border transition-all ${eventType === item.id
                      ? 'bg-[#0A6473] text-white border-[#0A6473] shadow-sm'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Guest Count Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-[#1B365D] uppercase mb-2">
                <span>2. Estimated Guests</span>
                <span className="text-[#0A6473] font-mono text-sm font-bold">{guestCount} Guests</span>
              </div>
              <input
                type="range"
                min="4"
                max="45"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#0A6473]"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-mono mt-1">
                <span>Intimate (4)</span>
                <span>Salon (20)</span>
                <span>Full House (45)</span>
              </div>
            </div>

            {/* 3. Space Selection */}
            <div>
              <label className="text-xs font-semibold tracking-wider text-[#1B365D] uppercase block mb-2">
                3. Preferred Space
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'pergola', label: 'Terrace Pergola' },
                  { id: 'library', label: 'Library Salon' },
                  { id: 'roastery', label: 'Roaster Lounge' },
                ].map((sp) => (
                  <button
                    key={sp.id}
                    type="button"
                    onClick={() => setSelectedSpace(sp.id)}
                    className={`py-2.5 px-3 text-xs font-semibold tracking-wider uppercase border transition-all ${selectedSpace === sp.id
                      ? 'bg-[#0A6473] text-white border-[#0A6473] shadow-sm'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                  >
                    {sp.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Add-on Experiences */}
            <div>
              <label className="text-xs font-semibold tracking-wider text-[#1B365D] uppercase block mb-2">
                4. Included Experiences & Add-ons
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'coffee_bar', label: 'Specialty Coffee Bar', price: '+$150' },
                  { id: 'pastry_tower', label: 'Hearth Pastry Tower', price: '+$120' },
                  { id: 'vinyl_dj', label: 'Live Vinyl DJ Set', price: '+$200' },
                  { id: 'pizza_buffet', label: 'Sourdough Pizza Buffet', price: '+$220' },
                ].map((add) => {
                  const isChecked = selectedAddons.has(add.id);
                  return (
                    <button
                      key={add.id}
                      type="button"
                      onClick={() => toggleAddon(add.id)}
                      className={`p-2.5 text-xs text-left border flex items-center justify-between transition-all ${isChecked
                        ? 'bg-[#0A6473]/10 border-[#0A6473] text-[#0A6473] font-semibold'
                        : 'bg-stone-50 border-stone-200 text-stone-600'
                        }`}
                    >
                      <span>{add.label}</span>
                      <span className="font-mono text-[11px] text-stone-500">{add.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Live Estimate Quotation Card */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-lg bg-[#FAF7F2] p-8 sm:p-10 border border-stone-300 shadow-[0_25px_60px_rgba(27,54,93,0.12)]">

              <div className="flex items-center justify-between border-b border-stone-300 pb-4 mb-6">
                <div>
                  <div className="text-[10px] font-mono tracking-widest uppercase text-stone-400">ESTIMATE RECEIPT</div>
                  <div className="text-xl font-serif font-normal text-[#1B365D] uppercase">SAGĒ PRIVATE OCCASION</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#0A6473]/10 flex items-center justify-center text-[#0A6473]">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-3 text-xs text-stone-600 pb-6 border-b border-stone-200 font-sans">
                <div className="flex justify-between">
                  <span>Occasion Type:</span>
                  <span className="font-semibold uppercase text-[#1B365D]">{eventType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Guest Count:</span>
                  <span className="font-semibold text-[#1B365D]">{guestCount} Guests</span>
                </div>
                <div className="flex justify-between">
                  <span>Reserved Space:</span>
                  <span className="font-semibold uppercase text-[#1B365D]">{selectedSpace}</span>
                </div>
                <div className="flex justify-between">
                  <span>Add-ons Selected:</span>
                  <span className="font-semibold text-[#1B365D]">{selectedAddons.size} Options</span>
                </div>
              </div>

              {/* Total Estimated Price */}
              <div className="py-6 flex items-baseline justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold">Estimated Package</div>
                  <div className="text-[10px] text-stone-400">Includes private staffing & tableware</div>
                </div>
                <div className="text-3xl sm:text-4xl font-serif font-normal text-[#0A6473]">
                  ${calculateEstimate()}
                </div>
              </div>

              {/* Inquiry Action */}
              {inquirySent ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded text-center font-medium flex items-center justify-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Inquiry sent to Sagē Events Team! We will email you within 24h.</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setInquirySent(true)}
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                  className="w-full py-3.5 rounded bg-[#0A6473] hover:bg-[#074752] text-white font-semibold text-xs tracking-[0.16em] uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>SUBMIT INQUIRY FOR THIS PACKAGE</span>
                </button>
              )}

              <p className="text-[10px] text-stone-400 text-center mt-3 font-mono">
                No deposit charged today • Custom menus available upon request
              </p>

            </div>
          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 5. WHITE 2-COLUMN BOTTOM EDITORIAL BANNER BEFORE FOOTER                   */}
      {/* ========================================================================= */}
      <section className="relative w-full py-20 sm:py-28 px-6 sm:px-12 md:px-16 lg:px-24 bg-white text-[#1B365D] select-none overflow-hidden">
        <div className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6 sm:space-y-8">
            <span
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              className="text-xs sm:text-sm font-semibold tracking-[0.26em] uppercase text-[#7A6455] block"
            >
              EXPERIENCE SAGĒ
            </span>

            <div className="space-y-1">
              <h2
                style={{ fontFamily: '"Cormorant Garamond", "Italiana", "Belleza", serif' }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-normal tracking-[0.03em] uppercase leading-[1.08] text-[#1B365D]"
              >
                JOIN OUR NEXT GATHERING
              </h2>
              <span
                style={{ fontFamily: '"Caveat", "Covered By Your Grace", cursive' }}
                className="text-[#7FA382] text-xl sm:text-2xl md:text-3xl font-medium block"
              >
                music, coffee & good company
              </span>
            </div>

            <p
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              className="text-stone-600 text-sm sm:text-[15px] leading-relaxed font-normal"
            >
              Whether you're dropping in for Thursday jazz, tasting single-origin microlots on Saturday, or reserving a private birthday dinner, our tables are ready to welcome you.
            </p>

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
          </div>

          {/* Right Column: Editorial Framed Photo */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[720px] xl:max-w-[760px] h-[440px] sm:h-[520px] md:h-[580px] lg:h-[620px] flex items-center justify-center overflow-hidden shadow-[0_25px_60px_rgba(27,54,93,0.18)] select-none">

              <div className="absolute inset-0 w-full h-full">
                <img
                  src={ASSETS.image2}
                  alt="Sagē Events Atmosphere"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover filter brightness-[0.98] contrast-[1.02]"
                />
              </div>

              <div className="relative z-10 w-[80%] h-[78%] overflow-hidden shadow-[0_20px_45px_rgba(0,0,0,0.35)] border border-white/60">
                <img
                  src={ASSETS.image2}
                  alt="Sagē Live Event"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute bottom-3 inset-x-0 flex items-center justify-center text-center px-4 pointer-events-none z-20">
                <p
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                  className="text-[9.5px] sm:text-[10.5px] tracking-[0.24em] uppercase text-white/95 font-medium drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)] text-center leading-none"
                >
                  LIVE RHYTHMS / VINYL SESSIONS / THE HEARTH AT SAGĒ
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 6. INTERACTIVE TICKET PASS RSVP & RAZORPAY CHECKOUT MODAL                 */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedEventForModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !bookingProcessing && setSelectedEventForModal(null)}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full max-h-[90vh] flex flex-col bg-[#FAF7F2] border border-stone-300 shadow-[0_30px_90px_rgba(0,0,0,0.6)] overflow-hidden my-auto"
            >
              {/* Top Header */}
              <div className="bg-[#0A6473] text-white px-5 py-4 sm:px-6 sm:py-4.5 flex items-center justify-between shrink-0 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#F3D898] flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5" />
                    <span>OFFICIAL EVENT PASS &bull; SAGĒ GATHERINGS</span>
                  </span>
                  <h3
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                    className="text-xl sm:text-2xl font-normal uppercase text-white leading-tight mt-0.5 truncate max-w-[280px] sm:max-w-md"
                  >
                    {selectedEventForModal.title}
                  </h3>
                </div>

                {!bookingProcessing && (
                  <button
                    type="button"
                    onClick={() => setSelectedEventForModal(null)}
                    className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Verified Pass Success Screen */}
              {bookingSuccess ? (
                <div className="p-4 sm:p-6 space-y-3.5 overflow-y-auto flex-1">
                  <div className="text-center space-y-1.5">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-inner">
                      <Check className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono tracking-widest text-emerald-700 font-bold uppercase block">
                      PAYMENT &amp; PASS VERIFIED
                    </span>
                    <h4
                      style={{ fontFamily: '"Cormorant Garamond", serif' }}
                      className="text-2xl font-normal text-[#1B365D] uppercase"
                    >
                      Ticket Confirmed!
                    </h4>
                    <p className="text-[11px] text-stone-600 max-w-sm mx-auto leading-relaxed">
                      Your admission pass has been registered in the master guest list. A branded ticket receipt has been sent to <strong>{attendeeEmail || confirmedBookingDetails?.guestEmail}</strong>.
                    </p>
                  </div>

                  {/* Boarding Pass Ticket Stub Card */}
                  <div className="bg-white border-2 border-dashed border-stone-300 rounded-2xl p-4 shadow-xs space-y-2.5 font-sans text-xs">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                      <div>
                        <span className="text-[9px] font-mono text-stone-400 block uppercase">Booking Reference</span>
                        <span className="text-xs font-mono font-bold text-[#0A6473]">
                          {confirmedBookingDetails?.bookingId || `TKT-${Math.floor(100000 + Math.random() * 900000)}`}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-mono text-stone-400 block uppercase">Razorpay Payment ID</span>
                        <span className="text-[10px] font-mono font-semibold text-slate-700">
                          {confirmedBookingDetails?.razorpayPaymentId || 'pay_verified_instant'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-stone-400 text-[9px] block uppercase font-mono">GUEST NAME</span>
                        <span className="font-bold text-[#1B365D] block truncate">{attendeeName || confirmedBookingDetails?.guestName}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[9px] block uppercase font-mono">ADMISSION</span>
                        <span className="font-bold text-[#0A6473] block">
                          {attendeeCount || confirmedBookingDetails?.ticketsCount} {attendeeCount > 1 ? 'Guests' : 'Guest'}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[9px] block uppercase font-mono">DATE &amp; TIME</span>
                        <span className="font-semibold text-stone-800 block truncate">{selectedEventForModal.date} &bull; {selectedEventForModal.time}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[9px] block uppercase font-mono">VENUE</span>
                        <span className="font-semibold text-stone-800 block truncate">{selectedEventForModal.location}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-stone-500 font-medium text-xs">Total Paid:</span>
                      <span className="text-sm font-bold text-emerald-700">
                        ₹{confirmedBookingDetails?.totalAmount ?? (parseNumericPrice(selectedEventForModal.price) * attendeeCount)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="flex-1 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Pass Slip</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setBookingSuccess(false);
                        setSelectedEventForModal(null);
                        setAttendeeName('');
                        setAttendeeEmail('');
                        setAttendeePhone('');
                        setAttendeeNotes('');
                        setConfirmedBookingDetails(null);
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-[#0A6473] hover:bg-[#074752] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all"
                    >
                      <span>Done</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Ticket Pass Booking & Payment Form */
                <form onSubmit={handleBookingSubmit} className="p-4 sm:p-6 space-y-3 overflow-y-auto flex-1">
                  
                  {/* Event Snapshot Card */}
                  <div className="grid grid-cols-2 gap-2.5 text-xs bg-white p-3 border border-stone-200/90 rounded-xl">
                    <div>
                      <span className="text-stone-400 block text-[9px] font-mono uppercase">DATE &amp; TIME</span>
                      <span className="font-semibold text-[#0A6473] text-[11px] block truncate">{selectedEventForModal.date}</span>
                      <span className="block text-[10px] text-stone-500">{selectedEventForModal.time}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[9px] font-mono uppercase">TICKET PRICE</span>
                      <span className="font-semibold text-[#1B365D] text-xs block">{selectedEventForModal.price}</span>
                      <span className="block text-[9px] text-emerald-600 font-medium">
                        {selectedEventForModal.spotsLeft} spots available
                      </span>
                    </div>
                  </div>

                  {/* Error Alert */}
                  {bookingError && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                      <X className="w-3.5 h-3.5 shrink-0" />
                      <span>{bookingError}</span>
                    </div>
                  )}

                  {/* Attendee Name */}
                  <div>
                    <label className="text-xs font-semibold text-[#1B365D] uppercase block mb-1">
                      Guest Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={attendeeName}
                        onChange={(e) => setAttendeeName(e.target.value)}
                        placeholder="e.g. Vivang Mishra"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-stone-300 text-xs rounded-xl text-stone-800 focus:outline-none focus:border-[#0A6473]"
                      />
                    </div>
                  </div>

                  {/* Email & Phone Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#1B365D] uppercase block mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={attendeeEmail}
                          onChange={(e) => setAttendeeEmail(e.target.value)}
                          placeholder="guest@example.com"
                          className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-stone-300 text-xs rounded-xl text-stone-800 focus:outline-none focus:border-[#0A6473]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#1B365D] uppercase block mb-1">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          value={attendeePhone}
                          onChange={(e) => setAttendeePhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-stone-300 text-xs rounded-xl text-stone-800 focus:outline-none focus:border-[#0A6473]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Summary */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#1B365D] uppercase block mb-1">
                        Number of Passes
                      </label>
                      <select
                        value={attendeeCount}
                        onChange={(e) => setAttendeeCount(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 bg-white border border-stone-300 text-xs rounded-xl text-stone-800 focus:outline-none focus:border-[#0A6473]"
                      >
                        {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Pass (1 Guest)' : `Passes (${num} Guests)`}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Calculated Total Due */}
                    <div className="bg-white border border-stone-200 p-2.5 rounded-xl flex flex-col justify-center">
                      <span className="text-[10px] font-mono uppercase text-stone-400">TOTAL PAYABLE</span>
                      <span className="text-lg font-bold text-[#0A6473]">
                        ₹{parseNumericPrice(selectedEventForModal.price) * attendeeCount}
                      </span>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label className="text-xs font-semibold text-[#1B365D] uppercase block mb-1">
                      Dietary / Seating Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={attendeeNotes}
                      onChange={(e) => setAttendeeNotes(e.target.value)}
                      placeholder="e.g. Vegetarian only, front row seating preferred"
                      className="w-full px-3.5 py-2 bg-white border border-stone-300 text-xs rounded-xl text-stone-800 focus:outline-none focus:border-[#0A6473]"
                    />
                  </div>

                  {/* Razorpay Trust Badge */}
                  <div className="p-3 bg-stone-100/80 rounded-xl border border-stone-200 flex items-center justify-between text-[11px] text-stone-600">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Instant Confirmation via Razorpay (UPI &bull; Cards &bull; NetBanking)</span>
                    </div>
                    <CreditCard className="w-4 h-4 text-stone-400 shrink-0" />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={bookingProcessing}
                    style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                    className="w-full py-3.5 rounded-xl bg-[#0A6473] hover:bg-[#074752] text-white font-semibold text-xs tracking-[0.18em] uppercase transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 active:scale-98"
                  >
                    {bookingProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#F3D898]" />
                        <span>INITIALIZING SECURE CHECKOUT...</span>
                      </>
                    ) : (
                      <>
                        <span>PAY &bull; ₹{parseNumericPrice(selectedEventForModal.price) * attendeeCount} &amp; GET EVENT PASS</span>
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 9. INTERACTIVE RAZORPAY SECURE CHECKOUT MODAL DIALOG                     */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {razorpayModalOpen && razorpayOrderContext && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (!razorpaySubmitting) setRazorpayModalOpen(false);
            }}
            className="fixed inset-0 z-[100000] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full max-h-[90vh] flex flex-col bg-[#FAF7F2] border border-stone-300 shadow-[0_30px_90px_rgba(0,0,0,0.6)] overflow-hidden my-auto text-[#1B365D]"
            >
              {/* Top Header Matching First Modal */}
              <div className="bg-[#0A6473] text-white px-5 py-4 sm:px-6 sm:py-4.5 flex items-center justify-between shrink-0 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#F3D898] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>RAZORPAY SECURE CHECKOUT &bull; SAGĒ GATHERINGS</span>
                  </span>
                  <h3
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                    className="text-xl sm:text-2xl font-normal uppercase text-white leading-tight mt-0.5 truncate max-w-[280px] sm:max-w-md"
                  >
                    Payment &bull; ₹{razorpayOrderContext.amount}
                  </h3>
                </div>

                {!razorpaySubmitting && (
                  <button
                    type="button"
                    onClick={() => setRazorpayModalOpen(false)}
                    className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Modal Body Matching First Card */}
              <div className="p-4 sm:p-6 space-y-3 overflow-y-auto flex-1">
                
                {/* Event & Pass Snapshot Card */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3.5 border border-stone-200/90 rounded-xl">
                  <div>
                    <span className="text-stone-400 block text-[10px] font-mono uppercase">EVENT GATHERING</span>
                    <span className="font-semibold text-[#0A6473] truncate block">{razorpayOrderContext.eventTitle}</span>
                    <span className="block text-[11px] text-stone-500 font-mono">Order #{razorpayOrderContext.orderId.slice(-6).toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] font-mono uppercase">TOTAL AMOUNT DUE</span>
                    <span className="font-semibold text-[#1B365D] text-sm">₹{razorpayOrderContext.amount}</span>
                    <span className="block text-[10px] text-emerald-600 font-medium">
                      {razorpayOrderContext.attendeeCount} {razorpayOrderContext.attendeeCount > 1 ? 'Passes' : 'Pass'} &bull; 256-Bit SSL Secured
                    </span>
                  </div>
                </div>

                {/* Error Alert if any */}
                {bookingError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                    <X className="w-4 h-4 shrink-0" />
                    <span>{bookingError}</span>
                  </div>
                )}

                {/* Method Selector Segmented Tabs */}
                <div>
                  <label className="text-xs font-semibold text-[#1B365D] uppercase block mb-1.5">
                    Select Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'upi', label: 'UPI / QR CODE', icon: Smartphone },
                      { id: 'card', label: 'DEBIT / CREDIT CARD', icon: CreditCard },
                      { id: 'netbanking', label: 'NET BANKING', icon: Building },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isActive = selectedPayTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setSelectedPayTab(tab.id)}
                          className={`py-2.5 px-2 rounded-xl text-center text-xs transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                            isActive
                              ? 'bg-[#0A6473] text-white font-bold shadow-xs border border-[#0A6473]'
                              : 'bg-white text-stone-600 border border-stone-300 hover:bg-stone-50'
                          }`}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <span className="text-[10px] tracking-tight font-mono">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tab 1: UPI & QR Code */}
                {selectedPayTab === 'upi' && (
                  <div className="space-y-3 bg-white p-4 rounded-xl border border-stone-200">
                    <label className="text-xs font-semibold text-[#1B365D] uppercase block font-sans">
                      Select UPI Application:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'gpay', name: 'Google Pay' },
                        { id: 'phonepe', name: 'PhonePe' },
                        { id: 'paytm', name: 'Paytm UPI' },
                        { id: 'bhim', name: 'BHIM / Any UPI' },
                      ].map((app) => (
                        <button
                          key={app.id}
                          type="button"
                          onClick={() => {
                            setSelectedUpiApp(app.id);
                            if (!upiIdInput) {
                              setUpiIdInput(`${(attendeeName || 'guest').toLowerCase().replace(/\s+/g, '')}@${app.id === 'gpay' ? 'okhdfcbank' : app.id === 'phonepe' ? 'ybl' : 'paytm'}`);
                            }
                          }}
                          className={`p-2 rounded-xl border text-center transition-all cursor-pointer text-xs ${
                            selectedUpiApp === app.id
                              ? 'bg-[#FAF7F2] border-[#0A6473] text-[#0A6473] font-bold ring-1 ring-[#0A6473]'
                              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          {app.name}
                        </button>
                      ))}
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-stone-600 uppercase block mb-1">
                        Or Enter UPI ID / VPA:
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="e.g. mobile@upi or name@okhdfcbank"
                          value={upiIdInput}
                          onChange={(e) => setUpiIdInput(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-stone-300 text-xs rounded-xl text-stone-800 focus:outline-none focus:border-[#0A6473] font-mono"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          VERIFIED
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs text-stone-600">
                      <div className="flex items-center gap-3">
                        <QrCode className="w-8 h-8 text-[#0A6473]" />
                        <div>
                          <span className="font-bold text-[#1B365D] block">Scan QR Code via PhonePe / GPay</span>
                          <span className="text-[10px] text-stone-500">Auto-detects payment in real time</span>
                        </div>
                      </div>
                      <span className="font-bold text-[#0A6473] text-sm">₹{razorpayOrderContext.amount}</span>
                    </div>
                  </div>
                )}

                {/* Tab 2: Debit / Credit Card */}
                {selectedPayTab === 'card' && (
                  <div className="space-y-3 bg-white p-4 rounded-xl border border-stone-200">
                    <div>
                      <label className="text-xs font-semibold text-[#1B365D] uppercase block mb-1">
                        Card Number *
                      </label>
                      <div className="relative">
                        <CreditCard className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          maxLength={19}
                          placeholder="4532 •••• •••• 8901"
                          value={cardDetails.number}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                            setCardDetails({ ...cardDetails, number: val });
                          }}
                          className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-stone-300 text-xs rounded-xl text-stone-800 focus:outline-none focus:border-[#0A6473] font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#1B365D] uppercase block mb-1">
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Vivang Mishra"
                        value={cardDetails.name || attendeeName}
                        onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-stone-300 text-xs rounded-xl text-stone-800 focus:outline-none focus:border-[#0A6473] uppercase"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-[#1B365D] uppercase block mb-1">
                          Expiry (MM/YY) *
                        </label>
                        <input
                          type="text"
                          maxLength={5}
                          placeholder="12/28"
                          value={cardDetails.expiry}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, '');
                            if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
                            setCardDetails({ ...cardDetails, expiry: val });
                          }}
                          className="w-full px-3.5 py-2.5 bg-white border border-stone-300 text-xs rounded-xl text-stone-800 focus:outline-none focus:border-[#0A6473] font-mono text-center"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-[#1B365D] uppercase block mb-1">
                          CVV / CVC *
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          placeholder="•••"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '') })}
                          className="w-full px-3.5 py-2.5 bg-white border border-stone-300 text-xs rounded-xl text-stone-800 focus:outline-none focus:border-[#0A6473] font-mono text-center"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 3: Net Banking */}
                {selectedPayTab === 'netbanking' && (
                  <div className="space-y-2.5 bg-white p-4 rounded-xl border border-stone-200">
                    <label className="text-xs font-semibold text-[#1B365D] uppercase block">
                      Choose Your Bank:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        'HDFC Bank',
                        'State Bank of India',
                        'ICICI Bank',
                        'Axis Bank',
                        'Kotak Mahindra Bank',
                        'Punjab National Bank',
                      ].map((bank) => (
                        <button
                          key={bank}
                          type="button"
                          onClick={() => setSelectedBank(bank)}
                          className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${
                            selectedBank === bank
                              ? 'bg-[#FAF7F2] border-[#0A6473] text-[#0A6473] font-bold'
                              : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                          }`}
                        >
                          <span className="truncate">{bank}</span>
                          {selectedBank === bank && (
                            <Check className="w-3.5 h-3.5 text-[#0A6473] shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Razorpay Trust Badge Matching First Card */}
                <div className="p-3 bg-stone-100/80 rounded-xl border border-stone-200 flex items-center justify-between text-[11px] text-stone-600">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>256-Bit SSL Encrypted Payment via Razorpay Gateway</span>
                  </div>
                  <CreditCard className="w-4 h-4 text-stone-400 shrink-0" />
                </div>

                {/* Submit Payment CTA Matching First Card */}
                <button
                  type="button"
                  disabled={razorpaySubmitting}
                  onClick={handleConfirmRazorpayPayment}
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                  className="w-full py-3.5 rounded-xl bg-[#0A6473] hover:bg-[#074752] text-white font-semibold text-xs tracking-[0.18em] uppercase transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 active:scale-98"
                >
                  {razorpaySubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#F3D898]" />
                      <span>AUTHORIZING PAYMENT WITH BANK...</span>
                    </>
                  ) : (
                    <>
                      <span>COMPLETE PAYMENT &bull; ₹{razorpayOrderContext.amount}</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default EventsPage;
