import React, { useState } from 'react';
import { X, Calendar, Clock, Users, Phone, User, CheckCircle2, Sparkles, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useUIStore } from '../../store/useUIStore';
import { CAFE_INFO } from '../../data/mockData';

export const ReservationModal = () => {
  const { isReserveModalOpen, closeReserveModal } = useUIStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    time: '19:30',
    guests: 2,
    specialRequests: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isReserveModalOpen) return null;

  const timeSlots = [
    '12:00 PM', '01:00 PM', '02:00 PM', '04:00 PM', '05:30 PM',
    '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:30 PM', '10:30 PM'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore
      }
    }, 500);
  };

  const handleWhatsAppConfirm = () => {
    const text = encodeURIComponent(
      `*SAGĒ CAFÉ — TABLE RESERVATION REQUEST*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `*Name:* ${formData.name}\n` +
      `*Phone:* ${formData.phone}\n` +
      `*Date:* ${formData.date}\n` +
      `*Time:* ${formData.time}\n` +
      `*Guests:* ${formData.guests} Persons\n` +
      (formData.specialRequests ? `*Special Request:* ${formData.specialRequests}\n` : '') +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `_Please confirm my table reservation at Sagē Café, Hazratganj Lucknow._`
    );
    window.open(`https://wa.me/${CAFE_INFO.whatsappNumber}?text=${text}`, '_blank');
  };

  const handleReset = () => {
    setIsSubmitted(false);
    closeReserveModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-[#140C07] border border-[#382216] rounded-3xl p-5 sm:p-8 shadow-2xl text-[#FAF5EB]">
        
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#1D110A] border border-[#382216] text-[#A8988B] hover:text-[#FAF5EB] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="mb-6 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4633B]">
                Direct Table Booking
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF5EB]">
                Reserve Your Spot
              </h3>
              <p className="text-xs text-[#A8988B]">
                Pull up a chair for slow conversations and artisanal dining.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#A8988B] mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Vivang Mishra"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D110A] border border-[#382216] text-xs text-[#FAF5EB] placeholder:text-[#5C4535] focus:outline-none focus:border-[#D4633B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#A8988B] mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D110A] border border-[#382216] text-xs text-[#FAF5EB] placeholder:text-[#5C4535] focus:outline-none focus:border-[#D4633B]"
                  />
                </div>
              </div>

              {/* Date & Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#A8988B] mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D110A] border border-[#382216] text-xs text-[#FAF5EB] focus:outline-none focus:border-[#D4633B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A8988B] mb-1">
                    Party Size
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 4, 6, 8].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setFormData({ ...formData, guests: num })}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                          formData.guests === num
                            ? 'bg-[#D4633B] text-white shadow-md'
                            : 'bg-[#1D110A] text-[#FAF5EB] border border-[#382216]'
                        }`}
                      >
                        {num}{num === 8 ? '+' : ''}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-xs font-semibold text-[#A8988B] mb-1">
                  Time Slot
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {timeSlots.slice(0, 8).map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setFormData({ ...formData, time: slot })}
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                        formData.time === slot
                          ? 'bg-[#D4A373] text-[#140C07] font-bold'
                          : 'bg-[#1D110A] text-[#A8988B] border border-[#382216] hover:text-[#FAF5EB]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-xs font-semibold text-[#A8988B] mb-1">
                  Seating / Dietary Note (Optional)
                </label>
                <input
                  type="text"
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  placeholder="e.g. Quiet booth, celebration"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D110A] border border-[#382216] text-xs text-[#FAF5EB] placeholder:text-[#5C4535] focus:outline-none focus:border-[#D4633B]"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full bg-[#D4633B] hover:bg-[#B64E29] text-white font-display text-xs font-bold uppercase tracking-widest transition-all duration-200 shadow-md active:scale-95"
                >
                  {isSubmitting ? 'Confirming...' : 'Confirm Reservation'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation State */
          <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#FAF5EB]">
              Reservation Logged!
            </h3>

            <div className="p-4 rounded-2xl bg-[#1D110A] border border-[#382216] text-left space-y-2 text-xs">
              <p className="flex justify-between">
                <span className="text-[#8A796D]">Guest:</span>
                <span className="font-semibold text-[#FAF5EB]">{formData.name}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-[#8A796D]">Date & Time:</span>
                <span className="font-semibold text-[#D4A373]">{formData.date} at {formData.time}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-[#8A796D]">Party Size:</span>
                <span className="font-semibold text-[#FAF5EB]">{formData.guests} Guests</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={handleWhatsAppConfirm}
                className="flex-1 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-4 h-4" /> Notify Host Desk
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-3 rounded-full bg-[#1D110A] border border-[#382216] text-[#FAF5EB] font-bold text-xs uppercase tracking-wider hover:bg-[#2A160D] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
