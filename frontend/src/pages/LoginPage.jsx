import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ArrowRight, HelpCircle, Check, Loader2, AlertCircle, Sparkles, Shield, Coffee } from 'lucide-react';
import { ASSETS } from '../assets/images';
import { loginWithCredentials } from '../services/api';

export const LoginPage = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password .');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await loginWithCredentials(email.trim(), password);
      if (res.success) {
        localStorage.setItem('sage_staff_token', res.token);
        localStorage.setItem('sage_staff_user', JSON.stringify(res.user));
        if (onLoginSuccess) {
          onLoginSuccess(res.user);
        } else {
          navigate('/admin');
        }
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen max-h-screen h-[100dvh] max-h-[100dvh] w-full bg-[#03181C] text-white flex flex-col justify-between overflow-hidden select-none font-sans selection:bg-[#F3D898] selection:text-[#0A6473]">

      {/* ========================================================================= */}
      {/* 1. CINEMATIC LUXURY AMBIENT BACKGROUND WITH PHOTO DEPTH & GOLDEN GLOW */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">

        {/* Base Rich Teal-Emerald Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#052C32] via-[#031C20] to-[#011114]" />

        {/* Subtle Atmospheric Cafe Depth Photo with Luxury Tint */}
        <div className="absolute inset-0 opacity-[0.22] mix-blend-luminosity">
          <img
            src={ASSETS.midImg || ASSETS.sagePatio}
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center filter blur-[2px] scale-105"
          />
        </div>

        {/* Deep Vignette & Luxury Gradient Overlays */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#031C20]/75 to-[#010D0F]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(10,100,115,0.4)_0%,transparent_50%,rgba(1,14,17,0.85)_100%)]" />

        {/* Fine Architectural Concentric Rings & Geometry */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.07] pointer-events-none">
          <svg className="w-[850px] h-[850px]" viewBox="0 0 800 800" fill="none">
            <circle cx="400" cy="400" r="380" stroke="#F3D898" strokeWidth="1" strokeDasharray="4 8" />
            <circle cx="400" cy="400" r="290" stroke="#F3D898" strokeWidth="1" />
            <circle cx="400" cy="400" r="190" stroke="#F3D898" strokeWidth="0.8" strokeDasharray="2 4" />
            <line x1="0" y1="400" x2="800" y2="400" stroke="#F3D898" strokeWidth="0.8" opacity="0.6" />
            <line x1="400" y1="0" x2="400" y2="800" stroke="#F3D898" strokeWidth="0.8" opacity="0.6" />
          </svg>
        </div>

        {/* Ambient Glowing Orbs & Warm Light Beams */}
        <div className="absolute -top-24 left-1/4 w-[500px] h-[500px] bg-[#F3D898]/[0.10] rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -left-20 w-[450px] h-[450px] bg-[#0A6473]/35 rounded-full blur-[110px]" />
        <div className="absolute -bottom-20 right-1/4 w-[550px] h-[550px] bg-[#0D7E91]/30 rounded-full blur-[130px]" />
        <div className="absolute bottom-1/3 -right-20 w-[400px] h-[400px] bg-[#F3D898]/[0.08] rounded-full blur-[100px]" />

        {/* Delicate Golden Bokeh Particles */}
        <div className="absolute top-[18%] left-[15%] w-2 h-2 rounded-full bg-[#F3D898]/50 blur-[1px] animate-pulse" />
        <div className="absolute top-[28%] right-[22%] w-3 h-3 rounded-full bg-[#F3D898]/35 blur-[2px]" />
        <div className="absolute bottom-[25%] left-[28%] w-2.5 h-2.5 rounded-full bg-[#F3D898]/40 blur-[1.5px]" />
        <div className="absolute bottom-[35%] right-[14%] w-2 h-2 rounded-full bg-[#F3D898]/45 blur-[1px] animate-pulse" />

        {/* Subtle Corner Botanical Branch Silhouettes */}
        <div className="absolute -top-10 -right-10 w-48 sm:w-64 opacity-15 mix-blend-screen rotate-45">
          <img src={ASSETS.branch} alt="" loading="lazy" decoding="async" className="w-full h-auto object-contain filter invert" />
        </div>
        <div className="absolute -bottom-12 -left-12 w-52 sm:w-72 opacity-15 mix-blend-screen -rotate-12">
          <img src={ASSETS.branch} alt="" loading="lazy" decoding="async" className="w-full h-auto object-contain filter invert" />
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. COMPACT TOP HEADER NAVIGATION BAR */}
      {/* ========================================================================= */}
      <header className="relative z-20 w-full px-6 sm:px-10 lg:px-14 py-2.5 sm:py-3.5 flex items-center justify-between flex-shrink-0">

        {/* Left: Back to website */}
        <Link
          to="/"
          className="text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[#F3D898] hover:text-white transition-colors flex items-center gap-1.5 font-medium"
        >
          <span>&lsaquo;</span>
          <span>BACK TO WEBSITE</span>
        </Link>

        {/* Center: Sage Café Pure White Luxury Brand Logo */}
        <div className="flex flex-col items-center select-none">
          <img
            src={ASSETS.cafeName}
            alt="Sagē Café"
            loading="lazy"
            decoding="async"
            className="h-7 sm:h-8 md:h-9 w-auto object-contain filter brightness-0 invert opacity-95 hover:opacity-100 transition-opacity drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]"
          />
        </div>

        {/* Right: Need help? */}
        <button
          onClick={() => setShowHelpModal(true)}
          className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-white/80 hover:text-[#F3D898] transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#F3D898]" />
          <span>NEED HELP?</span>
        </button>
      </header>

      {/* ========================================================================= */}
      {/* 3. MAIN VIEWPORT FIT: LEFT STORY + CENTER LOGIN CARD + RIGHT ARTISAN VIBE */}
      {/* ========================================================================= */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-8 py-1 min-h-0 overflow-hidden">

        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-4 lg:gap-8 relative">

          {/* ----------------------------------------------------------------------- */}
          {/* LEFT BACKGROUND: WARM EDITORIAL BRAND IDENTITY */}
          {/* ----------------------------------------------------------------------- */}
          <div className="hidden lg:flex lg:col-span-3 flex-col justify-between h-[360px] xl:h-[400px] pointer-events-none select-none pl-4">
            <div>
              <span
                className="text-[#F3D898] text-lg xl:text-xl font-normal tracking-wide block mb-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
                style={{ fontFamily: "'Covered By Your Grace', 'Caveat', cursive" }}
              >
                Where Good Food Brings Us Together
              </span>
              <h2
                className="text-white font-serif text-2xl xl:text-3xl font-light leading-[1.12] drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] uppercase tracking-wide mt-1"
                style={{ fontFamily: "'Cormorant Garamond', 'Belleza', serif" }}
              >
                Good<br />
                Food<br />
                Brighter<br />
                People
              </h2>
              <div className="w-12 h-[2px] bg-[#F3D898] mt-2.5 shadow-[0_0_12px_rgba(243,216,152,0.9)]" />
            </div>

            <div className="pt-3 border-t border-white/20">
              <p className="text-[9.5px] uppercase tracking-[0.22em] text-[#F3D898] font-sans leading-relaxed font-semibold">
                A HAPPY TEAM<br />
                <span className="text-white/80 font-normal">SERVES A HAPPIER TOMORROW.</span>
              </p>
            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* CENTER: ZERO-SCROLL LUXURY SAGE BRAND LOGIN CARD */}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-[390px] bg-[#FAF7F2] text-[#0A6473] rounded-[24px] p-4 sm:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.65)] border border-[#F3D898]/70 relative backdrop-blur-md">

              {/* Card Top: Only Logo & Welcome back Message */}
              <div className="flex flex-col items-center text-center mb-4">
                <img
                  src={ASSETS.cafeName}
                  alt="Sagē Café"
                  loading="lazy"
                  decoding="async"
                  className="h-8 sm:h-9 w-auto object-contain mb-2.5 filter drop-shadow-sm"
                />
                <h3
                  className="text-xl sm:text-2xl font-serif text-[#052C32] font-semibold tracking-wide"
                  style={{ fontFamily: "'Cormorant Garamond', 'Belleza', serif" }}
                >
                  Welcome back.
                </h3>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-2 p-1.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[10px] flex items-center gap-1.5 font-sans">
                  <AlertCircle className="w-3 h-3 flex-shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-2">

                {/* Input 1: Email / Staff ID */}
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-[#0A6473] font-mono font-bold mb-0.5">
                    Email / Staff ID
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#0A6473]/60">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Enter registered email / ID"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 sm:py-2 rounded-xl bg-[#F0EBE1] border border-[#E0D5C3] text-xs text-[#052C32] placeholder-[#0A6473]/40 focus:outline-none focus:border-[#0A6473] focus:bg-white transition-all font-sans font-medium"
                    />
                  </div>
                </div>

                {/* Input 2: Password */}
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-[#0A6473] font-mono font-bold mb-0.5">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#0A6473]/60">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-8 pr-8 py-1.5 sm:py-2 rounded-xl bg-[#F0EBE1] border border-[#E0D5C3] text-xs text-[#052C32] placeholder-[#0A6473]/40 focus:outline-none focus:border-[#0A6473] focus:bg-white transition-all font-sans font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#0A6473]/60 hover:text-[#0A6473] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Row: Remember me & Forgot password */}
                <div className="flex items-center justify-between pt-0.5 text-xs font-sans text-[#0A6473]">
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <div
                      onClick={() => setRememberMe(!rememberMe)}
                      className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${rememberMe
                        ? 'bg-[#0A6473] border-[#0A6473] text-white'
                        : 'bg-white border-[#C7BBA5]'
                        }`}
                    >
                      {rememberMe && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <span className="text-[10px] font-medium">Remember me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowHelpModal(true)}
                    className="text-[10px] text-[#0A6473] hover:underline underline-offset-2 transition-colors font-semibold"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* SIGN IN BUTTON (Deep Teal Brand Pill Button with Gold Accent) */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-[#0A6473] hover:bg-[#074D59] text-[#FAF7F2] rounded-xl font-bold text-xs uppercase tracking-[0.2em] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 border border-[#F3D898]/40"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F3D898]" />
                        <span>VERIFYING...</span>
                      </>
                    ) : (
                      <>
                        <span>SIGN IN TO DASHBOARD</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#F3D898]" />
                      </>
                    )}
                  </button>
                </div>

              </form>

              {/* CARD BOTTOM MOTTO */}
              <div className="mt-3 pt-2 text-center border-t border-[#EAE0CD] flex flex-col items-center">
                <Sparkles className="w-3 h-3 text-[#0A6473] mb-0.5" />
                <p className="text-[8px] uppercase tracking-[0.22em] text-[#0A6473]/80 font-sans font-bold">
                  GOOD FOOD BRINGS <span className="text-[#052C32]">GREAT PEOPLE TOGETHER.</span>
                </p>
              </div>

            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* RIGHT BACKGROUND: CURSIVE TEXT & ARTISAN COFFEE STILL LIFE */}
          {/* ----------------------------------------------------------------------- */}
          <div className="hidden lg:flex lg:col-span-3 flex-col justify-between h-[360px] xl:h-[400px] pointer-events-none select-none pr-4 text-right">
            <div>
              <p
                className="text-[#F3D898] text-2xl xl:text-3xl font-normal leading-tight drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]"
                style={{ fontFamily: "'Covered By Your Grace', 'Caveat', cursive" }}
              >
                More<br />
                than just<br />
                a caf&eacute; &hearts;
              </p>
            </div>

            {/* Coffee Still Life Accent */}
            <div className="space-y-2 flex flex-col items-end">
              <div className="bg-[#052C32]/70 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 shadow-xl max-w-[180px] text-left space-y-0.5">
                <div className="flex items-center gap-1.5 text-[#F3D898] text-[10px] font-semibold uppercase tracking-wider">
                  <Coffee className="w-3 h-3 text-[#F3D898]" />
                  <span>Artisanal Blend</span>
                </div>
                <p className="text-[9.5px] text-white/70 font-sans leading-snug">
                  Single-origin roasts brewed daily in Hazratganj.
                </p>
              </div>

              <div>
                <p
                  className="text-white font-serif text-sm tracking-wide uppercase"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Artisanal Roastery
                </p>
                <p
                  className="text-[#F3D898] text-[11px] font-serif italic tracking-wide"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Good Coffee. Better People.
                </p>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* ========================================================================= */}
      {/* 4. COMPACT BOTTOM COPYRIGHT BAR */}
      {/* ========================================================================= */}
      <footer className="relative z-20 w-full px-6 sm:px-10 py-2 flex items-center justify-between text-[9px] sm:text-[9.5px] text-white/70 uppercase tracking-widest font-sans border-t border-white/15 bg-[#063B44]/60 backdrop-blur-sm flex-shrink-0">
        <span className="hidden sm:inline">MG MARG, HAZRATGANJ, LUCKNOW</span>
        <span className="mx-auto sm:mx-0">&copy; 2026 SAGĒ GROUP &bull; ALL RIGHTS RESERVED</span>
        <span className="hidden sm:inline">FLAGSHIP LUXURY CAF&Eacute;</span>
      </footer>

      {/* ========================================================================= */}
      {/* 5. NEED HELP / SECURE IT SUPPORT MODAL */}
      {/* ========================================================================= */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#FAF7F2] text-[#0A6473] max-w-sm w-full p-5 sm:p-6 rounded-3xl border border-[#F3D898] shadow-2xl space-y-3 font-sans text-xs">
            <div className="flex items-center gap-2 text-[#0A6473]">
              <Shield className="w-4 h-4 text-[#0A6473]" />
              <h4 className="font-serif text-lg font-bold uppercase tracking-wider">
                Staff & Admin Support
              </h4>
            </div>

            <p className="text-[#052C32]/80 leading-relaxed text-[11px]">
              This is a restricted administrative portal. Access is permitted only to authorized personnel with active credentials.
            </p>

            <div className="p-3 rounded-2xl bg-[#F0EBE1] border border-[#E0D5C3] space-y-1.5 text-xs">
              <p className="text-[#052C32] font-medium leading-relaxed text-[11px]">
                If you have forgotten your password or need your access granted, please contact:
              </p>
              <p className="font-mono font-bold text-[#0A6473] text-[11px]">
                support@sagecafe.in / Store GM
              </p>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 bg-[#0A6473] text-[#FAF7F2] rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#074D59] transition-colors cursor-pointer border border-[#F3D898]/40 shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default LoginPage;
