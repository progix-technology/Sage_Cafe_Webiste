import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, CheckCircle2, ChefHat, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useUIStore } from '../../store/useUIStore';
import { createTableOrder } from '../../services/api';

export const TableOrderModal = () => {
  const { isTableOrderModalOpen, tableOrderInitialDish, closeTableOrderModal } = useUIStore();

  const [tableNo, setTableNo] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [qty, setQty] = useState(1);
  const [dishName, setDishName] = useState('');
  const [dishPrice, setDishPrice] = useState(0);
  const [dishImage, setDishImage] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isTableOrderModalOpen) {
      if (tableOrderInitialDish) {
        setDishName(tableOrderInitialDish.name || 'Artisanal Dish');
        setDishPrice(tableOrderInitialDish.price || 0);
        setDishImage(tableOrderInitialDish.image || '');
      } else {
        setDishName('Chef Special Dish');
        setDishPrice(250);
        setDishImage('');
      }
      setQty(1);
      setSubmitted(false);
      setOrderInfo(null);
      setErrorMessage('');
    }
  }, [isTableOrderModalOpen, tableOrderInitialDish]);

  if (!isTableOrderModalOpen) return null;

  const totalAmount = dishPrice * qty;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!tableNo.trim()) {
      setErrorMessage('Please enter your Table Number.');
      return;
    }
    if (!customerName.trim()) {
      setErrorMessage('Please enter your Name.');
      return;
    }
    if (!customerPhone.trim()) {
      setErrorMessage('Please enter your Mobile Number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        tableNo: tableNo.trim(),
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        items: [
          {
            name: dishName,
            price: dishPrice,
            qty,
            image: dishImage,
          },
        ],
        customItemNotes: notes.trim(),
        totalAmount,
        orderType: 'Dine-in (Table Service)',
      };

      const res = await createTableOrder(payload);
      setIsSubmitting(false);
      setOrderInfo(res?.order || { orderId: `ORD-${Date.now().toString().slice(-6)}`, ...payload });
      setSubmitted(true);

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // ignore
      }
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Failed to place order.');
    }
  };

  const handleClose = () => {
    closeTableOrderModal();
    setSubmitted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-in fade-in duration-150">
      {/* Backdrop Click Dismiss */}
      <div
        onClick={handleClose}
        className="absolute inset-0 bg-transparent cursor-pointer"
        aria-hidden="true"
      />

      {/* Floating Theme Box */}
      <div className="relative w-full max-w-[360px] max-h-[92vh] overflow-y-auto bg-[#084854] border-2 border-[#F3D898]/70 rounded-3xl p-4 sm:p-5 shadow-[0_25px_80px_rgba(0,0,0,0.75)] text-white animate-in zoom-in-95 duration-150 z-10">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-[#05353E] border border-white/20 text-white/80 hover:text-white hover:border-[#F3D898] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Header */}
            <div className="pr-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#F3D898] flex items-center gap-1.5">
                <ChefHat className="w-3.5 h-3.5 text-[#F3D898]" /> Table Dining &bull; Order
              </span>
              <h3 
                className="text-xl sm:text-2xl font-normal text-white mt-1 leading-snug"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Confirm Your Order
              </h3>
            </div>

            {/* Selected Dish Compact Bar */}
            <div className="p-2.5 rounded-2xl bg-[#05353E] border border-white/15 flex items-center justify-between gap-2.5">
              {dishImage && (
                <img
                  src={dishImage}
                  alt={dishName}
                  className="w-10 h-10 rounded-xl object-cover border border-white/20 shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-white truncate">
                  {dishName}
                </h4>
                <span className="text-xs text-[#F3D898] font-bold font-sans">
                  ₹{dishPrice}
                </span>
              </div>

              {/* Quantity (+/-) */}
              <div className="flex items-center gap-1.5 bg-[#03242A] px-2 py-1 rounded-xl border border-white/15 shrink-0">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="text-white/80 hover:text-[#F3D898] text-xs font-bold cursor-pointer"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-xs font-bold text-white min-w-[14px] text-center">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty(qty + 1)}
                  className="text-white/80 hover:text-[#F3D898] text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* 3 Quick Input Fields */}
            <div className="space-y-2.5">
              {/* Table Number */}
              <div>
                <label className="block text-[11px] font-semibold text-[#F3D898] mb-1">
                  Table Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Table 4 or T-2"
                  value={tableNo}
                  onChange={(e) => setTableNo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#05353E] border border-white/20 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#F3D898]"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-[11px] font-semibold text-[#F3D898] mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vivang Mishra"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#05353E] border border-white/20 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#F3D898]"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-[11px] font-semibold text-[#F3D898] mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#05353E] border border-white/20 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#F3D898]"
                />
              </div>

              {/* Optional Note */}
              <div>
                <input
                  type="text"
                  placeholder="Special note (e.g. Less spicy, extra hot)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-[#05353E] border border-white/20 text-[11px] text-white placeholder-white/40 focus:outline-none focus:border-[#F3D898]"
                />
              </div>
            </div>

            {/* Error Alert */}
            {errorMessage && (
              <div className="p-2 rounded-xl bg-red-950/70 border border-red-400/50 flex items-center gap-1.5 text-red-200 text-[11px]">
                <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-full bg-[#F3D898] hover:bg-white text-[#0A6473] font-bold text-xs uppercase tracking-wider transition-all duration-150 shadow-lg active:scale-95 flex items-center justify-between px-5 cursor-pointer"
              >
                <span>{isSubmitting ? 'Sending...' : 'Place Order'}</span>
                <span className="bg-[#0A6473]/15 px-2 py-0.5 rounded-md font-extrabold text-[11px] text-[#0A6473]">
                  ₹{totalAmount}
                </span>
              </button>
            </div>

          </form>
        ) : (
          /* Confirmation Mini Card */
          <div className="py-4 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#05353E] border border-[#F3D898] mx-auto flex items-center justify-center text-[#F3D898]">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h4 
                className="text-xl font-normal text-white"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Order Sent to Kitchen!
              </h4>
              <p className="text-[11px] text-white/80 mt-1">
                Table: <strong className="text-[#F3D898]">{orderInfo?.tableNo}</strong> &bull; {qty}x {dishName}
              </p>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-2.5 rounded-full bg-[#F3D898] hover:bg-white text-[#0A6473] font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md transition-colors"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default TableOrderModal;
