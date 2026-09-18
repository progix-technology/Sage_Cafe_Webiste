import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie } from 'lucide-react';

export const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Delay showing it slightly for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleLater = () => {
    localStorage.setItem('cookieConsent', 'later');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 50, opacity: 0, x: 20 }}
          animate={{ y: 0, opacity: 1, x: 0 }}
          exit={{ y: 50, opacity: 0, x: 20 }}
          transition={{ type: 'spring', stiffness: 260, damping: 25 }}
          className="fixed bottom-1 right-2 sm:bottom-2 sm:right-4 z-[9999] w-[95%] max-w-[460px] bg-[#FAF9F6] border border-stone-200/60 rounded-xl sm:rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.12)] p-2 sm:p-2.5 flex items-center justify-between gap-3 sm:gap-4 select-none"
        >
          {/* Left Icon (Squircle) */}
          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-[#FDE08B] border border-[#1B365D]/20 rounded-lg flex items-center justify-center">
            <Cookie className="w-4 h-4 sm:w-5 sm:h-5 text-[#594A42]" strokeWidth={2.5} />
          </div>

          {/* Text Content */}
          <div className="flex-1 leading-[1.1]">
            <p 
              style={{ fontFamily: '"Caveat", cursive' }} 
              className="text-[#594A42] text-[17px] sm:text-[19px] font-medium pt-0.5 tracking-wide"
            >
              We use cookies to improve your experience.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3 pr-1">
            <button
              onClick={handleLater}
              style={{ fontFamily: '"Caveat", cursive' }}
              className="text-[#9A8F80] hover:text-[#594A42] text-[14px] sm:text-[16px] font-bold tracking-wider uppercase transition-colors pt-0.5"
            >
              LATER
            </button>
            <button
              onClick={handleAccept}
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              className="bg-[#FDE08B] hover:bg-[#FCD34D] border-2 border-[#1B365D] text-[#1B365D] text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all active:scale-95 shadow-sm"
            >
              OKAY!
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
