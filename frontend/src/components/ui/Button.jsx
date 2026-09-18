import React from 'react';
import clsx from 'clsx';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-display font-semibold transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-amber/50 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variants = {
    primary: 'bg-brand-amber text-brand-950 hover:bg-brand-gold shadow-glow-amber hover:shadow-glow-gold hover:-translate-y-0.5',
    secondary: 'bg-brand-800 text-brand-cream hover:bg-brand-700 border border-brand-border hover:border-brand-amber/40',
    gold: 'bg-gradient-to-r from-brand-gold via-brand-amber to-brand-terracotta text-brand-950 font-bold shadow-glow-gold hover:opacity-95 hover:-translate-y-0.5',
    outline: 'border border-brand-amber/60 text-brand-amber hover:bg-brand-amber hover:text-brand-950',
    ghost: 'text-brand-cream/80 hover:text-brand-gold hover:bg-brand-800/40',
    dark: 'bg-brand-950/80 backdrop-blur-md text-brand-cream border border-brand-border hover:border-brand-gold/50',
    danger: 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3.5 gap-2.5 shadow-lg',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
};
