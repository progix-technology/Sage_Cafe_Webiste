import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isCartOpen: false,
  isReserveModalOpen: false,
  isTableOrderModalOpen: false,
  tableOrderInitialDish: null,
  isMobileMenuOpen: false,
  isQuickSearchOpen: false,
  selectedCategory: 'all',
  activeDietFilter: 'all', // 'all', 'veg', 'non-veg'
  searchQuery: '',
  soundEnabled: false,

  setCartOpen: (val) => set({ isCartOpen: val }),
  openCart: () => set({ isCartOpen: true }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  setReserveModalOpen: (val) => set({ isReserveModalOpen: val }),
  openReserveModal: () => set({ isReserveModalOpen: true }),
  closeReserveModal: () => set({ isReserveModalOpen: false }),

  openTableOrderModal: (dish = null) =>
    set({ isTableOrderModalOpen: true, tableOrderInitialDish: dish }),
  closeTableOrderModal: () =>
    set({ isTableOrderModalOpen: false, tableOrderInitialDish: null }),

  setMobileMenuOpen: (val) => set({ isMobileMenuOpen: val }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  setQuickSearchOpen: (val) => set({ isQuickSearchOpen: val }),
  setSelectedCategory: (cat) => set({ selectedCategory: cat }),
  setActiveDietFilter: (diet) => set({ activeDietFilter: diet }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
}));
