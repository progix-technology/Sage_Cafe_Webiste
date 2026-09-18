import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ChevronRight, ChevronLeft, ArrowUpRight, Compass } from 'lucide-react';
import { ASSETS } from '../assets/images';
import { submitContactMessage } from '../services/api';

export const FindUsPage = () => {
  // Interactive Contact Step Form State
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    purpose: 'Table Reservation',
    message: '',
  });

  const totalSteps = 4;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsSubmitting(true);
      try {
        const contactVal = formData.contact?.trim() || '';
        const isEmail = contactVal.includes('@');
        await submitContactMessage({
          name: formData.name?.trim() || 'Guest Visitor',
          contact: contactVal || 'Not provided',
          email: isEmail ? contactVal : '',
          phone: !isEmail ? contactVal : '',
          purpose: formData.purpose || 'General Inquiry',
          subject: `${formData.purpose || 'General Inquiry'} - ${formData.name || 'Guest'}`,
          message: formData.message?.trim() || 'No additional message provided.',
        });
      } catch (err) {
        console.error('Contact message error:', err);
      } finally {
        setIsSubmitting(false);
        setIsSubmitted(true);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      contact: '',
      purpose: 'Table Reservation',
      message: '',
    });
    setCurrentStep(1);
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-[#0A6473] text-white selection:bg-[#F3D898] selection:text-[#0A6473]">
      
      {/* ========================================================================= */}
      {/* 1. HERO / CONTACT HEADER WITH CAFÉ AMBIANCE BACKGROUND */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[52vh] sm:min-h-[58vh] flex flex-col items-center justify-center text-center px-6 sm:px-10 pt-32 pb-20 overflow-hidden select-none">
        
        {/* Warm Café Ambiance Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=2400&q=85"
            alt="Sagē Café Lucknow Ambiance"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center filter brightness-[0.55] contrast-[1.1]"
          />
          {/* Deep Teal Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#063b44]/75 via-[#0a6473]/55 to-[#0A6473]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#063b44]/30 to-[#0A6473]" />
        </div>

        {/* Subtle Decorative Watermark in Background */}
        <div className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center">
          <span
            style={{ fontFamily: '"Tan Mon Cheri", "Italiana", "Cormorant Garamond", serif' }}
            className="text-[28vw] font-bold text-white tracking-tighter leading-none select-none"
          >
            SAGĒ
          </span>
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          
          {/* Header Title with Cursive Accent Centered Beneath */}
          <div className="flex flex-col items-center mb-6 sm:mb-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-[0.14em] uppercase text-white leading-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
              style={{ fontFamily: "'Cormorant Garamond', 'Belleza', serif" }}
            >
              CONTACT
            </motion.h1>

            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#E8DCC4] font-normal tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] mt-1 sm:mt-2 block"
              style={{ fontFamily: "'Covered By Your Grace', 'Caveat', cursive" }}
            >
              meet us in lucknow
            </motion.span>
          </div>

          {/* Subtitle Message */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-[11px] sm:text-xs md:text-sm tracking-[0.22em] uppercase text-white/90 max-w-2xl leading-relaxed font-sans mt-4 sm:mt-6 px-4"
          >
            FOR RESERVATIONS, PRIVATE GATHERINGS, AND GENERAL ENQUIRIES, OUR TEAM IS HERE TO HELP PLAN YOUR TIME AT SAGĒ CAFÉ.
          </motion.p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. MAIN 2-COLUMN SECTION: MAP & 3 EDITORIAL CARDS */}
      {/* ========================================================================= */}
      <section className="relative w-full bg-[#0A6473] px-6 sm:px-10 md:px-14 lg:px-20 pb-24 sm:pb-32 pt-4">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#15808d]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#063b44]/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 relative z-10">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN (5 Cols): REAL INTERACTIVE LUCKNOW MAP */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="relative w-full h-[520px] sm:h-[620px] lg:h-[780px] rounded-sm overflow-hidden border border-white/15 shadow-2xl bg-[#09414B] flex flex-col justify-between group">
              
              {/* Real Google Map Embed Container */}
              <div className="absolute inset-0 z-0">
                <iframe
                  title="Sagē Café Hazratganj Lucknow Location"
                  src="https://maps.google.com/maps?q=Hazratganj%2C%20Lucknow%2C%20Uttar%20Pradesh%20226001&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'contrast(1.08) saturate(1.15)' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>

              {/* Map Top Header Badge */}
              <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between pointer-events-none">
                <div className="bg-[#0A6473]/90 backdrop-blur-md px-3.5 py-1.5 rounded text-white text-[10px] tracking-[0.2em] uppercase font-sans border border-white/20 flex items-center gap-2 shadow-lg">
                  <Compass className="w-3.5 h-3.5 text-[#F3D898]" />
                  <span>26&deg;50&prime;48&Prime;N &nbsp; 80&deg;56&prime;46&Prime;E</span>
                </div>
                <div className="bg-[#0A6473]/90 backdrop-blur-md px-3 py-1.5 rounded text-[#F3D898] text-[10px] tracking-[0.15em] uppercase font-sans border border-white/20 shadow-lg font-bold">
                  HAZRATGANJ, LUCKNOW
                </div>
              </div>

              {/* Map Bottom Floating Card & Action Button */}
              <div className="relative z-10 p-4 sm:p-6 space-y-3 pointer-events-auto">
                <div className="bg-[#0A6473]/95 backdrop-blur-md p-3.5 sm:p-4 rounded border border-white/20 shadow-xl text-left">
                  <div className="flex items-center gap-2 text-[#F3D898] text-xs font-semibold uppercase tracking-wider mb-1">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Sagē Café &bull; Flagship Lucknow</span>
                  </div>
                  <p className="text-white/85 text-xs font-sans leading-relaxed">
                    MG Marg, Near Hazratganj Crossing, Lucknow, Uttar Pradesh 226001
                  </p>
                </div>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=Hazratganj,+Lucknow,+Uttar+Pradesh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#0A6473] hover:bg-[#084E5B] text-white py-3.5 px-5 rounded shadow-xl border border-white/25 flex items-center justify-center gap-3 transition-all duration-300 group-hover:scale-[1.01] cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-[#F3D898]" />
                  <span className="text-xs sm:text-sm uppercase tracking-[0.2em] font-medium font-sans">
                    OPEN IN GOOGLE MAPS
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN (7 Cols): 3 ELEGANT EDITORIAL CARDS */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 flex flex-col gap-6 sm:gap-8">
            
            {/* ----------------------------------------------------------------------- */}
            {/* CARD 1: OPENING HOURS */}
            {/* ----------------------------------------------------------------------- */}
            <div className="bg-[#0C5866]/60 backdrop-blur-md p-6 sm:p-8 rounded-sm border border-white/15 shadow-xl hover:border-white/25 transition-all duration-300">
              
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/15">
                <h3
                  className="text-xl sm:text-2xl tracking-[0.1em] uppercase text-white font-light"
                  style={{ fontFamily: "'Cormorant Garamond', 'Belleza', serif" }}
                >
                  OPENING HOURS
                </h3>
                <Clock className="w-4 h-4 text-[#F3D898]/80" />
              </div>

              <div className="space-y-3.5 font-sans">
                {[
                  { day: 'Monday', time: '8:00 AM – 11:00 PM' },
                  { day: 'Tuesday', time: '8:00 AM – 12:00 AM' },
                  { day: 'Wednesday', time: '8:00 AM – 12:00 AM' },
                  { day: 'Thursday', time: '8:00 AM – 12:00 AM' },
                  { day: 'Friday', time: '8:00 AM – 12:00 AM' },
                  { day: 'Saturday', time: '8:00 AM – 12:00 AM' },
                  { day: 'Sunday', time: '8:00 AM – 12:00 AM' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs sm:text-[13px] tracking-wide">
                    <span className="text-white/80 font-normal">{item.day}</span>
                    <span className="flex-1 mx-3 border-b border-dotted border-white/20 relative top-1" />
                    <span className="text-white font-medium">{item.time}</span>
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-white/50 tracking-wider uppercase font-sans mt-5">
                * Kitchen closes 45 minutes prior to closing time
              </p>
            </div>

            {/* ----------------------------------------------------------------------- */}
            {/* CARD 2: ESSENTIAL INFO. */}
            {/* ----------------------------------------------------------------------- */}
            <div className="bg-[#0C5866]/60 backdrop-blur-md p-6 sm:p-8 rounded-sm border border-white/15 shadow-xl hover:border-white/25 transition-all duration-300">
              
              <h3
                className="text-xl sm:text-2xl tracking-[0.1em] uppercase text-white font-light mb-6 pb-3 border-b border-white/15"
                style={{ fontFamily: "'Cormorant Garamond', 'Belleza', serif" }}
              >
                ESSENTIAL INFO.
              </h3>

              <div className="space-y-5 font-sans text-xs sm:text-[13px]">
                
                {/* Location */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4 items-baseline">
                  <span className="sm:col-span-4 uppercase tracking-[0.18em] text-white/60 text-[11px] font-medium">
                    SAGĒ HAZRATGANJ
                  </span>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Hazratganj,+Lucknow,+Uttar+Pradesh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sm:col-span-8 text-white hover:text-[#F3D898] underline underline-offset-4 transition-colors leading-relaxed"
                  >
                    MG Marg, Near Hazratganj Crossing, Lucknow, UP 226001
                  </a>
                </div>

                {/* Email */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4 items-baseline">
                  <span className="sm:col-span-4 uppercase tracking-[0.18em] text-white/60 text-[11px] font-medium">
                    EMAIL
                  </span>
                  <a
                    href="mailto:reservations@sagecafe.in"
                    className="sm:col-span-8 text-white hover:text-[#F3D898] underline underline-offset-4 transition-colors"
                  >
                    reservations@sagecafe.in
                  </a>
                </div>

                {/* Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4 items-baseline">
                  <span className="sm:col-span-4 uppercase tracking-[0.18em] text-white/60 text-[11px] font-medium">
                    DIRECT CALL
                  </span>
                  <a
                    href="tel:+915224028899"
                    className="sm:col-span-8 text-white hover:text-[#F3D898] transition-colors font-medium"
                  >
                    +91 (522) 402-8899
                  </a>
                </div>

              </div>
            </div>

            {/* ----------------------------------------------------------------------- */}
            {/* CARD 3: CONTACT US (INTERACTIVE STEP FORM) */}
            {/* ----------------------------------------------------------------------- */}
            <div className="bg-[#0C5866]/60 backdrop-blur-md p-6 sm:p-8 rounded-sm border border-white/15 shadow-xl relative overflow-hidden">
              
              <div className="flex items-center justify-between mb-2">
                <h3
                  className="text-xl sm:text-2xl tracking-[0.1em] uppercase text-white font-light"
                  style={{ fontFamily: "'Cormorant Garamond', 'Belleza', serif" }}
                >
                  CONTACT US
                </h3>

                {!isSubmitted && (
                  <span className="text-xs tracking-[0.25em] text-[#F3D898] font-sans font-bold">
                    0{currentStep} / 0{totalSteps}
                  </span>
                )}
              </div>

              <p className="text-white/70 text-xs sm:text-[13px] leading-relaxed mb-6 font-sans">
                A few details are all we need. Share your preferred contact method and message, and our team will be in touch shortly.
              </p>

              {/* Step Progress Bar */}
              {!isSubmitted && (
                <div className="w-full h-[2px] bg-white/15 mb-8 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#F3D898]"
                    initial={{ width: '25%' }}
                    animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  />
                </div>
              )}

              {/* Form Content */}
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-8 text-center flex flex-col items-center"
                  >
                    <CheckCircle2 className="w-12 h-12 text-[#F3D898] mb-4" />
                    <h4
                      className="text-2xl sm:text-3xl text-white font-light uppercase tracking-wide mb-2"
                      style={{ fontFamily: "'Cormorant Garamond', 'Belleza', serif" }}
                    >
                      Thank You, {formData.name || 'Friend'}
                    </h4>
                    <p className="text-white/80 text-xs sm:text-sm font-sans max-w-md leading-relaxed mb-6">
                      Your message has been received by our host desk. We will reach out to you at <span className="text-[#F3D898] font-medium">{formData.contact || 'your contact'}</span> shortly.
                    </p>
                    <button
                      onClick={handleReset}
                      className="text-xs uppercase tracking-[0.2em] text-[#F3D898] hover:text-white border-b border-[#F3D898] pb-1 transition-colors font-sans cursor-pointer"
                    >
                      SEND ANOTHER MESSAGE
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`step-${currentStep}`}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.28 }}
                    className="min-h-[140px] flex flex-col justify-between"
                  >
                    {/* Step 1: Name */}
                    {currentStep === 1 && (
                      <div>
                        <label className="block text-lg sm:text-2xl font-light text-white uppercase tracking-wide mb-3" style={{ fontFamily: "'Cormorant Garamond', 'Belleza', serif" }}>
                          What should we call you?
                        </label>
                        <input
                          type="text"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && formData.name.trim() && handleNext()}
                          autoFocus
                          className="w-full bg-transparent border-b border-white/30 focus:border-[#F3D898] py-2.5 text-white placeholder-white/30 text-sm sm:text-base outline-none transition-colors font-sans"
                        />
                      </div>
                    )}

                    {/* Step 2: Contact Info */}
                    {currentStep === 2 && (
                      <div>
                        <label className="block text-lg sm:text-2xl font-light text-white uppercase tracking-wide mb-3" style={{ fontFamily: "'Cormorant Garamond', 'Belleza', serif" }}>
                          Where can we reach you?
                        </label>
                        <input
                          type="text"
                          placeholder="Email address or phone number"
                          value={formData.contact}
                          onChange={(e) => handleInputChange('contact', e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && formData.contact.trim() && handleNext()}
                          autoFocus
                          className="w-full bg-transparent border-b border-white/30 focus:border-[#F3D898] py-2.5 text-white placeholder-white/30 text-sm sm:text-base outline-none transition-colors font-sans"
                        />
                      </div>
                    )}

                    {/* Step 3: Purpose */}
                    {currentStep === 3 && (
                      <div>
                        <label className="block text-lg sm:text-2xl font-light text-white uppercase tracking-wide mb-3" style={{ fontFamily: "'Cormorant Garamond', 'Belleza', serif" }}>
                          What are you planning?
                        </label>
                        <div className="grid grid-cols-2 gap-2.5 pt-1">
                          {['Table Reservation', 'Private Event', 'Press & Collab', 'General Inquiry'].map((item) => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => handleInputChange('purpose', item)}
                              className={`py-2.5 px-3 rounded text-xs tracking-wider uppercase font-sans border transition-all duration-200 cursor-pointer text-left ${
                                formData.purpose === item
                                  ? 'bg-[#F3D898] text-[#0A6473] border-[#F3D898] font-bold shadow-md'
                                  : 'bg-white/5 text-white border-white/20 hover:border-white/40'
                              }`}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step 4: Message */}
                    {currentStep === 4 && (
                      <div>
                        <label className="block text-lg sm:text-2xl font-light text-white uppercase tracking-wide mb-3" style={{ fontFamily: "'Cormorant Garamond', 'Belleza', serif" }}>
                          Your message or request
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Tell us any dates, guest counts, or specific wishes..."
                          value={formData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          autoFocus
                          className="w-full bg-transparent border border-white/25 rounded p-3 text-white placeholder-white/30 text-xs sm:text-sm outline-none focus:border-[#F3D898] transition-colors font-sans resize-none"
                        />
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between pt-8 border-t border-white/10 mt-6 select-none">
                      <button
                        onClick={handleBack}
                        disabled={currentStep === 1}
                        className={`text-xs uppercase tracking-[0.2em] font-sans flex items-center gap-1.5 transition-colors cursor-pointer ${
                          currentStep === 1
                            ? 'text-white/20 cursor-not-allowed'
                            : 'text-white/70 hover:text-white'
                        }`}
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>BACK</span>
                      </button>

                      <button
                        onClick={handleNext}
                        className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-[#F3D898] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>{currentStep === totalSteps ? 'SUBMIT' : 'NEXT'}</span>
                        {currentStep === totalSteps ? (
                          <Send className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
};
