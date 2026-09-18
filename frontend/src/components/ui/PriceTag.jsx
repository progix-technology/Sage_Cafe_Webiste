import React from 'react';
import clsx from 'clsx';

export const PriceTag = ({ price, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'text-sm font-semibold',
    md: 'text-lg font-bold',
    lg: 'text-2xl font-black',
    xl: 'text-3xl font-extrabold',
  };

  return (
    <span className={clsx("font-display text-brand-gold inline-flex items-baseline tracking-tight", sizes[size], className)}>
      <span className="text-[0.75em] mr-0.5 opacity-80 font-normal">₹</span>
      <span>{price}</span>
    </span>
  );
};
