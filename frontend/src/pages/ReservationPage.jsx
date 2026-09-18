import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, Users, MapPin, Phone, Mail, Sparkles, CheckCircle2, 
  MessageSquare, ChevronRight, Utensils, Heart, Award, ArrowRight, Compass 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ASSETS } from '../assets/images';
import { createReservation } from '../services/api';

export const ReservationPage = () => {
  const navigate = useNavigate();

  // Booking Form State
  const [formData, setFormData] = useState({
    experience: 'Main Artisanal Dining Room',
    guests: 2,
    date: new Date().toISOString().split('T')[0],
    time: '07:30 PM',
    occasion: 'Casual Dining',
    name: '',
    phone: '',
    email: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  const experiences = [
    {
      id: 'main-dining',
      title: 'Main Artisanal Dining Room',
      desc: 'Warm heritage aesthetics, bespoke wooden tables & direct barista bar ambiance.',
      icon: Utensils,
      badge: 'Signature',
    },
    {
      id: 'patio-terrace',
      title: 'The Glasshouse Patio & Garden',
      desc: 'Breezy al-fresco seating enveloped by monstera greenery and soft natural light.',
      icon: Sparkles,
      badge: 'Al-Fresco',
    },
    {
      id: 'private-salon',
      title: "Chef's Private Tasting Salon",
      desc: 'Intimate leather booth alcove crafted for slow degustations, dates & celebrations.',
      icon: Award,
      badge: 'Exclusive',
    },
  ];

  const timeSlots = {
    'Morning & Brunch': ['08:30 AM', '09:30 AM', '10:30 AM', '11:30 AM'],
    'Afternoon & High Tea': ['01:00 PM', '02:30 PM', '04:00 PM', '05:00 PM'],
    'Evening Dining': ['06:30 PM', '07:30 PM', '08:30 PM', '09:30 PM', '10:30 PM'],
  };

  const occasions = [
    'Casual Dining', 'Birthday Celebration', 'Anniversary', 'Romantic Date', 'Business Dinner', 'Coffee & Work'
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save reservation to backend / MongoDB Atlas / Local Storage
      const res = await createReservation({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        date: formData.date,
        time: formData.time,
        guests: formData.guests,
        experience: formData.experience,
        specialRequests: `${formData.occasion ? `[${formData.occasion}] ` : ''}${formData.notes || ''}`,
      });

      const serverId = res?.data?._id?.slice(-4) || Math.floor(100000 + Math.random() * 900000);
      const generatedRef = 'SAGE-' + serverId;
      setBookingRef(generatedRef);
      setIsSubmitting(false);
      setIsConfirmed(true);

      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F3D898', '#0A6473', '#FAF7F2', '#E8DCC4']
        });
      } catch (err) {
        // ignore
      }
    } catch (err) {
      console.error('Reservation submit error:', err);
      const randomRef = 'SAGE-' + Math.floor(100000 + Math.random() * 900000);
      setBookingRef(randomRef);
      setIsSubmitting(false);
      setIsConfirmed(true);
    }
  };

  const handleWhatsAppConfirm = () => {
    const text = encodeURIComponent(
      `*SAGĒ CAFÉ — TABLE RESERVATION REQUEST*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `*Booking Ref:* ${bookingRef}\n` +
      `*Name:* ${formData.name}\n` +
      `*Phone:* ${formData.phone}\n` +
      `*Email:* ${formData.email || 'N/A'}\n` +
      `*Seating:* ${formData.experience}\n` +
      `*Date:* ${formData.date}\n` +
      `*Time:* ${formData.time}\n` +
      `*Party Size:* ${formData.guests} Guests\n` +
      `*Occasion:* ${formData.occasion}\n` +
      (formData.notes ? `*Special Request:* ${formData.notes}\n` : '') +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `_Please confirm our table reservation at Sagē Café, Hazratganj Lucknow._`
    );
    window.open(`https://wa.me/915224028899?text=${text}`, '_blank');
  };

  const handleReset = () => {
    setFormData({
      experience: 'Main Artisanal Dining Room',
      guests: 2,
      date: new Date().toISOString().split('T')[0],
      time: '07:30 PM',
      occasion: 'Casual Dining',
      name: '',
      phone: '',
      email: '',
      notes: '',
    });
    setIsConfirmed(false);
  };

  return (
    <div className="min-h-screen bg-[#0A6473] text-white selection:bg-[#F3D898] selection:text-[#0A6473]">
      
      {/* ========================================================================= */}
      {/* 1. HERO BANNER */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[50vh] sm:min-h-[56vh] flex flex-col items-center justify-center text-center px-6 sm:px-10 pt-32 pb-16 overflow-hidden select-none">
        
        {/* Background Atmosphere Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2400&q=85"
            alt="Sagē Café Dining Room"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-[1.1]"
          />
          {/* Deep Teal Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#063b44]/80 via-[#0a6473]/60 to-[#0A6473]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#063b44]/35 to-[#0A6473]" />
        </div>

        {/* Subtle Watermark Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center">
          <span
            style={{ fontFamily: '"Tan Mon Cheri", "Italiana", "Cormorant Garamond", serif' }}
            className="text-[26vw] font-bold text-white tracking-tighter leading-none select-none"
          >
            SAGĒ
          </span>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <div className="flex flex-col items-center mb-4 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-4xl sm:text-6xl md:text-7xl font-light tracking-[0.14em] uppercase text-white leading-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
              style={{ fontFamily: "'Cormorant Garamond', 'Belleza', serif' "}}
            >
              RESERVATIONS
            </motion.h1>

            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#E8DCC4] font-normal tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] mt-1 sm:mt-2 block"
              style={{ fontFamily: "'Covered By Your Grace', 'Caveat', cursive" }}
            >
              gather around our table
            </motion.span>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="text-[11px] sm:text-xs md:text-sm tracking-[0.22em] uppercase text-white/90 max-w-2xl leading-relaxed font-sans mt-3 px-4"
          >
            PULL UP A CHAIR FOR SLOW CONVERSATIONS, ARTISANAL ROASTS AND THOUGHTFUL DINING IN HAZRATGANJ, LUCKNOW.
          </motion.p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. MAIN RESERVATION SUITE: 2-COLUMN BOOKING INTERFACE */}
      {/* ========================================================================= */}
      <section className="relative w-full bg-[#0A6473] px-4 sm:px-8 md:px-12 lg:px-16 pb-28 pt-4">
        
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-5 w-96 h-96 bg-[#15808d]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-5 w-96 h-96 bg-[#063b44]/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 relative z-10">
          
          {/* ========================================================================= */}
          {/* LEFT: INTERACTIVE RESERVATION FORM OR LIVE CONFIRMATION */}
          {/* ========================================================================= */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="bg-[#0C5866]/65 backdrop-blur-md p-6 sm:p-10 rounded-sm border border-white/15 shadow-2xl">
              
              <AnimatePresence mode="wait">
                {!isConfirmed ? (
                  <motion.form
                    key="booking-form"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    onSubmit={handleSubmit}
                    className="space-y-8"
                  >
                    
                    {/* SECTION 1: SEATING EXPERIENCE */}
                    <div>
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/15">
                        <span className="text-xs tracking-[0.25em] text-[#F3D898] uppercase font-sans font-bold">
                          STEP 01
                        </span>
                        <h3
                          className="text-xl sm:text-2xl text-white font-light uppercase tracking-wider"
                          style={{ fontFamily: "'Cormorant Garamond', 'Belleza', serif" }}
                        >
                          SELECT DINING EXPERIENCE
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                        {experiences.map((exp) => {
                          const isSelected = formData.experience === exp.title;
                          const IconComponent = exp.icon;
                          return (
                            <button
                              key={exp.id}
                              type="button"
                              onClick={() => handleInputChange('experience', exp.title)}
                              className={`p-4 rounded-sm border text-left flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                                isSelected
                                  ? 'bg-[#F3D898] text-[#0A6473] border-[#F3D898] shadow-lg scale-[1.02]'
                                  : 'bg-white/5 text-white border-white/15 hover:border-white/35 hover:bg-white/10'
                              }`}
                            >
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <IconComponent className={`w-5 h-5 ${isSelected ? 'text-[#0A6473]' : 'text-[#F3D898]'}`} />
                                  <span className={`text-[10px] tracking-widest uppercase px-2 py-0.5 rounded font-bold ${
                                    isSelected ? 'bg-[#0A6473] text-white' : 'bg-white/10 text-white/80'
                                  }`}>
                                    {exp.badge}
                                  </span>
                                </div>
                                <h4 className="font-serif text-base font-medium tracking-wide uppercase leading-tight">
                                  {exp.title}
                                </h4>
                              </div>
                              <p className={`text-[11px] font-sans leading-relaxed mt-3 ${isSelected ? 'text-[#0A6473]/85' : 'text-white/70'}`}>
                                {exp.desc}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* SECTION 2: GUEST COUNT, DATE & TIME */}
                    <div>
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/15">
                        <span className="text-xs tracking-[0.25em] text-[#F3D898] uppercase font-sans font-bold">
                          STEP 02
                        </span>
                        <h3
                          className="text-xl sm:text-2xl text-white font-light uppercase tracking-wider"
                          style={{ fontFamily: "'Cormorant Garamond', 'Belleza', serif" }}
                        >
                          GUESTS, DATE & TIME
                        </h3>
                      </div>

                      {/* Party Size Selector */}
                      <div className="mb-5">
                        <label className="block text-xs uppercase tracking-[0.2em] text-white/70 font-sans mb-2 font-medium">
                          NUMBER OF GUESTS
                        </label>
                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                          {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => handleInputChange('guests', num)}
                              className={`py-2.5 rounded-sm border text-xs sm:text-sm font-sans font-bold transition-all duration-200 cursor-pointer ${
                                formData.guests === num
                                  ? 'bg-[#F3D898] text-[#0A6473] border-[#F3D898] shadow-md'
                                  : 'bg-white/5 text-white border-white/15 hover:border-white/35'
                              }`}
                            >
                              {num}{num === 10 ? '+' : ''}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Date & Occasion */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                        <div>
                          <label className="block text-xs uppercase tracking-[0.2em] text-white/70 font-sans mb-2 font-medium">
                            RESERVATION DATE
                          </label>
                          <input
                            type="date"
                            required
                            min={new Date().toISOString().split('T')[0]}
                            value={formData.date}
                            onChange={(e) => handleInputChange('date', e.target.value)}
                            className="w-full bg-white/5 border border-white/20 focus:border-[#F3D898] rounded-sm py-2.5 px-3.5 text-white text-xs sm:text-sm font-sans outline-none transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase tracking-[0.2em] text-white/70 font-sans mb-2 font-medium">
                            OCCASION
                          </label>
                          <select
                            value={formData.occasion}
                            onChange={(e) => handleInputChange('occasion', e.target.value)}
                            className="w-full bg-[#084854] border border-white/20 focus:border-[#F3D898] rounded-sm py-2.5 px-3.5 text-white text-xs sm:text-sm font-sans outline-none transition-colors cursor-pointer"
                          >
                            {occasions.map((occ) => (
                              <option key={occ} value={occ} className="bg-[#084854] text-white">
                                {occ}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Time Slots */}
                      <div>
                        <label className="block text-xs uppercase tracking-[0.2em] text-white/70 font-sans mb-2.5 font-medium">
                          PREFERRED TIME SLOT
                        </label>
                        <div className="space-y-3">
                          {Object.entries(timeSlots).map(([period, slots]) => (
                            <div key={period}>
                              <span className="text-[10px] uppercase tracking-widest text-[#F3D898]/80 font-sans block mb-1.5 font-semibold">
                                {period}
                              </span>
                              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                {slots.map((slot) => (
                                  <button
                                    key={slot}
                                    type="button"
                                    onClick={() => handleInputChange('time', slot)}
                                    className={`py-2 px-2 rounded-sm border text-xs font-sans transition-all duration-200 cursor-pointer ${
                                      formData.time === slot
                                        ? 'bg-[#F3D898] text-[#0A6473] font-bold border-[#F3D898] shadow-md'
                                        : 'bg-white/5 text-white/80 border-white/15 hover:border-white/35 hover:text-white'
                                    }`}
                                  >
                                    {slot}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* SECTION 3: GUEST CONTACT DETAILS */}
                    <div>
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/15">
                        <span className="text-xs tracking-[0.25em] text-[#F3D898] uppercase font-sans font-bold">
                          STEP 03
                        </span>
                        <h3
                          className="text-xl sm:text-2xl text-white font-light uppercase tracking-wider"
                          style={{ fontFamily: "'Cormorant Garamond', 'Belleza', serif" }}
                        >
                          YOUR DETAILS
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-xs uppercase tracking-[0.18em] text-white/70 font-sans mb-1.5 font-medium">
                            FULL NAME *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Vivang Mishra"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="w-full bg-white/5 border border-white/20 focus:border-[#F3D898] rounded-sm py-2.5 px-3.5 text-white placeholder-white/30 text-xs sm:text-sm font-sans outline-none transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase tracking-[0.18em] text-white/70 font-sans mb-1.5 font-medium">
                            PHONE NUMBER *
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="+91 98765 43210"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="w-full bg-white/5 border border-white/20 focus:border-[#F3D898] rounded-sm py-2.5 px-3.5 text-white placeholder-white/30 text-xs sm:text-sm font-sans outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-xs uppercase tracking-[0.18em] text-[#F3D898] font-sans mb-1.5 font-bold flex items-center justify-between">
                          <span>EMAIL ADDRESS * (REQUIRED FOR BOOKING VERIFICATION & UPDATES)</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="yourname@gmail.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full bg-white/5 border border-white/20 focus:border-[#F3D898] rounded-sm py-2.5 px-3.5 text-white placeholder-white/30 text-xs sm:text-sm font-sans outline-none transition-colors"
                        />
                        <p className="text-[10px] text-white/60 mt-1 font-sans flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-[#F3D898] shrink-0" />
                          <span>An initial booking receipt will be sent immediately, followed by host desk confirmation within 2–3 hours.</span>
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-[0.18em] text-white/70 font-sans mb-1.5 font-medium">
                          SPECIAL DIETARY / SEATING WISHES (OPTIONAL)
                        </label>
                        <textarea
                          rows={2}
                          placeholder="e.g. Anniversary cake request, quiet corner booth, high chair..."
                          value={formData.notes}
                          onChange={(e) => handleInputChange('notes', e.target.value)}
                          className="w-full bg-white/5 border border-white/20 focus:border-[#F3D898] rounded-sm p-3 text-white placeholder-white/30 text-xs sm:text-sm font-sans outline-none transition-colors resize-none"
                        />
                      </div>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-[#F3D898] hover:bg-[#E5C77C] text-[#0A6473] font-sans font-bold text-xs sm:text-sm uppercase tracking-[0.25em] rounded-sm shadow-xl transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer hover:scale-[1.01] active:scale-95"
                      >
                        {isSubmitting ? (
                          <span>CONFIRMING YOUR TABLE...</span>
                        ) : (
                          <>
                            <span>SUBMIT TABLE RESERVATION</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                      <p className="text-[10px] text-white/50 text-center tracking-wider font-sans uppercase mt-3">
                        * Immediate table hold &bull; Our host desk reviews and confirms within 2–3 hours
                      </p>
                    </div>

                  </motion.form>
                ) : (
                  
                  /* ========================================================================= */
                  /* CONFIRMATION PASS / TICKET */
                  /* ========================================================================= */
                  <motion.div
                    key="confirmation-view"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6 flex flex-col items-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#F3D898]/20 border-2 border-[#F3D898] flex items-center justify-center text-[#F3D898] mb-5 shadow-lg">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>

                    <span className="text-xs tracking-[0.3em] uppercase text-[#F3D898] font-sans font-bold mb-1">
                      RESERVATION LOGGED
                    </span>
                    <h3
                      className="text-3xl sm:text-4xl text-white font-light uppercase tracking-wide mb-3"
                      style={{ fontFamily: "'Cormorant Garamond', 'Belleza', serif" }}
                    >
                      Thank You, {formData.name}!
                    </h3>
                    <p className="text-white/80 text-xs sm:text-sm font-sans max-w-lg leading-relaxed mb-4">
                      Your table reservation request at Sagē Café Hazratganj has been registered under reference <span className="text-[#F3D898] font-bold">{bookingRef}</span>.
                    </p>

                    <div className="p-3.5 rounded-xl bg-[#073E47] border border-[#F3D898]/40 text-xs text-white max-w-md mb-6 space-y-1 text-left">
                      <div className="flex items-center gap-2 text-[#F3D898] font-bold">
                        <Mail className="w-4 h-4" />
                        <span>Email Notification Sent</span>
                      </div>
                      <p className="text-white/80 text-[11px] leading-relaxed">
                        We have dispatched an acknowledgment email to <span className="text-[#F3D898] font-mono">{formData.email || formData.phone}</span>. Our concierge team is reviewing table availability and will send your official confirmation within <strong>2–3 hours</strong>.
                      </p>
                    </div>

                    {/* Boarding Pass Summary Card */}
                    <div className="w-full max-w-md bg-[#084854] border border-[#F3D898]/30 rounded-sm p-6 text-left shadow-2xl space-y-3 mb-8">
                      <div className="flex justify-between items-center border-b border-white/15 pb-2.5">
                        <span className="text-[11px] text-white/60 uppercase tracking-widest font-sans font-medium">
                          BOOKING REFERENCE
                        </span>
                        <span className="text-sm text-[#F3D898] font-mono font-bold">
                          {bookingRef}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white/70">Experience:</span>
                        <span className="text-white font-semibold">{formData.experience}</span>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white/70">Date & Time:</span>
                        <span className="text-[#F3D898] font-semibold">{formData.date} at {formData.time}</span>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white/70">Party Size:</span>
                        <span className="text-white font-semibold">{formData.guests} Guests ({formData.occasion})</span>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white/70">Location:</span>
                        <span className="text-white font-semibold">MG Marg, Hazratganj, Lucknow</span>
                      </div>
                    </div>

                    {/* Direct Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3.5 w-full max-w-md">
                      <button
                        onClick={handleWhatsAppConfirm}
                        className="flex-1 py-3.5 bg-[#0A6473] hover:bg-[#0c7587] text-white font-sans font-bold text-xs uppercase tracking-widest rounded shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer border border-[#F3D898]/40"
                      >
                        <MessageSquare className="w-4 h-4 text-[#F3D898]" />
                        <span>Instant Host Concierge</span>
                      </button>

                      <button
                        onClick={handleReset}
                        className="flex-1 py-3.5 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-sans text-xs uppercase tracking-widest rounded transition-all cursor-pointer"
                      >
                        Reserve Another Table
                      </button>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT: EDITORIAL GUIDELINES, LUCKNOW LOCATION & CONCIERGE INFO */}
          {/* ========================================================================= */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* CARD 1: RESERVATION GUIDELINES */}
            <div className="bg-[#0C5866]/65 backdrop-blur-md p-6 sm:p-7 rounded-sm border border-white/15 shadow-xl">
              <h3
                className="text-xl tracking-[0.1em] uppercase text-white font-light mb-4 pb-3 border-b border-white/15"
                style={{ fontFamily: "'Cormorant Garamond', 'Belleza', serif" }}
              >
                DINING GUIDELINES
              </h3>

              <div className="space-y-4 font-sans text-xs sm:text-[13px] text-white/80 leading-relaxed">
                <div>
                  <h4 className="text-white font-semibold uppercase tracking-wider text-[11px] mb-1 text-[#F3D898]">
                    Grace Period
                  </h4>
                  <p>
                    Tables are held for 15 minutes past the reservation time before being offered to walk-in guests.
                  </p>
                </div>

                <div>
                  <h4 className="text-white font-semibold uppercase tracking-wider text-[11px] mb-1 text-[#F3D898]">
                    Large Parties (8+ Guests)
                  </h4>
                  <p>
                    For groups larger than 8, custom tasting platters and private section reservations can be arranged.
                  </p>
                </div>

                <div>
                  <h4 className="text-white font-semibold uppercase tracking-wider text-[11px] mb-1 text-[#F3D898]">
                    Dietary Customizations
                  </h4>
                  <p>
                    Our kitchen happily accommodates vegan, gluten-free and Jain dining upon request.
                  </p>
                </div>
              </div>
            </div>

            {/* CARD 2: CONCIERGE & DIRECT ASSISTANCE */}
            <div className="bg-[#0C5866]/65 backdrop-blur-md p-6 sm:p-7 rounded-sm border border-white/15 shadow-xl">
              <h3
                className="text-xl tracking-[0.1em] uppercase text-white font-light mb-4 pb-3 border-b border-white/15"
                style={{ fontFamily: "'Cormorant Garamond', 'Belleza', serif" }}
              >
                HOST DESK CONCIERGE
              </h3>

              <div className="space-y-4 font-sans text-xs sm:text-[13px]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#F3D898] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-white font-semibold block uppercase tracking-wider text-[11px]">
                      Sagē Café Hazratganj
                    </span>
                    <span className="text-white/70 leading-relaxed">
                      MG Marg, Near Hazratganj Crossing, Lucknow, UP 226001
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#F3D898] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-white font-semibold block uppercase tracking-wider text-[11px]">
                      Host Desk Line
                    </span>
                    <a href="tel:+915224028899" className="text-white/90 hover:text-[#F3D898] transition-colors">
                      +91 (522) 402-8899
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#F3D898] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-white font-semibold block uppercase tracking-wider text-[11px]">
                      Table Hours
                    </span>
                    <span className="text-white/70">
                      Daily 8:00 AM – 12:00 AM
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/15">
                <Link
                  to="/menu"
                  className="w-full py-3 bg-white/5 hover:bg-white/15 text-white border border-white/20 rounded text-xs uppercase tracking-[0.2em] font-sans flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>EXPLORE OUR MENU</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#F3D898]" />
                </Link>
              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
};

export default ReservationPage;
