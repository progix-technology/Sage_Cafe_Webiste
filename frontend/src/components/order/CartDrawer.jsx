import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, MessageSquare, Phone, Send, Coffee } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useUIStore } from '../../store/useUIStore';
import { CAFE_INFO } from '../../data/mockData';

export const CartDrawer = () => {
  const { isCartOpen, setCartOpen } = useUIStore();
  const { items, updateQty, removeItem, clearCart, getTotalPrice, getTotalCount, generateWhatsAppUrl } = useCartStore();

  const [fulfillment, setFulfillment] = useState('Dine-in (Table Service)');
  const [customerName, setCustomerName] = useState('');
  const [tableNo, setTableNo] = useState('');
  const [notes, setNotes] = useState('');

  if (!isCartOpen) return null;

  const total = getTotalPrice();
  const count = getTotalCount();

  const handleWhatsAppOrder = () => {
    const url = generateWhatsAppUrl({
      fulfillment,
      customerName,
      tableNo,
      notes,
    });
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleCallOrder = () => {
    window.location.href = `tel:${CAFE_INFO.phone.replace(/[^0-9+]/g, '')}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setCartOpen(false)}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-3 sm:pl-10">
        <div className="w-screen max-w-[360px] sm:max-w-md bg-[#140C07] border-l border-[#382216] shadow-2xl flex flex-col justify-between text-[#FAF5EB]">
          
          {/* Header */}
          <div className="p-5 border-b border-[#2A160D] flex items-center justify-between bg-[#1D110A]/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#D4633B] flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-[#FAF5EB]">
                  Your Order Cart
                </h3>
                <p className="text-[11px] text-[#A8988B]">
                  {count} {count === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-[11px] text-[#A8988B] hover:text-red-400 px-2 py-1 transition-colors"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 rounded-full bg-[#1D110A] border border-[#382216] text-[#A8988B] hover:text-[#FAF5EB] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#1D110A] border border-[#382216] flex items-center justify-center text-[#D4633B]">
                  <Coffee className="w-7 h-7" />
                </div>
                <h4 className="font-serif text-lg font-bold text-[#FAF5EB]">
                  Your cart is empty
                </h4>
                <p className="text-xs text-[#A8988B] max-w-xs font-light">
                  Add signature burgers, molten lava cakes, or slow-brewed saffron chai!
                </p>
                <button
                  onClick={() => setCartOpen(false)}
                  className="mt-2 px-6 py-2.5 rounded-full bg-[#D4633B] text-white text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-[#1D110A] border border-[#2E1A10] flex gap-3.5 items-center hover:border-[#D4A373]/40 transition-colors"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover border border-[#382216] shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs sm:text-sm font-semibold text-[#FAF5EB] truncate">
                      {item.name}
                    </h5>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="font-display font-bold text-sm text-[#D4A373]">
                        ₹{item.price * item.qty}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-[#140C07] px-2 py-0.5 rounded-lg border border-[#382216]">
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          className="text-[#A8988B] hover:text-[#FAF5EB]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-[#FAF5EB] min-w-[14px] text-center">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="text-[#A8988B] hover:text-[#FAF5EB]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 text-[#6E5D52] hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & WhatsApp Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#2A160D] bg-[#1D110A] space-y-3.5">
              {/* Fulfillment Switch: Strictly Offline / Dine-in */}
              <div className="grid grid-cols-2 gap-2">
                {['Dine-in (Table Service)', 'Takeaway Pickup'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setFulfillment(mode)}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all ${
                      fulfillment === mode
                        ? 'bg-[#D4633B] text-white shadow-sm'
                        : 'bg-[#140C07] text-[#A8988B] border border-[#2E1A10]'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {/* Dynamic Inputs */}
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#140C07] border border-[#382216] text-xs text-[#FAF5EB] placeholder:text-[#5C4535] focus:outline-none focus:border-[#D4633B]"
                />
                {fulfillment === 'Dine-in (Table Service)' ? (
                  <input
                    type="text"
                    placeholder="Table Number"
                    value={tableNo}
                    onChange={(e) => setTableNo(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-[#140C07] border border-[#382216] text-xs text-[#FAF5EB] placeholder:text-[#5C4535] focus:outline-none focus:border-[#D4633B]"
                  />
                ) : (
                  <input
                    type="text"
                    placeholder="Kitchen Note"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-[#140C07] border border-[#382216] text-xs text-[#FAF5EB] placeholder:text-[#5C4535] focus:outline-none focus:border-[#D4633B]"
                  />
                )}
              </div>

              {/* Total Row */}
              <div className="pt-2 border-t border-[#2A160D] flex items-center justify-between">
                <span className="text-xs text-[#A8988B]">Estimated Total</span>
                <span className="font-display font-bold text-xl text-[#D4A373]">₹{total}</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full py-3.5 rounded-full bg-[#1B365D] hover:bg-[#254b80] text-white font-display text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all border border-[#F4B245]/30"
                >
                  <Send className="w-4 h-4 text-[#F4B245]" /> Submit Order to Host Desk
                </button>

                <button
                  onClick={handleCallOrder}
                  className="w-full py-1.5 text-center text-xs font-medium text-[#A8988B] hover:text-[#FAF5EB] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#D4633B]" /> Call Kitchen: {CAFE_INFO.phone}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
