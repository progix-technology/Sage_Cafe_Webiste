import React from 'react';
import clsx from 'clsx';
import { Sparkles, Flame, CheckCircle, Clock } from 'lucide-react';

export const DietaryBadge = ({ type = 'veg', className = '' }) => {
  if (type === 'veg') {
    return (
      <span className={clsx("inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30", className)}>
        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 ring-2 ring-emerald-500/30" />
        Veg
      </span>
    );
  }
  if (type === 'non-veg') {
    return (
      <span className={clsx("inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-red-950/80 text-red-400 border border-red-500/30", className)}>
        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 ring-2 ring-red-500/30" />
        Non-Veg
      </span>
    );
  }
  return (
    <span className={clsx("inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-950/80 text-amber-400 border border-amber-500/30", className)}>
      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 ring-2 ring-amber-500/30" />
      Contains Egg
    </span>
  );
};

export const SpiceBadge = ({ level = 0, className = '' }) => {
  if (level <= 0) return null;
  return (
    <span className={clsx("inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-medium bg-red-950/40 text-red-300 border border-red-500/20", className)}>
      <Flame className="w-3 h-3 text-red-500 fill-red-500 shrink-0" />
      <span>{level === 1 ? 'Mild' : level === 2 ? 'Medium Spicy' : 'Fiery Hot'}</span>
    </span>
  );
};

export const SignatureBadge = ({ className = '' }) => (
  <span className={clsx("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gradient-to-r from-brand-amber/20 to-brand-gold/20 text-brand-gold border border-brand-gold/40 shadow-sm", className)}>
    <Sparkles className="w-3 h-3 text-brand-gold animate-pulse" />
    Chef Signature
  </span>
);

export const StatusBadge = ({ isOpen = true, text = '' }) => (
  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-900/90 border border-brand-border text-xs font-medium text-brand-cream/90 backdrop-blur-md">
    <span className="relative flex h-2.5 w-2.5">
      <span className={clsx("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", isOpen ? "bg-emerald-400" : "bg-red-400")} />
      <span className={clsx("relative inline-flex rounded-full h-2.5 w-2.5", isOpen ? "bg-emerald-500" : "bg-red-500")} />
    </span>
    <span>{text || (isOpen ? 'Open Now' : 'Closed for Orders')}</span>
  </div>
);
