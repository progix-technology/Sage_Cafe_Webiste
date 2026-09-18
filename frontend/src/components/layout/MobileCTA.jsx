import React from 'react';
import { ShoppingBag, Phone, MessageSquare, Utensils } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useUIStore } from '../../store/useUIStore';
import { CAFE_INFO } from '../../data/mockData';

export const MobileCTA = () => {
  const totalCount = useCartStore((state) => state.getTotalCount());
  const totalPrice = useCartStore((state) => state.getTotalPrice());
  const { toggleCart } = useUIStore();

  const handleCall = () => {
    window.location.href = `tel:${CAFE_INFO.phone.replace(/[^0-9+]/g, '')}`;
  };

  const handleConciergeMessage = () => {
    const defaultMsg = encodeURIComponent('Hello Sagē Café! I would like to check table availability and menu details.');
    window.open(`https://wa.me/${CAFE_INFO.whatsappNumber}?text=${defaultMsg}`, '_blank');
  };

  return (
    <aside aria-label="Quick mobile actions" className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-2.5 bg-brand-950/95 border-t border-brand-border backdrop-blur-xl shadow-2xl">
      <div className="flex items-center gap-2">
        {/* Quick Call */}
        <button
          onClick={handleCall}
          className="flex-1 py-2.5 px-3 rounded-xl bg-brand-900/90 border border-brand-border text-brand-cream hover:text-brand-gold flex items-center justify-center gap-1.5 text-xs font-semibold active:scale-95 transition-all"
        >
          <Phone className="w-4 h-4 text-emerald-400" />
          <span>Call Host</span>
        </button>

        {/* Concierge Desk Direct */}
        <button
          onClick={handleConciergeMessage}
          className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 flex items-center justify-center gap-1.5 text-xs font-semibold active:scale-95 transition-all"
        >
          <MessageSquare className="w-4 h-4 text-[#F4B245]" />
          <span>Concierge</span>
        </button>

        {/* Cart Trigger */}
        <button
          onClick={toggleCart}
          className="flex-[1.4] py-2.5 px-3 rounded-xl bg-gradient-to-r from-brand-amber via-brand-gold to-brand-amber text-brand-950 flex items-center justify-between gap-1 text-xs font-bold shadow-glow-amber active:scale-95 transition-all"
        >
          <div className="flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4" />
            <span>{totalCount > 0 ? `${totalCount} items` : 'Order'}</span>
          </div>
          {totalPrice > 0 ? (
            <span className="bg-brand-950/20 px-1.5 py-0.5 rounded font-black">₹{totalPrice}</span>
          ) : (
            <span className="text-[10px] uppercase font-black tracking-wider">Cart</span>
          )}
        </button>
      </div>
    </aside>
  );
};
