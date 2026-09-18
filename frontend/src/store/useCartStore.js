import { create } from 'zustand';
import { CAFE_INFO } from '../data/mockData';

export const useCartStore = create((set, get) => ({
  items: [],

  addItem: (item, qty = 1) => {
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, qty: i.qty + qty } : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            id: item.id,
            name: item.name,
            price: item.price,
            qty,
            dietaryType: item.dietaryType,
            image: item.images?.[0] || '',
            category: item.category,
            spiceLevel: item.spiceLevel,
          },
        ],
      };
    });
  },

  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    }));
  },

  updateQty: (id, qty) => {
    if (qty <= 0) {
      get().removeItem(id);
      return;
    }
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, qty } : i)),
    }));
  },

  clearCart: () => set({ items: [] }),

  getTotalPrice: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.price * item.qty, 0);
  },

  getTotalCount: () => {
    const { items } = get();
    return items.reduce((count, item) => count + item.qty, 0);
  },

  generateWhatsAppUrl: ({ fulfillment = 'Takeaway Pickup', customerName = '', tableNo = '', notes = '' }) => {
    const { items, getTotalPrice } = get();
    if (items.length === 0) return '';

    const total = getTotalPrice();
    const itemList = items
      .map((i) => `• ${i.name} × ${i.qty} — ₹${i.price * i.qty}`)
      .join('\n');

    const message = `*SAGĒ CAFÉ ORDER REQUEST*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `*Type:* ${fulfillment}\n` +
      (customerName ? `*Name:* ${customerName}\n` : '') +
      (tableNo ? `*Table Number:* ${tableNo}\n` : '') +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `*Items:*\n${itemList}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `*Estimated Total:* ₹${total}\n` +
      (notes ? `\n*Special Instructions:* ${notes}\n` : '') +
      `\n_Sent via Sagē Café Web App_`;

    return `https://wa.me/${CAFE_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;
  },
}));
