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
          initial={{ y: 100, opacity: 0, x: '-50%' }}
          animate={{ y: 0, opacity: 1, x: '-50%' }}
          exit={{ y: 100, opacity: 0, x: '-50%' }}
          transition={{ type: 'spring', stiffness: 260, damping: 25 }}
          className="fixed bottom-6 left-1/2 z-[9999] w-[92%] max-w-lg bg-[#FAF9F6] border border-stone-200/60 rounded-xl sm:rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] p-2 sm:p-2.5 flex items-center justify-between gap-3 sm:gap-4 select-none"
        >
          {/* Left Icon (Squircle) */}
          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-[#FDE08B] rounded-xl flex items-center justify-center">
            <Cookie className="w-5 h-5 sm:w-6 sm:h-6 text-[#594A42]" strokeWidth={2.5} />
          </div>

          {/* Text Content */}
          <div className="flex-1">
            <p 
              style={{ fontFamily: '"Caveat", cursive' }} 
              className="text-[#594A42] text-[19px] sm:text-[23px] font-medium leading-none pt-1 tracking-wide"
            >
              We use cookies to improve your experience.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 sm:gap-4 pr-1 sm:pr-2">
            <button
              onClick={handleLater}
              style={{ fontFamily: '"Caveat", cursive' }}
              className="text-[#9A8F80] hover:text-[#594A42] text-[16px] sm:text-[18px] font-bold tracking-wider uppercase transition-colors pt-1"
            >
              LATER
            </button>
            <button
              onClick={handleAccept}
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              className="bg-[#FDE08B] hover:bg-[#FCD34D] text-[#594A42] text-[11px] sm:text-[12px] font-extrabold tracking-wider uppercase px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all active:scale-95 shadow-sm"
            >
              OKAY!
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
