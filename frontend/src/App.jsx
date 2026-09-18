import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileCTA } from './components/layout/MobileCTA';
import { ReservationModal } from './components/reservation/ReservationModal';
import { CartDrawer } from './components/order/CartDrawer';
import { TableOrderModal } from './components/order/TableOrderModal';
import { SplashScreen } from './components/ui/SplashScreen';
import { CookieBanner } from './components/ui/CookieBanner';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { OurStoryPage } from './pages/OurStoryPage';
import { GalleryPage } from './pages/GalleryPage';
import { EventsPage } from './pages/EventsPage';
import { AdminPage } from './pages/AdminPage';
import { FindUsPage } from './pages/FindUsPage';
import { ReservationPage } from './pages/ReservationPage';

import { LoginPage } from './pages/LoginPage';

// Scroll restoration component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Conditional Navigation Header (Rendered on public browsing pages)
const GlobalNavbar = () => {
  const { pathname } = useLocation();
  if (pathname === '/' || pathname === '/login' || pathname === '/staff-login' || pathname === '/admin') return null;
  return <Navbar />;
};

// Conditional Footer (Hidden on login and admin pages for full-screen fit)
const GlobalFooter = () => {
  const { pathname } = useLocation();
  if (pathname === '/login' || pathname === '/staff-login' || pathname === '/admin') return null;
  return <Footer />;
};

export function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {/* 3D Liquid Splash Screen */}
      <AnimatePresence mode="wait">
        {showSplash && <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>

      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-brand-950 text-brand-cream flex flex-col justify-between selection:bg-brand-amber selection:text-brand-950 font-sans">
          <GlobalNavbar />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/reservation" element={<ReservationPage />} />
              <Route path="/reservations" element={<ReservationPage />} />
              <Route path="/story" element={<OurStoryPage />} />
              <Route path="/our-story" element={<OurStoryPage />} />
              <Route path="/about" element={<OurStoryPage />} />
              <Route path="/find-us" element={<FindUsPage />} />
              <Route path="/contact" element={<FindUsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/staff-login" element={<LoginPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>

          <GlobalFooter />

          {/* Global Modals & Overlays */}
          <ReservationModal />
          <CartDrawer />
          <TableOrderModal />
          <CookieBanner />
        </div>
      </Router>
    </>
  );
}

export default App;
