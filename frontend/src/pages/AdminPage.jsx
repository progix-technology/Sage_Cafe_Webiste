import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, Calendar, MessageSquare, Coffee, Clock, Settings, LogOut, 
  Menu as MenuIcon, Bell, ChevronDown, Plus, Eye, Mail, MoreHorizontal, 
  Check, X, Send, Phone, Trash2, Search, Save, RefreshCw, ExternalLink,
  CheckCircle2, XCircle, Users, Tag, Sparkles, MapPin, AlertCircle,
  Upload, FileText, Download, Cloud, Link as LinkIcon, Loader2,
  Layers, Utensils, Cake, CupSoda, PhoneCall, ChefHat, ShoppingBag, Printer,
  User, Ticket, CreditCard, ShieldCheck, Star
} from 'lucide-react';
import { MENU_ITEMS as initialMenuItems, CAFE_INFO as initialCafeInfo } from '../data/mockData';
import { DietaryBadge } from '../components/ui/Badge';
import { 
  getReservations, 
  updateReservationStatus as apiUpdateReservationStatus, 
  getContactMessages,
  updateContactStatus as apiUpdateContactStatus,
  deleteContactMessage as apiDeleteContactMessage,
  createReservation as apiCreateReservation,
  getMenuPdf,
  uploadMenuPdf,
  setMenuPdfUrl,
  deleteMenuPdf,
  getTableOrders,
  updateOrderStatus as apiUpdateOrderStatus,
  deleteTableOrder as apiDeleteTableOrder,
  getEvents as apiGetEvents,
  createEvent as apiCreateEvent,
  updateEvent as apiUpdateEvent,
  deleteEvent as apiDeleteEvent,
  getEventBookings as apiGetEventBookings,
  deleteEventBooking as apiDeleteEventBooking
} from '../services/api';

import { ASSETS } from '../assets/images';
import { LoginPage } from './LoginPage';

export const AdminPage = () => {
  const navigate = useNavigate();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('sage_staff_token'));
  const [adminUser, setAdminUser] = useState({ name: 'Vivang Mishra', role: 'Admin', email: 'owner@sagecafe.com' });

  // Navigation State
  const [activeTab, setActiveTab] = useState('reservations'); // 'dashboard', 'reservations', 'messages', 'menu', 'cms', 'settings'
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Live Clock & Date State
  const [currentTime, setCurrentTime] = useState(new Date());

  // Data State
  const [reservations, setReservations] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [tableOrders, setTableOrders] = useState([]);
  const [eventsList, setEventsList] = useState([]);
  const [eventBookings, setEventBookings] = useState([]);
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [cafeInfo, setCafeInfo] = useState(initialCafeInfo);
  const [loadingData, setLoadingData] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [orderFilter, setOrderFilter] = useState('all'); // 'all', 'pending', 'preparing', 'served', 'completed'
  const [orderSearch, setOrderSearch] = useState('');

  // Events & Ticket Management State
  const [eventTabSubView, setEventTabSubView] = useState('events'); // 'events' or 'bookings'
  const [eventSearch, setEventSearch] = useState('');
  const [eventCategoryFilter, setEventCategoryFilter] = useState('all');
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [savingEvent, setSavingEvent] = useState(false);
  const [eventImageFile, setEventImageFile] = useState(null);
  const [eventImagePreview, setEventImagePreview] = useState('');
  const [viewBookingModal, setViewBookingModal] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    category: 'music',
    tag: 'SPECIAL EVENT',
    host: '',
    date: '',
    time: '07:30 PM – 10:30 PM',
    location: 'Terrace Pergola & Cocktail Lounge',
    price: '₹250 / guest',
    includes: 'Welcome drink & snack platter',
    totalSpots: 20,
    spotsLeft: 20,
    description: '',
    featured: false,
    status: 'published'
  });

  // Menu PDF State (Cloudinary CMS - Multi-Section Support)
  const [selectedPdfCategory, setSelectedPdfCategory] = useState('all');
  const [menuPdfData, setMenuPdfData] = useState({
    hasMenuPdf: false,
    menuPdfUrl: '',
    sections: {
      all: null,
      breakfast: null,
      'lunch-dinner': null,
      dessert: null,
      beverages: null,
    }
  });
  const [selectedPdfFile, setSelectedPdfFile] = useState(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [directPdfUrlInput, setDirectPdfUrlInput] = useState('');
  const [directPdfNameInput, setDirectPdfNameInput] = useState('');
  const [savingDirectPdf, setSavingDirectPdf] = useState(false);
  const [showDirectUrlField, setShowDirectUrlField] = useState(false);

  // Filters
  const [resFilter, setResFilter] = useState('all'); // 'all', 'new', 'confirmed', 'declined'
  const [messageFilter, setMessageFilter] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');

  // Modals & Popovers
  const [viewResModal, setViewResModal] = useState(null);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [selectedResForCustom, setSelectedResForCustom] = useState(null);
  const [modalCustomMsg, setModalCustomMsg] = useState('');
  const [modalAltTime, setModalAltTime] = useState('');
  const [modalAltDate, setModalAltDate] = useState('');
  const [sendingCustomEmail, setSendingCustomEmail] = useState(false);
  const [activeActionMenuId, setActiveActionMenuId] = useState(null);
  const [newResModalOpen, setNewResModalOpen] = useState(false);
  const [newResForm, setNewResForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    time: '07:30 PM',
    guests: '2',
    experience: 'Main Artisanal Dining Room',
    specialRequests: ''
  });

  // Ticking Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Check Auth & Start Polling
  useEffect(() => {
    const token = localStorage.getItem('sage_staff_token');
    const user = localStorage.getItem('sage_staff_user');
    if (token) {
      setIsAuthenticated(true);
      if (user) {
        try {
          const parsed = JSON.parse(user);
          setAdminUser(parsed);
        } catch (e) {}
      }
      loadDashboardData();

      // Auto poll every 6 seconds
      const interval = setInterval(() => {
        loadDashboardData(true);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = () => setActiveActionMenuId(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const loadDashboardData = async (silent = false) => {
    if (!silent) setLoadingData(true);
    try {
      const resData = await getReservations();
      if (resData && Array.isArray(resData)) {
        setReservations(resData);
      }

      const msgData = await getContactMessages();
      if (msgData && Array.isArray(msgData)) {
        setContacts(msgData);
      }

      const ordersData = await getTableOrders();
      if (ordersData && Array.isArray(ordersData)) {
        setTableOrders(ordersData);
      }

      const eventsData = await apiGetEvents();
      if (eventsData && Array.isArray(eventsData)) {
        setEventsList(eventsData);
      }

      const bookingsData = await apiGetEventBookings();
      if (bookingsData && Array.isArray(bookingsData)) {
        setEventBookings(bookingsData);
      }

      const pdfData = await getMenuPdf();
      if (pdfData && pdfData.success) {
        setMenuPdfData(pdfData);
      }
    } catch (err) {
      if (!silent) console.error('Failed to load data:', err);
    } finally {
      if (!silent) setLoadingData(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await apiUpdateOrderStatus(orderId, newStatus);
      await loadDashboardData(true);
      showToast(`Order status updated to ${newStatus.toUpperCase()}`);
    } catch (err) {
      showToast(`${err.message || 'Failed to update order status'}`);
    }
  };

  const handleDeleteTableOrder = async (orderId) => {
    if (!window.confirm('Delete this order ticket from kitchen desk?')) return;
    try {
      await apiDeleteTableOrder(orderId);
      await loadDashboardData(true);
      showToast('Table order ticket removed.');
    } catch (err) {
      showToast('Table order ticket removed.');
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleLogout = () => {
    localStorage.removeItem('sage_staff_token');
    localStorage.removeItem('sage_staff_user');
    setIsAuthenticated(false);
    navigate('/');
  };

  // Status Change Handler
  const handleUpdateStatus = async (id, status, customNote = '') => {
    setReservations((prev) =>
      prev.map((r) => (r._id === id || r.id === id ? { ...r, status } : r))
    );
    try {
      await apiUpdateReservationStatus(id, { status, customNote });
      if (status === 'confirmed') {
        showToast('Reservation confirmed! Email sent to guest.');
      } else if (status === 'declined') {
        showToast('Reservation declined (Will auto-delete in 24 hours).');
      } else {
        showToast(`Status updated to ${status.toUpperCase()}`);
      }
    } catch (err) {
      showToast('Status updated');
    }
  };

  // Open Custom Modal
  const openCustomModalForRes = (res) => {
    setSelectedResForCustom(res);
    setModalCustomMsg('');
    setModalAltTime(res.time || '08:30 PM');
    setModalAltDate(res.date || '');
    setCustomModalOpen(true);
  };

  // Send Custom Reschedule Email
  const handleSendCustomResEmail = async (actionType = 'update') => {
    if (!selectedResForCustom) return;
    const resId = selectedResForCustom._id || selectedResForCustom.id;
    setSendingCustomEmail(true);

    try {
      const payload = {
        status: actionType === 'confirm' ? 'confirmed' : 'new',
        customMessage: modalCustomMsg.trim(),
        customNote: modalCustomMsg.trim(),
        alternateTime: modalAltTime.trim() !== selectedResForCustom.time ? modalAltTime.trim() : '',
        alternateDate: modalAltDate.trim() !== selectedResForCustom.date ? modalAltDate.trim() : '',
        sendCustomEmail: actionType === 'update',
      };

      await apiUpdateReservationStatus(resId, payload);
      
      setReservations((prev) =>
        prev.map((r) =>
          r._id === resId || r.id === resId
            ? {
                ...r,
                status: payload.status,
                time: modalAltTime.trim() || r.time,
                date: modalAltDate.trim() || r.date,
              }
            : r
        )
      );

      showToast(`Email update sent to ${selectedResForCustom.name}!`);
      setCustomModalOpen(false);
    } catch (err) {
      showToast('Failed to send email update');
    } finally {
      setSendingCustomEmail(false);
    }
  };

  // WhatsApp Concierge Link
  const openWhatsAppConfirmation = (res) => {
    const cleanPhone = (res.phone || '').replace(/[^0-9]/g, '');
    const bookingId = res._id?.slice(-4) || res.id || 'SAGE';
    const text = encodeURIComponent(
      `*SAGĒ CAFÉ & ROASTERY — HOST DESK CONCIERGE*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `*Booking Ref:* #${bookingId}\n` +
      `*Guest:* ${res.name}\n` +
      `*Date:* ${res.date} at ${res.time}\n` +
      `*Party Size:* ${res.guests} Guests\n` +
      `*Seating Area:* ${res.experience || 'Main Dining'}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Hello ${res.name}, our host concierge has reviewed your table request. We look forward to welcoming you to Sagē Café Hazratganj!`
    );
    window.open(`https://wa.me/${cleanPhone || '915224028899'}?text=${text}`, '_blank');
  };

  // Create Manual Reservation
  const handleCreateNewReservation = async (e) => {
    e.preventDefault();
    try {
      const res = await apiCreateReservation(newResForm);
      if (res && res.reservation) {
        setReservations((prev) => [res.reservation, ...prev]);
        showToast('New reservation created & added to feed!');
      } else {
        loadDashboardData(true);
        showToast('Reservation booked!');
      }
      setNewResModalOpen(false);
      setNewResForm({
        name: '',
        email: '',
        phone: '',
        date: new Date().toISOString().split('T')[0],
        time: '07:30 PM',
        guests: '2',
        experience: 'Main Artisanal Dining Room',
        specialRequests: ''
      });
    } catch (err) {
      showToast('Error booking reservation');
    }
  };

  // Contact Inquiries Handlers
  const handleUpdateContactStatus = async (id, status) => {
    setContacts((prev) =>
      prev.map((c) => (c._id === id || c.id === id ? { ...c, status } : c))
    );
    try {
      await apiUpdateContactStatus(id, status);
      showToast(`Inquiry marked as ${status.toUpperCase()}`);
    } catch (err) {
      showToast(`Status updated`);
    }
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return;
    setContacts((prev) => prev.filter((c) => c._id !== id && c.id !== id));
    try {
      await apiDeleteContactMessage(id);
      showToast('Inquiry deleted');
    } catch (err) {}
  };

  // Menu Handlers
  const toggleAvailability = (id) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, isAvailable: !item.isAvailable };
          showToast(`"${item.name}" stock updated`);
          return updated;
        }
        return item;
      })
    );
  };

  const updatePrice = (id, newPrice) => {
    const parsed = parseInt(newPrice, 10);
    if (isNaN(parsed) || parsed < 0) return;
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, price: parsed } : item))
    );
    showToast('Price updated');
  };

  // Menu PDF Management Handlers
  const handlePdfFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      showToast('Please select a valid PDF file (.pdf)');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      showToast('File size exceeds 25MB limit');
      return;
    }
    setSelectedPdfFile(file);
    showToast(`Selected: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
  };

  const handleUploadMenuPdf = async () => {
    if (!selectedPdfFile) {
      showToast('Please select a PDF file to upload first.');
      return;
    }
    setUploadingPdf(true);
    try {
      const formData = new FormData();
      formData.append('menuPdf', selectedPdfFile);
      formData.append('section', selectedPdfCategory);
      const res = await uploadMenuPdf(formData);
      if (res.success) {
        await loadDashboardData(true);
        setSelectedPdfFile(null);
        showToast(`${selectedPdfCategory.toUpperCase()} PDF uploaded to Cloudinary successfully!`);
      } else {
        showToast(res.message || 'Failed to upload PDF menu.');
      }
    } catch (err) {
      showToast(`${err.message || 'Failed to upload to Cloudinary'}`);
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleSaveDirectPdfUrl = async (e) => {
    e?.preventDefault();
    if (!directPdfUrlInput.trim()) {
      showToast('Please enter a valid PDF URL');
      return;
    }
    setSavingDirectPdf(true);
    try {
      const res = await setMenuPdfUrl({
        url: directPdfUrlInput.trim(),
        name: directPdfNameInput.trim() || `Official ${selectedPdfCategory.toUpperCase()} Menu`,
        section: selectedPdfCategory
      });
      if (res.success) {
        await loadDashboardData(true);
        setShowDirectUrlField(false);
        setDirectPdfUrlInput('');
        showToast(`PDF link saved for ${selectedPdfCategory.toUpperCase()}!`);
      }
    } catch (err) {
      showToast(`${err.message || 'Failed to save PDF link'}`);
    } finally {
      setSavingDirectPdf(false);
    }
  };

  const handleDeleteMenuPdf = async (sectionKey = 'all') => {
    if (!window.confirm(`Remove attached PDF menu for ${sectionKey.toUpperCase()}?`)) {
      return;
    }
    try {
      await deleteMenuPdf(sectionKey);
      await loadDashboardData(true);
      showToast(`${sectionKey.toUpperCase()} PDF menu unlinked.`);
    } catch (err) {
      showToast('PDF menu unlinked.');
    }
  };

  // =========================================================================
  // EVENT MANAGEMENT ACTION HANDLERS (Cloudinary Upload & MongoDB Storage)
  // =========================================================================
  const openCreateEventModal = () => {
    setEditingEventId(null);
    setEventImageFile(null);
    setEventImagePreview('');
    setEventForm({
      title: '',
      category: 'music',
      tag: 'SPECIAL EVENT',
      host: '',
      date: '',
      time: '07:30 PM – 10:30 PM',
      location: 'Terrace Pergola & Cocktail Lounge',
      price: '₹250 / guest',
      includes: 'Welcome drink & snack platter',
      totalSpots: 20,
      spotsLeft: 20,
      description: '',
      featured: false,
      status: 'published'
    });
    setEventModalOpen(true);
  };

  const openEditEventModal = (evt) => {
    setEditingEventId(evt._id || evt.id);
    setEventImageFile(null);
    setEventImagePreview(evt.image || '');
    setEventForm({
      title: evt.title || '',
      category: evt.category || 'music',
      tag: evt.tag || 'SPECIAL EVENT',
      host: evt.host || '',
      date: evt.date || '',
      time: evt.time || '07:30 PM – 10:30 PM',
      location: evt.location || 'Terrace Pergola & Cocktail Lounge',
      price: evt.price || '₹250 / guest',
      includes: evt.includes || 'Welcome drink & snack platter',
      totalSpots: evt.totalSpots ?? 20,
      spotsLeft: evt.spotsLeft ?? evt.totalSpots ?? 20,
      description: evt.description || '',
      featured: !!evt.featured,
      status: evt.status || 'published'
    });
    setEventModalOpen(true);
  };

  const handleEventImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file');
      return;
    }
    setEventImageFile(file);
    setEventImagePreview(URL.createObjectURL(file));
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!eventForm.title.trim()) {
      showToast('Please enter an event title');
      return;
    }

    setSavingEvent(true);
    try {
      const formData = new FormData();
      Object.keys(eventForm).forEach((key) => {
        formData.append(key, eventForm[key]);
      });
      if (eventImageFile) {
        formData.append('image', eventImageFile);
      }

      if (editingEventId) {
        await apiUpdateEvent(editingEventId, formData);
        showToast('Event updated successfully in database!');
      } else {
        await apiCreateEvent(formData);
        showToast('New gathering created and published live!');
      }

      setEventModalOpen(false);
      await loadDashboardData(true);
    } catch (err) {
      showToast(`${err.message || 'Failed to save event.'}`);
    } finally {
      setSavingEvent(false);
    }
  };

  const handleDeleteEvent = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete event "${title}"?`)) return;
    try {
      await apiDeleteEvent(id);
      await loadDashboardData(true);
      showToast('Event removed from database.');
    } catch (err) {
      showToast(`${err.message || 'Failed to delete event.'}`);
    }
  };

  const handleDeleteEventBooking = async (id, guestName) => {
    if (!window.confirm(`Delete booking pass for "${guestName}"?`)) return;
    try {
      await apiDeleteEventBooking(id);
      await loadDashboardData(true);
      showToast('Attendee booking pass deleted.');
    } catch (err) {
      showToast(`${err.message || 'Failed to delete booking.'}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLoginSuccess={(user) => {
          setIsAuthenticated(true);
          if (user) setAdminUser(user);
          loadDashboardData();
        }}
      />
    );
  }

  // Filtered Lists
  const filteredReservations = reservations.filter((r) => {
    if (resFilter === 'all') return true;
    return r.status === resFilter;
  });

  const pendingCount = reservations.filter((r) => r.status === 'new').length;
  const confirmedCount = reservations.filter((r) => r.status === 'confirmed').length;
  const declinedCount = reservations.filter((r) => r.status === 'declined').length;
  const unreadContactCount = contacts.filter((c) => c.status === 'unread').length;

  // Table Order Metrics & Filtered List
  const pendingOrdersCount = tableOrders.filter((o) => o.status === 'pending').length;
  const preparingOrdersCount = tableOrders.filter((o) => o.status === 'preparing').length;
  const servedOrdersCount = tableOrders.filter((o) => o.status === 'served').length;
  const completedOrdersCount = tableOrders.filter((o) => o.status === 'completed').length;

  const filteredTableOrders = tableOrders.filter((order) => {
    if (orderFilter !== 'all' && order.status !== orderFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      const matchTable = (order.tableNo || '').toLowerCase().includes(q);
      const matchName = (order.customerName || '').toLowerCase().includes(q);
      const matchPhone = (order.customerPhone || '').includes(q);
      const matchId = (order.orderId || '').toLowerCase().includes(q);
      if (!matchTable && !matchName && !matchPhone && !matchId) return false;
    }
    return true;
  });

  const filteredMenuItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    item.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // Formatted date and time strings for header
  const formattedDayDate = currentTime.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="h-screen w-screen max-h-screen overflow-hidden flex bg-[#F1F5F9] text-[#0F172A] font-sans antialiased selection:bg-[#E58B20] selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#0D1C32] text-[#F4B245] font-semibold shadow-2xl text-xs flex items-center gap-2.5 animate-in slide-in-from-top duration-300 border border-[#F4B245]/30">
          <CheckCircle2 className="w-4 h-4 text-[#F4B245] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs lg:hidden cursor-pointer"
        />
      )}

      {/* ========================================================================= */}
      {/* 1. LEFT SAPPHIRE-NAVY & SLATE SIDEBAR */}
      {/* ========================================================================= */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#0B1728] text-white flex flex-col justify-between shrink-0 shadow-2xl transition-transform duration-300 overflow-hidden select-none border-r border-[#1E293B] ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        
        {/* Subtle Background Leaf Botanical Line Art at Bottom Left */}
        <div className="absolute bottom-16 -left-10 w-48 h-48 opacity-10 pointer-events-none filter invert brightness-150">
          <img src={ASSETS.monsteraLeaf} alt="" className="w-full h-full object-contain rotate-45" />
        </div>

        {/* Top: Brand Logo & Navigation */}
        <div className="p-5 space-y-7 relative z-10">
          
          {/* Main Official White Brand Logo */}
          <div className="flex flex-col items-center justify-center pt-2 pb-1">
            <img
              src={ASSETS.cafeName}
              alt="Sagē Café"
              className="h-10 sm:h-12 w-auto object-contain filter brightness-0 invert drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
            />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {/* Live Table Orders (Kitchen Desk) */}
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#1B365D] text-white shadow-md font-semibold ring-1 ring-white/10'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <ChefHat className="w-4 h-4 text-[#F4B245]" />
                <span>Live Table Orders</span>
              </div>
              {pendingOrdersCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E58B20] text-white animate-pulse">
                  {pendingOrdersCount} New
                </span>
              ) : tableOrders.length > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-slate-300">
                  {tableOrders.length}
                </span>
              ) : null}
            </button>

            {/* Reservations */}
            <button
              onClick={() => setActiveTab('reservations')}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                activeTab === 'reservations'
                  ? 'bg-[#1B365D] text-white shadow-md font-semibold ring-1 ring-white/10'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[#F4B245]" />
                <span>Reservations</span>
              </div>
              {pendingCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#E58B20] animate-pulse" />
              )}
            </button>

            {/* Inquiries */}
            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                activeTab === 'messages'
                  ? 'bg-[#1B365D] text-white shadow-md font-semibold ring-1 ring-white/10'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-[#F4B245]" />
                <span>Inquiries</span>
              </div>
              {unreadContactCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F4B245] text-[#0B1728]">
                  {unreadContactCount}
                </span>
              )}
            </button>

            {/* Events & Tickets Management */}
            <button
              onClick={() => setActiveTab('events')}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                activeTab === 'events'
                  ? 'bg-[#1B365D] text-white shadow-md font-semibold ring-1 ring-white/10'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-[#F4B245]" />
                <span>Events &amp; Tickets</span>
              </div>
              {eventBookings.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-slate-300">
                  {eventBookings.length}
                </span>
              )}
            </button>

            {/* Menu & Pricing */}
            <button
              onClick={() => setActiveTab('menu')}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center gap-3 cursor-pointer ${
                activeTab === 'menu'
                  ? 'bg-[#1B365D] text-white shadow-md font-semibold ring-1 ring-white/10'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Coffee className="w-4 h-4 text-[#F4B245]" />
              <span>Menu &amp; Pricing</span>
            </button>

            {/* Café Timings */}
            <button
              onClick={() => setActiveTab('cms')}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center gap-3 cursor-pointer ${
                activeTab === 'cms'
                  ? 'bg-[#1B365D] text-white shadow-md font-semibold ring-1 ring-white/10'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4 text-[#F4B245]" />
              <span>Café Timings</span>
            </button>
          </nav>

        </div>

        {/* Bottom Section: Quote + Settings + Logout */}
        <div className="p-5 space-y-4 relative z-10">
          
          {/* Cursive Brand Sub-slogan */}
          <div className="px-2 pb-2">
            <span 
              className="text-[#F4B245] text-base italic block font-serif tracking-wide opacity-90"
              style={{ fontFamily: "'Cormorant Garamond', cursive, serif" }}
            >
              Great Coffee<br />Brighter Days
            </span>
            <div className="w-6 h-0.5 bg-[#F4B245]/60 mt-1.5" />
          </div>

          <div className="space-y-1 pt-1 border-t border-slate-700/60">
            {/* Settings */}
            <button
              onClick={() => setActiveTab('cms')}
              className="w-full px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-3 cursor-pointer"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Settings</span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-rose-300 hover:bg-rose-950/20 transition-all flex items-center gap-3 cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-slate-400" />
              <span>Logout</span>
            </button>
          </div>

        </div>

      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT AREA (Clean Slate-Gray Background) */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#F1F5F9]">
        
        {/* ======================================================================= */}
        {/* TOP CRISP LIGHT HEADER BAR */}
        {/* ======================================================================= */}
        <header className="h-16 bg-white border-b border-[#E2E8F0] px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-xs z-20">
          {/* Left: Mobile Toggle + Brand / Title Indicator */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle navigation"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider font-mono truncate">
              Management Desk &bull; Hazratganj
            </span>
          </div>

          {/* Right: Notifications & User Profile */}
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setActiveTab('messages')}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer relative"
              >
                <Bell className="w-5 h-5" />
                {unreadContactCount > 0 && (
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-white" />
                )}
              </button>
            </div>

            {/* User Pill */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-[#0B1728] text-[#F4B245] flex items-center justify-center font-bold text-xs shadow-sm border border-[#1E293B]">
                VM
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold text-slate-900 block leading-tight">{adminUser.name}</span>
                <span className="text-[10px] text-slate-500 font-medium block">Admin</span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 ml-0.5" />
            </div>
          </div>
        </header>

        {/* ======================================================================= */}
        {/* WORKSPACE SCROLL CONTAINER */}
        {/* ======================================================================= */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* ===================================================================== */}
          {/* TOP LUXURY SAPPHIRE-NAVY BANNER CARD */}
          {/* ===================================================================== */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl bg-[#0B1728] text-white min-h-[170px] flex items-center justify-between p-7 sm:p-8 border border-[#1E3A5F]/50">
            
            {/* Background photo & navy overlays */}
            <div className="absolute inset-0 z-0">
              <img 
                src={ASSETS.cafePatioTerrace || ASSETS.startImage} 
                alt="Sagē" 
                className="w-full h-full object-cover opacity-20 filter blur-[0.5px]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B1728] via-[#132A4A]/90 to-[#0A1626]/95" />
            </div>

            {/* Left Content */}
            <div className="relative z-10 max-w-xl space-y-1">
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#F4B245] font-bold uppercase block opacity-90">
                SAGE MANAGEMENT CONSOLE
              </span>
              <h2 
                className="text-3xl sm:text-4xl font-serif font-medium text-white tracking-wide"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {activeTab === 'orders' && 'Live Table Orders & Kitchen Tickets'}
                {activeTab === 'reservations' && 'Table Reservations & Seating'}
                {activeTab === 'messages' && 'Guest Inquiries & Messages'}
                {activeTab === 'events' && 'Events, Masterclasses & Ticket Bookings'}
                {activeTab === 'menu' && 'Menu Catalogue & Live Pricing'}
                {activeTab === 'cms' && 'Café Timings & Status'}
              </h2>
              <div className="w-12 h-0.5 bg-[#F4B245] mt-2.5 rounded-full" />
            </div>

            {/* Center-Right: Cursive Quote */}
            <div className="relative z-10 hidden lg:block text-center transform -rotate-6 px-4">
              <span 
                className="text-2xl sm:text-3xl text-[#F4B245] italic font-serif"
                style={{ fontFamily: "'Cormorant Garamond', cursive, serif" }}
              >
                A table<br />for every story.
              </span>
              <div className="w-16 h-0.5 bg-[#F4B245]/40 mx-auto mt-1 rounded-full" />
            </div>

            {/* Far Right: Live Clock & Date */}
            <div className="relative z-10 text-right space-y-0.5 shrink-0">
              <span className="text-xs text-slate-300 font-medium block">
                {formattedDayDate}
              </span>
              <span 
                className="text-3xl sm:text-4xl font-serif text-white font-light tracking-wider block"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {formattedTime}
              </span>
              <span 
                className="text-xs text-[#F4B245] italic font-serif block opacity-90"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Good food,<br />brighter people.
              </span>
            </div>

          </div>

          {/* ===================================================================== */}
          {/* TAB 0: LIVE TABLE ORDERS (KITCHEN ORDER TICKETS & HOST DESK)           */}
          {/* ===================================================================== */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              
              {/* Top Row: Title + Stats Badges + Refresh */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    <ChefHat className="w-6 h-6 text-[#E58B20]" />
                    <span>Kitchen Desk &bull; Table Orders ({filteredTableOrders.length})</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live real-time table orders from dining guests. Manage preparation, table serving, and billing.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => loadDashboardData()}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin text-[#E58B20]' : ''}`} />
                    <span>Refresh Tickets</span>
                  </button>
                </div>
              </div>

              {/* 4 Key Summary Counter Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">New / Pending</span>
                    <h4 className="text-2xl font-bold text-[#E58B20] mt-0.5">{pendingOrdersCount}</h4>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#E58B20]">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">In Kitchen</span>
                    <h4 className="text-2xl font-bold text-amber-600 mt-0.5">{preparingOrdersCount}</h4>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                    <ChefHat className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Served to Table</span>
                    <h4 className="text-2xl font-bold text-emerald-600 mt-0.5">{servedOrdersCount}</h4>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                    <Utensils className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Completed</span>
                    <h4 className="text-2xl font-bold text-slate-800 mt-0.5">{completedOrdersCount}</h4>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Filter Pills + Search Table / Guest Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                {/* Segmented Status Filters */}
                <div className="inline-flex p-1 rounded-xl bg-[#E2E8F0] border border-slate-300/80 text-xs font-medium overflow-x-auto">
                  {[
                    { id: 'all', label: 'All Orders', count: tableOrders.length },
                    { id: 'pending', label: 'New', count: pendingOrdersCount },
                    { id: 'preparing', label: 'Preparing', count: preparingOrdersCount },
                    { id: 'served', label: 'Served', count: servedOrdersCount },
                    { id: 'completed', label: 'Settled', count: completedOrdersCount },
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setOrderFilter(st.id)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                        orderFilter === st.id
                          ? 'bg-[#0B1728] text-white shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {st.label} ({st.count})
                    </button>
                  ))}
                </div>

                {/* Search Bar */}
                <div className="relative min-w-[240px] sm:w-72">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search Table #, Name, Phone..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#E58B20] shadow-xs"
                  />
                  {orderSearch && (
                    <button
                      onClick={() => setOrderSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Order Tickets Card Grid */}
              {filteredTableOrders.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 mx-auto flex items-center justify-center text-slate-400">
                    <ChefHat className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-bold text-slate-800 font-serif" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    No Table Orders Found
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {orderFilter === 'all'
                      ? 'No active orders placed by dining guests yet. When customers click "+ ADD TO ORDER" on the menu, their table tickets will appear here live.'
                      : `No orders currently matching the "${orderFilter}" status filter.`}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredTableOrders.map((order) => {
                    const id = order._id || order.id || order.orderId;
                    const isPending = order.status === 'pending';
                    const isPreparing = order.status === 'preparing';
                    const isServed = order.status === 'served';
                    const isCompleted = order.status === 'completed';

                    const formattedTimeElapsed = new Date(order.createdAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    });

                    return (
                      <div
                        key={id}
                        className={`rounded-2xl bg-white border transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden ${
                          isPending
                            ? 'border-orange-300 ring-2 ring-orange-400/20'
                            : isPreparing
                            ? 'border-amber-300'
                            : isServed
                            ? 'border-emerald-300'
                            : 'border-slate-200 opacity-90'
                        }`}
                      >
                        
                        {/* Card Header: Table # Badge + Status Badge */}
                        <div className={`p-4 border-b flex items-center justify-between ${
                          isPending
                            ? 'bg-gradient-to-r from-orange-50 to-amber-50/50 border-orange-200'
                            : isPreparing
                            ? 'bg-amber-50/60 border-amber-200'
                            : isServed
                            ? 'bg-emerald-50/60 border-emerald-200'
                            : 'bg-slate-50 border-slate-200'
                        }`}>
                          <div className="flex items-center gap-2.5">
                            <span className="px-3 py-1 rounded-xl bg-[#0B1728] text-[#F4B245] font-black text-sm tracking-wide shadow-xs">
                              {order.tableNo}
                            </span>
                            <div>
                              <span className="text-[11px] font-mono text-slate-500 font-bold block">
                                #{order.orderId || id?.slice(-6)}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {formattedTimeElapsed}
                              </span>
                            </div>
                          </div>

                          {/* Status Tag */}
                          <div className="flex items-center gap-2">
                            {isPending && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#E58B20] text-white flex items-center gap-1 shadow-xs animate-pulse">
                                <Clock className="w-3 h-3" /> New Ticket
                              </span>
                            )}
                            {isPreparing && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-white flex items-center gap-1 shadow-xs">
                                <ChefHat className="w-3 h-3" /> In Kitchen
                              </span>
                            )}
                            {isServed && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-600 text-white flex items-center gap-1 shadow-xs">
                                <Utensils className="w-3 h-3" /> Served
                              </span>
                            )}
                            {isCompleted && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-700 text-white flex items-center gap-1">
                                <Check className="w-3 h-3" /> Settled
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Customer Info & Contact */}
                        <div className="px-4 pt-3 pb-2 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-semibold text-slate-800">{order.customerName}</span>
                          </div>
                          <a
                            href={`tel:${order.customerPhone}`}
                            className="text-[#0A6473] hover:underline font-semibold flex items-center gap-1 text-[11px]"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{order.customerPhone}</span>
                          </a>
                        </div>

                        {/* Ordered Items List */}
                        <div className="p-4 flex-1 space-y-2.5">
                          <div className="space-y-1.5">
                            {order.items && order.items.length > 0 ? (
                              order.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0"
                                >
                                  <div className="flex items-center gap-2 min-w-0 pr-2">
                                    <span className="w-5 h-5 rounded-md bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-bold flex items-center justify-center shrink-0">
                                      {item.qty}x
                                    </span>
                                    <span className="font-medium text-slate-800 truncate">
                                      {item.name}
                                    </span>
                                  </div>
                                  <span className="font-bold text-slate-700 whitespace-nowrap">
                                    ₹{(item.price || 0) * (item.qty || 1)}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <div className="text-xs text-slate-500 italic">
                                Custom off-menu kitchen request
                              </div>
                            )}
                          </div>

                          {/* Custom Note Callout */}
                          {order.customItemNotes && (
                            <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs">
                              <span className="font-bold flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-amber-800 mb-0.5">
                                <FileText className="w-3 h-3 text-amber-700 shrink-0" />
                                <span>Special Kitchen Note:</span>
                              </span>
                              <span>{order.customItemNotes}</span>
                            </div>
                          )}
                        </div>

                        {/* Card Footer: Bill Total + Status Workflow Actions */}
                        <div className="p-4 pt-3 border-t border-slate-100 bg-slate-50/80 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500">Total Bill Amount</span>
                            <span className="text-base font-bold text-slate-900">₹{order.totalAmount}</span>
                          </div>

                          {/* Status Workflow Action Buttons */}
                          <div className="flex items-center gap-2">
                            {isPending && (
                              <>
                                <button
                                  onClick={() => handleUpdateOrderStatus(id, 'preparing')}
                                  className="flex-1 py-2 rounded-xl bg-[#E58B20] hover:bg-[#d47c13] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                                >
                                  <ChefHat className="w-3.5 h-3.5" />
                                  <span>Start Preparing</span>
                                </button>
                                <button
                                  onClick={() => handleUpdateOrderStatus(id, 'cancelled')}
                                  title="Decline order"
                                  className="p-2 rounded-xl bg-slate-200 hover:bg-rose-100 text-slate-600 hover:text-rose-600 text-xs transition-colors cursor-pointer"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}

                            {isPreparing && (
                              <button
                                onClick={() => handleUpdateOrderStatus(id, 'served')}
                                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                              >
                                <Utensils className="w-3.5 h-3.5" />
                                <span>Mark Served to Table</span>
                              </button>
                            )}

                            {isServed && (
                              <button
                                onClick={() => handleUpdateOrderStatus(id, 'completed')}
                                className="flex-1 py-2 rounded-xl bg-[#0B1728] hover:bg-slate-800 text-[#F4B245] text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#F4B245]" />
                                <span>Complete &amp; Settle Bill</span>
                              </button>
                            )}

                            {isCompleted && (
                              <div className="flex-1 py-1.5 px-3 rounded-xl bg-slate-200 text-slate-600 text-xs font-semibold text-center flex items-center justify-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>Table Order Fulfilled</span>
                              </div>
                            )}

                            {/* Delete button */}
                            <button
                              onClick={() => handleDeleteTableOrder(id)}
                              title="Delete ticket"
                              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-300 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 1: RESERVATIONS FEED & DATA TABLE */}
          {/* ===================================================================== */}
          {activeTab === 'reservations' && (
            <div className="space-y-4">
              
              {/* Table Top Controls & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Guest Booking Feed ({filteredReservations.length})
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Declined reservations automatically delete after 24h &bull; Confirmed bookings saved permanently
                  </p>
                </div>

                {/* + New Reservation Action Button */}
                <button
                  onClick={() => setNewResModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#E58B20] hover:bg-[#d47c13] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4 text-white" />
                  <span>New Reservation</span>
                </button>
              </div>

              {/* Segmented Filter Pills */}
              <div className="inline-flex p-1 rounded-xl bg-[#E2E8F0] border border-slate-300/80 text-xs font-medium">
                {[
                  { id: 'all', label: 'All', count: reservations.length },
                  { id: 'new', label: 'Pending', count: pendingCount },
                  { id: 'confirmed', label: 'Confirmed', count: confirmedCount },
                  { id: 'declined', label: 'Declined', count: declinedCount },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setResFilter(st.id)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      resFilter === st.id
                        ? 'bg-[#0B1728] text-white shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st.label} ({st.count})
                  </button>
                ))}
              </div>

              {/* Main White Data Table Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    
                    {/* Table Header */}
                    <thead className="bg-[#F8FAFC] text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-[#E2E8F0]">
                      <tr>
                        <th className="py-3.5 px-4 font-semibold w-16">#</th>
                        <th className="py-3.5 px-4 font-semibold">Guest Name</th>
                        <th className="py-3.5 px-4 font-semibold">Date &amp; Time</th>
                        <th className="py-3.5 px-4 font-semibold text-center">Party Size</th>
                        <th className="py-3.5 px-4 font-semibold">Seating Section</th>
                        <th className="py-3.5 px-4 font-semibold">Special Request</th>
                        <th className="py-3.5 px-4 font-semibold">Status</th>
                        <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="divide-y divide-slate-100">
                      {filteredReservations.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-16 text-center text-slate-400">
                            <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                            <span>No {resFilter !== 'all' ? resFilter : ''} reservations found.</span>
                          </td>
                        </tr>
                      ) : (
                        filteredReservations.map((res) => {
                          const id = res._id || res.id;
                          const code = `#F${(id || '0000').slice(-3).toUpperCase()}`;
                          const isConfirmed = res.status === 'confirmed';
                          const isDeclined = res.status === 'declined';
                          const isPending = res.status === 'new';

                          return (
                            <tr 
                              key={id} 
                              className="hover:bg-[#F8FAFC] transition-colors group"
                            >
                              {/* Reference Code */}
                              <td className="py-4 px-4 font-mono font-bold text-xs text-slate-700">
                                {code}
                              </td>

                              {/* Guest Name & Phone */}
                              <td className="py-4 px-4">
                                <div className="font-bold text-xs text-slate-900">{res.name}</div>
                                <div className="text-[11px] text-slate-500 font-mono mt-0.5">{res.phone}</div>
                              </td>

                              {/* Date & Time */}
                              <td className="py-4 px-4">
                                <div className="font-bold text-xs text-slate-900">{res.date}</div>
                                <div className="text-[11px] text-slate-500 font-mono mt-0.5">{res.time}</div>
                              </td>

                              {/* Party Size */}
                              <td className="py-4 px-4 text-center font-bold text-xs text-slate-800">
                                {res.guests}
                              </td>

                              {/* Seating Section */}
                              <td className="py-4 px-4 text-xs text-slate-700 font-medium max-w-[170px] truncate">
                                {res.experience || 'Main Artisanal Dining Room'}
                              </td>

                              {/* Special Request */}
                              <td className="py-4 px-4 text-xs text-slate-600 max-w-[220px]">
                                {res.specialRequests ? (
                                  <span className="italic line-clamp-2">&ldquo;{res.specialRequests}&rdquo;</span>
                                ) : (
                                  <span className="text-slate-300">—</span>
                                )}
                              </td>

                              {/* Status Badge */}
                              <td className="py-4 px-4">
                                {isConfirmed ? (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-[#E0F2FE] text-[#0369A1]">
                                    Confirmed
                                  </span>
                                ) : isDeclined ? (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-[#FFE4E6] text-[#BE123C]">
                                    Declined
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-[#FEF3C7] text-[#B45309] animate-pulse">
                                    Pending
                                  </span>
                                )}
                              </td>

                              {/* Action Cluster (Eye, Mail, More Dropdown) */}
                              <td className="py-4 px-4 text-right relative">
                                <div className="inline-flex items-center gap-1.5">
                                  
                                  {/* View Full Details Modal */}
                                  <button
                                    onClick={() => setViewResModal(res)}
                                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                                    title="View Full Booking Details"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>

                                  {/* Custom Email / Reschedule Modal */}
                                  <button
                                    onClick={() => openCustomModalForRes(res)}
                                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                                    title="Send Custom Message / Suggest Alternate Slot"
                                  >
                                    <Mail className="w-4 h-4" />
                                  </button>

                                  {/* Quick Actions Dropdown Toggle */}
                                  <div className="relative inline-block text-left">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveActionMenuId(activeActionMenuId === id ? null : id);
                                      }}
                                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                                      title="More Options"
                                    >
                                      <MoreHorizontal className="w-4 h-4" />
                                    </button>

                                    {/* Action Dropdown Menu */}
                                    {activeActionMenuId === id && (
                                      <div 
                                        onClick={(e) => e.stopPropagation()}
                                        className="absolute right-0 mt-1 w-48 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-left text-xs"
                                      >
                                        <button
                                          onClick={() => {
                                            handleUpdateStatus(id, 'confirmed');
                                            setActiveActionMenuId(null);
                                          }}
                                          className="w-full px-4 py-2 text-left text-sky-700 hover:bg-sky-50 font-semibold flex items-center gap-2"
                                        >
                                          <Check className="w-3.5 h-3.5" />
                                          <span>Confirm &amp; Send Email</span>
                                        </button>

                                        <button
                                          onClick={() => {
                                            handleUpdateStatus(id, 'declined');
                                            setActiveActionMenuId(null);
                                          }}
                                          className="w-full px-4 py-2 text-left text-rose-600 hover:bg-rose-50 font-medium flex items-center gap-2"
                                        >
                                          <X className="w-3.5 h-3.5" />
                                          <span>Decline (24h Auto-Del)</span>
                                        </button>

                                        <button
                                          onClick={() => {
                                            openWhatsAppConfirmation(res);
                                            setActiveActionMenuId(null);
                                          }}
                                          className="w-full px-4 py-2 text-left text-[#1B365D] hover:bg-slate-50 font-medium flex items-center gap-2 border-t border-slate-100"
                                        >
                                          <PhoneCall className="w-3.5 h-3.5 text-[#C27815]" />
                                          <span>Contact Guest (Concierge)</span>
                                        </button>
                                      </div>
                                    )}
                                  </div>

                                </div>
                              </td>

                            </tr>
                          );
                        })
                      )}
                    </tbody>

                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 2: INQUIRIES & CONTACT MESSAGES */}
          {/* ===================================================================== */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Customer Inquiries &amp; Messages ({contacts.length})
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live customer messages received via the website Contact Us form
                  </p>
                </div>

                <div className="inline-flex p-1 rounded-xl bg-[#E2E8F0] border border-slate-300 text-xs font-medium">
                  {['all', 'unread', 'read', 'replied'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setMessageFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                        messageFilter === st
                          ? 'bg-[#0B1728] text-white shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inquiries Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contacts.filter(c => messageFilter === 'all' || c.status === messageFilter).length === 0 ? (
                  <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200">
                    <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <span className="text-sm text-slate-500">No {messageFilter !== 'all' ? messageFilter : ''} messages found.</span>
                  </div>
                ) : (
                  contacts.filter(c => messageFilter === 'all' || c.status === messageFilter).map((msg) => {
                    const id = msg._id || msg.id;
                    const isUnread = msg.status === 'unread';
                    const isReplied = msg.status === 'replied';

                    return (
                      <div 
                        key={id} 
                        className={`bg-white rounded-2xl p-5 border shadow-xs space-y-4 flex flex-col justify-between ${
                          isUnread ? 'border-[#F4B245] ring-1 ring-[#F4B245]/40' : 'border-slate-200'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#0B1728] text-[#F4B245] flex items-center justify-center font-bold text-sm">
                                {msg.name ? msg.name.charAt(0).toUpperCase() : 'G'}
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-slate-900">{msg.name || 'Guest'}</h4>
                                <span className="text-[10px] text-slate-600 font-medium px-2 py-0.5 rounded-md bg-slate-100">
                                  {msg.purpose || 'General Inquiry'}
                                </span>
                              </div>
                            </div>

                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              isReplied ? 'bg-sky-100 text-sky-800' : isUnread ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {msg.status || 'unread'}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs font-mono text-slate-600">
                            {msg.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3 text-slate-400" />
                                <span>{msg.phone}</span>
                              </span>
                            )}
                            {msg.email && (
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3 text-slate-400" />
                                <span>{msg.email}</span>
                              </span>
                            )}
                          </div>

                          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-800 leading-relaxed">
                            {msg.message || 'No additional message provided.'}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                          <div className="flex items-center gap-2">
                            {isUnread ? (
                              <button 
                                onClick={() => handleUpdateContactStatus(id, 'read')}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-medium cursor-pointer"
                              >
                                Mark Read
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleUpdateContactStatus(id, 'unread')}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-medium cursor-pointer"
                              >
                                Mark Unread
                              </button>
                            )}

                            {!isReplied && (
                              <button 
                                onClick={() => handleUpdateContactStatus(id, 'replied')}
                                className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 font-medium cursor-pointer flex items-center gap-1"
                              >
                                <Check className="w-3 h-3 text-sky-700" />
                                <span>Replied</span>
                              </button>
                            )}
                          </div>

                          <button 
                            onClick={() => handleDeleteContact(id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 2.5: EVENTS, MASTERCLASSES & RAZORPAY TICKET BOOKINGS             */}
          {/* ===================================================================== */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              
              {/* Header Title & Global Action Bar */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 flex items-center gap-2.5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    <Sparkles className="w-6 h-6 text-[#E58B20]" />
                    <span>Gatherings, Masterclasses &amp; Ticket Bookings</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manage event listings, schedule dates, pricing, and view live guest registrations with Razorpay payment details.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={openCreateEventModal}
                    className="px-4 py-2.5 rounded-xl bg-[#0B1728] hover:bg-[#1B365D] text-[#F4B245] text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer hover:scale-102 active:scale-98"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Event</span>
                  </button>

                  <button
                    onClick={() => loadDashboardData()}
                    className="p-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
                    title="Refresh data"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin text-[#E58B20]' : ''}`} />
                  </button>
                </div>
              </div>

              {/* 4 Summary Stat Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Total Events</span>
                    <h4 className="text-2xl font-bold text-slate-900 mt-0.5">{(eventsList || []).length}</h4>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Total Bookings</span>
                    <h4 className="text-2xl font-bold text-[#E58B20] mt-0.5">{(eventBookings || []).length}</h4>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#E58B20]">
                    <Ticket className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Tickets Issued</span>
                    <h4 className="text-2xl font-bold text-emerald-600 mt-0.5">
                      {(eventBookings || []).reduce((sum, b) => sum + (Number(b?.ticketsCount) || 1), 0)}
                    </h4>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                    <Users className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Razorpay Revenue</span>
                    <h4 className="text-2xl font-bold text-slate-900 mt-0.5">
                      ₹{(eventBookings || [])
                        .filter(b => b?.paymentStatus === 'paid' || b?.paymentStatus === 'confirmed')
                        .reduce((sum, b) => sum + (Number(b?.totalAmount) || 0), 0)
                        .toLocaleString('en-IN')}
                    </h4>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Sub-view Switcher Pills */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div className="inline-flex p-1 rounded-xl bg-[#E2E8F0] border border-slate-300 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setEventTabSubView('events')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      eventTabSubView === 'events'
                        ? 'bg-[#0B1728] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Events Catalog ({(eventsList || []).length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEventTabSubView('bookings')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      eventTabSubView === 'bookings'
                        ? 'bg-[#0B1728] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Attendee Ticket Bookings ({(eventBookings || []).length})</span>
                  </button>
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* SUB-VIEW 1: EVENTS CATALOG                                    */}
              {/* ------------------------------------------------------------- */}
              {eventTabSubView === 'events' && (
                <div className="space-y-4">
                  {/* Filter & Search Bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {[
                        { id: 'all', label: 'All Categories' },
                        { id: 'music', label: 'Live Jazz & Vinyl' },
                        { id: 'coffee', label: 'Coffee Labs' },
                        { id: 'bakery', label: 'Baking Masterclasses' },
                        { id: 'community', label: 'Open Mic' },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setEventCategoryFilter(cat.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                            eventCategoryFilter === cat.id
                              ? 'bg-[#0A6473] text-white font-bold shadow-xs'
                              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    <div className="relative min-w-[240px]">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search event title, host, location..."
                        value={eventSearch}
                        onChange={(e) => setEventSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0A6473] shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Events Grid */}
                  {(eventsList || []).length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
                      <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 mx-auto flex items-center justify-center text-slate-400">
                        <Calendar className="w-7 h-7" />
                      </div>
                      <h4 className="text-base font-bold text-slate-800 font-serif">No Events Listed Yet</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Click "Create New Event" to publish live workshops, vinyl nights, and cupping masterclasses.
                      </p>
                      <button
                        type="button"
                        onClick={openCreateEventModal}
                        className="px-4 py-2 rounded-xl bg-[#0A6473] text-white text-xs font-semibold shadow-xs inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create First Event</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                      {(eventsList || [])
                        .filter((e) => {
                          if (eventCategoryFilter !== 'all' && e?.category !== eventCategoryFilter) return false;
                          if (eventSearch.trim()) {
                            const q = eventSearch.toLowerCase();
                            const matchTitle = (e?.title || '').toLowerCase().includes(q);
                            const matchHost = (e?.host || '').toLowerCase().includes(q);
                            const matchLoc = (e?.location || '').toLowerCase().includes(q);
                            if (!matchTitle && !matchHost && !matchLoc) return false;
                          }
                          return true;
                        })
                        .map((evt) => {
                          const eventId = String(evt?._id || evt?.id || '');
                          return (
                            <div
                              key={eventId}
                              className="rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
                            >
                              {/* Photo Header */}
                              <div className="relative h-44 bg-slate-900 overflow-hidden">
                                <img
                                  src={evt?.image || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'}
                                  alt={evt?.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                
                                <div className="absolute top-3 left-3 flex items-center gap-2">
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0A6473] text-[#F3D898] uppercase tracking-wider shadow-xs">
                                    {evt?.tag || 'SPECIAL'}
                                  </span>
                                  {evt?.featured && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E58B20] text-white flex items-center gap-1 shadow-xs">
                                      <Sparkles className="w-2.5 h-2.5 text-white shrink-0" />
                                      <span>Featured</span>
                                    </span>
                                  )}
                                </div>

                                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-mono">
                                  <span className="text-[#F4B245] font-semibold">{evt?.date}</span>
                                  <span className="text-[10px] bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
                                    {evt?.spotsLeft ?? evt?.totalSpots} spots left
                                  </span>
                                </div>
                              </div>

                              {/* Card Body */}
                              <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                                <div className="space-y-1.5">
                                  <div className="text-[11px] font-mono text-slate-500">
                                    {evt?.time} &bull; {evt?.location}
                                  </div>
                                  <h4 className="text-base font-bold text-slate-900 font-serif leading-snug" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                                    {evt?.title}
                                  </h4>
                                  <p className="text-xs text-slate-500 italic">
                                    {evt?.host}
                                  </p>
                                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                    {evt?.description}
                                  </p>
                                </div>

                                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                  <div>
                                    <span className="text-slate-400 block text-[10px] font-mono uppercase">Ticket Price</span>
                                    <span className="font-bold text-[#0A6473] text-sm">{evt?.price}</span>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => openEditEventModal(evt)}
                                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteEvent(eventId, evt?.title)}
                                      className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 cursor-pointer transition-colors"
                                      title="Delete Event"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>

                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* SUB-VIEW 2: ATTENDEE TICKET BOOKINGS & RAZORPAY TRANSACTIONS  */}
              {/* ------------------------------------------------------------- */}
              {eventTabSubView === 'bookings' && (
                <div className="space-y-4">
                  {/* Filters & Search */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5">
                      {[
                        { id: 'all', label: 'All Bookings' },
                        { id: 'paid', label: 'Confirmed (Paid)' },
                        { id: 'pending', label: 'Pending' },
                      ].map((st) => (
                        <button
                          key={st.id}
                          onClick={() => setBookingStatusFilter(st.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                            bookingStatusFilter === st.id
                              ? 'bg-[#0B1728] text-white font-bold shadow-xs'
                              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>

                    <div className="relative min-w-[280px]">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search Booking ID, Guest, Razorpay ID..."
                        value={bookingSearch}
                        onChange={(e) => setBookingSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0A6473] shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Bookings Table */}
                  {(eventBookings || []).length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
                      <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 mx-auto flex items-center justify-center text-slate-400">
                        <Ticket className="w-7 h-7" />
                      </div>
                      <h4 className="text-base font-bold text-slate-800 font-serif">No Event Ticket Bookings Yet</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        When guests book tickets on the public Events page and complete checkout via Razorpay, attendee passes and payment details will appear here live.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#F8FAFC] text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                            <tr>
                              <th className="py-3.5 px-4">Pass ID</th>
                              <th className="py-3.5 px-4">Guest Attendee</th>
                              <th className="py-3.5 px-4">Event Gathering</th>
                              <th className="py-3.5 px-4">Qty</th>
                              <th className="py-3.5 px-4">Amount</th>
                              <th className="py-3.5 px-4">Razorpay Payment ID</th>
                              <th className="py-3.5 px-4">Status</th>
                              <th className="py-3.5 px-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {(eventBookings || [])
                              .filter((b) => {
                                if (bookingStatusFilter !== 'all' && b?.paymentStatus !== bookingStatusFilter) return false;
                                if (bookingSearch.trim()) {
                                  const q = bookingSearch.toLowerCase();
                                  const matchId = (b?.bookingId || '').toLowerCase().includes(q);
                                  const matchName = (b?.guestName || '').toLowerCase().includes(q);
                                  const matchPhone = (b?.guestPhone || '').includes(q);
                                  const matchEmail = (b?.guestEmail || '').toLowerCase().includes(q);
                                  const matchEvent = (b?.eventTitle || '').toLowerCase().includes(q);
                                  const matchPayId = (b?.razorpayPaymentId || '').toLowerCase().includes(q);
                                  if (!matchId && !matchName && !matchPhone && !matchEmail && !matchEvent && !matchPayId) {
                                    return false;
                                  }
                                }
                                return true;
                              })
                              .map((booking) => {
                                const id = String(booking?._id || booking?.id || '');
                                const isPaid = booking?.paymentStatus === 'paid';
                                return (
                                  <tr key={id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="py-3.5 px-4 font-mono font-bold text-[#0A6473]">
                                      {booking?.bookingId || `#${id.slice(-6)}`}
                                    </td>
                                    <td className="py-3.5 px-4">
                                      <div className="font-bold text-slate-900">{booking?.guestName}</div>
                                      <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
                                        <span>{booking?.guestPhone}</span>
                                        <span>&bull;</span>
                                        <span className="truncate max-w-[140px]">{booking?.guestEmail}</span>
                                      </div>
                                    </td>
                                    <td className="py-3.5 px-4">
                                      <div className="font-semibold text-slate-800">{booking?.eventTitle}</div>
                                      <div className="text-[11px] text-slate-500">{booking?.eventDate} &bull; {booking?.eventTime}</div>
                                    </td>
                                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                                      {booking?.ticketsCount || 1}
                                    </td>
                                    <td className="py-3.5 px-4 font-bold text-slate-900">
                                      ₹{booking?.totalAmount}
                                    </td>
                                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                                      {booking?.razorpayPaymentId ? (
                                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                                          {booking.razorpayPaymentId}
                                        </span>
                                      ) : (
                                        <span className="text-slate-400 italic">Free RSVP / Direct</span>
                                      )}
                                    </td>
                                    <td className="py-3.5 px-4">
                                      {isPaid ? (
                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 w-fit">
                                          <Check className="w-3 h-3 text-emerald-700" />
                                          <span>Paid</span>
                                        </span>
                                      ) : (
                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 w-fit">
                                          {booking?.paymentStatus?.toUpperCase() || 'PENDING'}
                                        </span>
                                      )}
                                    </td>
                                    <td className="py-3.5 px-4 text-right">
                                      <div className="flex items-center justify-end gap-1.5">
                                        <button
                                          type="button"
                                          onClick={() => setViewBookingModal(booking)}
                                          className="p-1.5 rounded-lg text-slate-600 hover:text-[#0A6473] hover:bg-slate-100 cursor-pointer"
                                          title="View Pass Receipt"
                                        >
                                          <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteEventBooking(id, booking?.guestName)}
                                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                                          title="Delete Booking Record"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 3: MENU & PRICING */}
          {/* ===================================================================== */}
          {activeTab === 'menu' && (
            <div className="space-y-6">
              
              {/* ------------------------------------------------------------- */}
              {/* ------------------------------------------------------------- */}
              {/* CLOUDINARY MULTI-SECTION PDF MENU CMS (LIGHT THEME) */}
              {/* ------------------------------------------------------------- */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 text-slate-900 shadow-xs border border-slate-200/90 relative overflow-hidden space-y-6">
                
                {/* Top Bar: Title + Cloudinary Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-[#C27815]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg sm:text-xl font-bold font-serif text-slate-900 tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          Official PDF Menu Management (Section-Wise)
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200 flex items-center gap-1">
                          <Cloud className="w-3 h-3 text-sky-600" /> Cloudinary
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Upload dedicated PDFs per category or a single Master Full Menu catalogue
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {menuPdfData?.hasMenuPdf ? (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        PDF System Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        No PDF Attached
                      </span>
                    )}
                  </div>
                </div>

                {/* --------------------------------------------------------- */}
                {/* SECTION SELECTION CHIPS / TICK RADIOS (LUCIDE ICONS) */}
                {/* --------------------------------------------------------- */}
                <div className="space-y-2.5">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                    1. Select / Tick Menu Section To Manage:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                    {[
                      { id: 'all', label: 'Master Full Menu', icon: Layers, color: 'text-indigo-600', desc: 'Main / All Sections' },
                      { id: 'breakfast', label: 'Breakfast & Bakes', icon: Coffee, color: 'text-amber-600', desc: 'Breakfast Section' },
                      { id: 'lunch-dinner', label: 'Lunch & Dinner', icon: Utensils, color: 'text-emerald-600', desc: 'Lunch/Dinner Section' },
                      { id: 'dessert', label: 'Gelato & Dessert', icon: Cake, color: 'text-rose-500', desc: 'Dessert Section' },
                      { id: 'beverages', label: 'Coffee & Beverages', icon: CupSoda, color: 'text-sky-600', desc: 'Beverages Section' },
                    ].map((cat) => {
                      const isSelected = selectedPdfCategory === cat.id;
                      const secData = menuPdfData?.sections?.[cat.id];
                      const hasPdf = Boolean(secData && secData.url);
                      const IconComp = cat.icon;

                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedPdfCategory(cat.id)}
                          className={`p-3.5 rounded-2xl text-left transition-all border cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                            isSelected
                              ? 'bg-amber-50/70 border-[#C27815] ring-2 ring-[#C27815]/25 shadow-sm'
                              : 'bg-slate-50/80 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-2">
                            <div className={`w-8 h-8 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center shadow-2xs ${cat.color}`}>
                              <IconComp className="w-4 h-4" />
                            </div>
                            <div className="flex items-center gap-1.5">
                              {hasPdf && (
                                <span className="w-2 h-2 rounded-full bg-emerald-500" title="PDF Attached" />
                              )}
                              <div className={`w-4 h-4 rounded-md flex items-center justify-center border text-[10px] font-bold transition-colors ${
                                isSelected
                                  ? 'bg-[#C27815] text-white border-[#C27815]'
                                  : 'border-slate-300 text-transparent'
                              }`}>
                                <Check className="w-2.5 h-2.5" />
                              </div>
                            </div>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block leading-tight">
                              {cat.label}
                            </span>
                            <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">
                              {hasPdf ? 'PDF Attached' : 'No PDF'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* --------------------------------------------------------- */}
                {/* ACTIVE SECTION STATUS CARD (LIGHT THEME) */}
                {/* --------------------------------------------------------- */}
                {(() => {
                  const currentSecData = menuPdfData?.sections?.[selectedPdfCategory];
                  const hasSecPdf = Boolean(currentSecData && currentSecData.url);
                  const masterData = menuPdfData?.sections?.all;
                  const catNames = {
                    all: 'Master Full Menu',
                    breakfast: 'Breakfast & Bakes Menu',
                    'lunch-dinner': 'Lunch & Dinner Menu',
                    dessert: 'Gelato & Dessert Menu',
                    beverages: 'Coffee & Beverages Menu',
                  };

                  return (
                    <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-3">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-center gap-3.5">
                          <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 ${
                            hasSecPdf ? 'bg-rose-50 border border-rose-200 text-rose-600' : 'bg-white border border-slate-200 text-slate-400'
                          }`}>
                            <FileText className="w-6 h-6" />
                            <span className="text-[9px] font-black uppercase tracking-tighter">PDF</span>
                          </div>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-slate-900">
                                {catNames[selectedPdfCategory]}
                              </h4>
                              {hasSecPdf ? (
                                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
                                  Direct PDF Active
                                </span>
                              ) : masterData?.url ? (
                                <span className="text-[10px] text-sky-700 font-bold bg-sky-100 border border-sky-200 px-2 py-0.5 rounded-full">
                                  Fallback to Master PDF
                                </span>
                              ) : (
                                <span className="text-[10px] text-amber-700 font-bold bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">
                                  HTML Print Preview
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500">
                              {hasSecPdf ? (
                                <>
                                  File: <span className="text-slate-800 font-semibold">{currentSecData.name || 'menu.pdf'}</span> ({currentSecData.size || 'Cloudinary'})
                                </>
                              ) : (
                                'No dedicated PDF attached for this section yet.'
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Quick Actions if section has PDF */}
                        {hasSecPdf && (
                          <div className="flex items-center gap-2">
                            <a
                              href={currentSecData.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-200 shadow-2xs"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-[#C27815]" />
                              <span>Preview PDF</span>
                            </a>

                            <a
                              href={currentSecData.url}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-2 rounded-xl bg-[#1B365D] hover:bg-[#254b80] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download</span>
                            </a>

                            <button
                              onClick={() => handleDeleteMenuPdf(selectedPdfCategory)}
                              className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-semibold transition-all cursor-pointer"
                              title={`Delete ${catNames[selectedPdfCategory]} PDF`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* --------------------------------------------------------- */}
                {/* UPLOAD DROPZONE & CONTROLS (LIGHT THEME) */}
                {/* --------------------------------------------------------- */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                    2. Upload PDF for {selectedPdfCategory.toUpperCase()}:
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* File Picker & Upload Trigger */}
                    <div className="md:col-span-8 bg-slate-50 rounded-2xl p-4 border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-[#1B365D] hover:bg-[#254b80] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs shrink-0">
                          <Upload className="w-4 h-4 text-amber-300" />
                          <span>Choose PDF File</span>
                          <input
                            type="file"
                            accept="application/pdf,.pdf"
                            onChange={handlePdfFileSelect}
                            className="hidden"
                          />
                        </label>
                        <span className="text-xs text-slate-600 truncate max-w-[200px] sm:max-w-xs font-mono">
                          {selectedPdfFile ? selectedPdfFile.name : 'No file chosen (PDF up to 25MB)'}
                        </span>
                      </div>

                      {selectedPdfFile && (
                        <button
                          type="button"
                          disabled={uploadingPdf}
                          onClick={handleUploadMenuPdf}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#C27815] hover:bg-[#b06a10] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                        >
                          {uploadingPdf ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Uploading to Cloudinary...</span>
                            </>
                          ) : (
                            <>
                              <Cloud className="w-4 h-4" />
                              <span>Upload for {selectedPdfCategory.toUpperCase()}</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Direct Link Alternative Toggle */}
                    <div className="md:col-span-4 flex items-center justify-center bg-slate-50 rounded-2xl p-4 border border-slate-200/90">
                      <button
                        type="button"
                        onClick={() => setShowDirectUrlField(!showDirectUrlField)}
                        className="text-xs text-slate-700 hover:text-[#C27815] font-semibold flex items-center gap-1.5 cursor-pointer underline underline-offset-4"
                      >
                        <LinkIcon className="w-3.5 h-3.5 text-[#C27815]" />
                        <span>{showDirectUrlField ? 'Hide Direct URL' : 'Paste Direct URL'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Direct URL Form (Collapsible) */}
                {showDirectUrlField && (
                  <form onSubmit={handleSaveDirectPdfUrl} className="bg-slate-50 rounded-2xl p-4 border border-slate-200/90 space-y-3 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                          Direct PDF URL for {selectedPdfCategory.toUpperCase()} *
                        </label>
                        <input
                          type="url"
                          required
                          placeholder="https://res.cloudinary.com/.../menu.pdf"
                          value={directPdfUrlInput}
                          onChange={(e) => setDirectPdfUrlInput(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#C27815]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                          Display Name / Season
                        </label>
                        <input
                          type="text"
                          placeholder={`e.g. Official ${selectedPdfCategory.toUpperCase()} Menu`}
                          value={directPdfNameInput}
                          onChange={(e) => setDirectPdfNameInput(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#C27815]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowDirectUrlField(false)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={savingDirectPdf}
                        className="px-4 py-1.5 rounded-xl bg-[#1B365D] hover:bg-[#254b80] text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                      >
                        {savingDirectPdf ? 'Saving...' : `Save URL for ${selectedPdfCategory.toUpperCase()}`}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* ------------------------------------------------------------- */}
              {/* DISH ITEMS & LIVE PRICING CONTROLS */}
              {/* ------------------------------------------------------------- */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Live Menu &amp; Pricing Management
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Changes reflect immediately across the public café menu
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 left-3" />
                  <input
                    type="text"
                    placeholder="Search dish name..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-[#0B1728]"
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Dish</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Diet</th>
                      <th className="py-3.5 px-4">Price (₹)</th>
                      <th className="py-3.5 px-4">Stock Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredMenuItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/75">
                        <td className="py-3.5 px-4 flex items-center gap-3">
                          <img src={item.images[0]} alt={item.name} className="w-10 h-10 rounded-xl object-cover border border-slate-200" />
                          <div>
                            <span className="font-bold text-slate-900 block">{item.name}</span>
                            <span className="text-[11px] text-slate-500">{item.cuisineTag}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 capitalize">{item.category.replace('-', ' ')}</td>
                        <td className="py-3.5 px-4"><DietaryBadge type={item.dietaryType} /></td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1">
                            <span className="text-slate-400">₹</span>
                            <input
                              type="number"
                              defaultValue={item.price}
                              onBlur={(e) => updatePrice(item.id, e.target.value)}
                              className="w-16 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 font-bold text-[#0B1728]"
                            />
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => toggleAvailability(item.id)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                              item.isAvailable ? 'bg-sky-100 text-sky-800' : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {item.isAvailable ? (
                              <>
                                <Check className="w-3 h-3 text-sky-700" />
                                <span>In Stock</span>
                              </>
                            ) : (
                              <>
                                <X className="w-3 h-3 text-rose-700" />
                                <span>Out of Stock</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 4: CMS & TIMINGS */}
          {/* ===================================================================== */}
          {activeTab === 'cms' && (
            <div className="max-w-2xl bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <h3 className="text-2xl font-serif font-bold text-slate-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Café Timings &amp; Status Controls
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Live Dine-In Status</label>
                  <button
                    onClick={() => {
                      setCafeInfo({ ...cafeInfo, hours: { ...cafeInfo.hours, isOpen: !cafeInfo.hours.isOpen } });
                      showToast('Live status updated');
                    }}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-2 ${
                      cafeInfo.hours.isOpen ? 'bg-[#1B365D] text-white' : 'bg-rose-600 text-white'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${cafeInfo.hours.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-white/80'}`} />
                    <span>Status: {cafeInfo.hours.isOpen ? 'Open For Dine-In' : 'Currently Closed'}</span>
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Weekday Hours (Mon - Thu)</label>
                  <input
                    type="text"
                    value={cafeInfo.hours.weekdays}
                    onChange={(e) => setCafeInfo({ ...cafeInfo, hours: { ...cafeInfo.hours, weekdays: e.target.value } })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#0B1728]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Weekend Hours (Fri - Sun)</label>
                  <input
                    type="text"
                    value={cafeInfo.hours.weekends}
                    onChange={(e) => setCafeInfo({ ...cafeInfo, hours: { ...cafeInfo.hours, weekends: e.target.value } })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#0B1728]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Contact / Concierge Phone</label>
                  <input
                    type="text"
                    value={cafeInfo.phone}
                    onChange={(e) => setCafeInfo({ ...cafeInfo, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#0B1728]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => showToast('Café settings saved!')}
                    className="px-6 py-2.5 rounded-xl bg-[#0B1728] hover:bg-[#1B365D] text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* BOTTOM FOOTER */}
          {/* ===================================================================== */}
          <footer className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 pt-4 pb-2 border-t border-slate-200">
            <span>Sage Café &amp; Roastery &bull; Hazratganj, Lucknow</span>
            <span className="mt-1 sm:mt-0">&copy; 2026 Sage Café. All rights reserved.</span>
          </footer>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. MODAL: VIEW FULL RESERVATION DETAILS */}
      {/* ========================================================================= */}
      {viewResModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#F4B245] uppercase">
                  Booking Ref #{viewResModal._id?.slice(-4) || viewResModal.id}
                </span>
                <h3 className="text-xl font-serif font-bold text-slate-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Reservation Overview
                </h3>
              </div>
              <button onClick={() => setViewResModal(null)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Guest Name:</span>
                  <span className="font-bold text-slate-900">{viewResModal.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <span className="font-mono text-slate-900">{viewResModal.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-mono text-slate-900">{viewResModal.email || 'None'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date &amp; Time:</span>
                  <span className="font-bold text-[#0B1728]">{viewResModal.date} at {viewResModal.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Party Size:</span>
                  <span className="font-bold text-slate-900">{viewResModal.guests} Guests</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Section:</span>
                  <span className="font-semibold text-slate-900">{viewResModal.experience || 'Main Dining'}</span>
                </div>
              </div>

              {viewResModal.specialRequests && (
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/60 text-amber-900">
                  <strong className="block mb-0.5">Special Requests:</strong>
                  <span>&ldquo;{viewResModal.specialRequests}&rdquo;</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  handleUpdateStatus(viewResModal._id || viewResModal.id, 'confirmed');
                  setViewResModal(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#1B365D] hover:bg-[#132A4A] text-white font-bold text-xs"
              >
                Confirm &amp; Send Mail
              </button>
              <button
                onClick={() => {
                  handleUpdateStatus(viewResModal._id || viewResModal.id, 'declined');
                  setViewResModal(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL: CUSTOM NOTE & RESCHEDULE EMAIL */}
      {/* ========================================================================= */}
      {customModalOpen && selectedResForCustom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#F4B245] uppercase">
                  Direct Dispatch &bull; {selectedResForCustom.name}
                </span>
                <h3 className="text-xl font-serif font-bold text-slate-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Send Custom Note / Reschedule
                </h3>
              </div>
              <button onClick={() => setCustomModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Slot:</span>
                  <span className="font-bold text-[#0B1728]">{selectedResForCustom.date} at {selectedResForCustom.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-mono text-slate-700">{selectedResForCustom.email || 'No email registered'}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Manager Custom Message
                </label>
                <textarea
                  rows={3}
                  value={modalCustomMsg}
                  onChange={(e) => setModalCustomMsg(e.target.value)}
                  placeholder="e.g. Our main lounge is fully booked at 7:30 PM, but we have reserved an alternate terrace table for you at 8:30 PM."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#0B1728] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Suggest Alternate Time</label>
                  <input
                    type="text"
                    value={modalAltTime}
                    onChange={(e) => setModalAltTime(e.target.value)}
                    placeholder="e.g. 08:30 PM"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono focus:outline-none focus:border-[#0B1728]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Suggest Alternate Date</label>
                  <input
                    type="date"
                    value={modalAltDate}
                    onChange={(e) => setModalAltDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono focus:outline-none focus:border-[#0B1728]"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                disabled={sendingCustomEmail}
                onClick={() => handleSendCustomResEmail('update')}
                className="flex-1 py-3 rounded-xl bg-[#E58B20] hover:bg-[#d47c13] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{sendingCustomEmail ? 'Sending...' : 'Send Note & Reschedule'}</span>
              </button>

              <button
                type="button"
                disabled={sendingCustomEmail}
                onClick={() => handleSendCustomResEmail('confirm')}
                className="px-4 py-3 rounded-xl bg-[#1B365D] hover:bg-[#132A4A] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>Confirm &amp; Send</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL: CREATE / EDIT EVENT GATHERING (CLOUDINARY & MONGO STORAGE)      */}
      {/* ========================================================================= */}
      {eventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#E58B20]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#E58B20] uppercase">
                    CMS Desk &bull; {editingEventId ? 'Update Listing' : 'Publish Gathering'}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-slate-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {editingEventId ? 'Edit Event Gathering' : 'Create New Event'}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEventModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
              
              {/* Image Upload Box */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5 uppercase font-mono text-[11px]">
                  Event Cover Photo (Upload to Cloudinary)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  {eventImagePreview ? (
                    <img
                      src={eventImagePreview}
                      alt="Preview"
                      className="w-28 h-20 rounded-xl object-cover border border-slate-200 shrink-0 shadow-xs"
                    />
                  ) : (
                    <div className="w-28 h-20 rounded-xl bg-slate-200/80 border border-slate-300 flex flex-col items-center justify-center text-slate-400 shrink-0">
                      <Upload className="w-5 h-5 mb-1" />
                      <span className="text-[9px] font-mono">No Image</span>
                    </div>
                  )}

                  <div className="space-y-1.5 flex-1">
                    <label className="cursor-pointer px-4 py-2 rounded-xl bg-[#0B1728] hover:bg-[#1B365D] text-white text-xs font-semibold inline-flex items-center gap-2 transition-all shadow-xs">
                      <Upload className="w-3.5 h-3.5 text-[#F4B245]" />
                      <span>{eventImageFile ? 'Change Photo' : 'Select Photo File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleEventImageSelect}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[10px] text-slate-500">
                      Supports JPG, PNG, WebP up to 10MB. Images are hosted on Cloudinary CDN.
                    </p>
                  </div>
                </div>
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">Event Title *</label>
                  <input
                    type="text"
                    required
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    placeholder="e.g. Midnight Vinyl & Velvet Jazz Sessions"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#0B1728]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <select
                    value={eventForm.category}
                    onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#0B1728]"
                  >
                    <option value="music">Live Jazz &amp; Vinyl</option>
                    <option value="coffee">Coffee Workshops</option>
                    <option value="bakery">Baking Masterclasses</option>
                    <option value="community">Open Mic &amp; Poetry</option>
                  </select>
                </div>
              </div>

              {/* Tag & Host */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Event Badge Tag</label>
                  <input
                    type="text"
                    value={eventForm.tag}
                    onChange={(e) => setEventForm({ ...eventForm, tag: e.target.value })}
                    placeholder="e.g. RESIDENT NIGHT, MASTERCLASS"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#0B1728]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Host / Performer</label>
                  <input
                    type="text"
                    value={eventForm.host}
                    onChange={(e) => setEventForm({ ...eventForm, host: e.target.value })}
                    placeholder="e.g. Featuring The Sagē Trio & DJ Julian"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#0B1728]"
                  />
                </div>
              </div>

              {/* Date, Time, Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Date</label>
                  <input
                    type="text"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    placeholder="e.g. THURSDAY, OCT 16"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#0B1728]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Time</label>
                  <input
                    type="text"
                    value={eventForm.time}
                    onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                    placeholder="e.g. 08:00 PM – 11:30 PM"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#0B1728]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Venue / Space</label>
                  <input
                    type="text"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    placeholder="e.g. Terrace Pergola"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#0B1728]"
                  />
                </div>
              </div>

              {/* Price & Includes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Price Label (e.g. ₹250 / guest)</label>
                  <input
                    type="text"
                    value={eventForm.price}
                    onChange={(e) => setEventForm({ ...eventForm, price: e.target.value })}
                    placeholder="e.g. ₹250 / guest or Free Entry"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#0B1728]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Includes / Perks</label>
                  <input
                    type="text"
                    value={eventForm.includes}
                    onChange={(e) => setEventForm({ ...eventForm, includes: e.target.value })}
                    placeholder="e.g. Welcome spritz & snack platter"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#0B1728]"
                  />
                </div>
              </div>

              {/* Total Spots & Spots Left */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Total Capacity (Spots)</label>
                  <input
                    type="number"
                    min="1"
                    value={eventForm.totalSpots}
                    onChange={(e) => setEventForm({ ...eventForm, totalSpots: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#0B1728]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Available Spots Left</label>
                  <input
                    type="number"
                    min="0"
                    value={eventForm.spotsLeft}
                    onChange={(e) => setEventForm({ ...eventForm, spotsLeft: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#0B1728]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Event Narrative / Description</label>
                <textarea
                  rows={3}
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  placeholder="Describe the gathering vibe, music curation, or masterclass details..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#0B1728] resize-none"
                />
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="featuredEventCheckbox"
                  checked={eventForm.featured}
                  onChange={(e) => setEventForm({ ...eventForm, featured: e.target.checked })}
                  className="rounded text-[#0A6473] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="featuredEventCheckbox" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Feature this gathering prominently on the public homepage &amp; event top banner
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEventModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEvent}
                  className="px-6 py-2.5 rounded-xl bg-[#0B1728] hover:bg-[#1B365D] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {savingEvent ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to Cloudinary &amp; DB...</span>
                    </>
                  ) : (
                    <span>{editingEventId ? 'Update Gathering' : 'Publish Gathering'}</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODAL: VIEW FULL ATTENDEE BOOKING RECEIPT & RAZORPAY DETAILS           */}
      {/* ========================================================================= */}
      {viewBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#0A6473] uppercase">
                  Pass Ref #{viewBookingModal.bookingId || viewBookingModal._id?.slice(-6)}
                </span>
                <h3 className="text-xl font-serif font-bold text-slate-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Attendee Ticket Pass
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewBookingModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Attendee:</span>
                  <span className="font-bold text-slate-900">{viewBookingModal.guestName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <span className="font-mono text-slate-900">{viewBookingModal.guestPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-mono text-slate-900">{viewBookingModal.guestEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Event:</span>
                  <span className="font-bold text-[#0A6473]">{viewBookingModal.eventTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date &amp; Time:</span>
                  <span className="font-semibold text-slate-800">{viewBookingModal.eventDate} at {viewBookingModal.eventTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Passes Count:</span>
                  <span className="font-bold text-slate-900">{viewBookingModal.ticketsCount || 1} Passes</span>
                </div>
              </div>

              {/* Razorpay Gateway Receipt Block */}
              <div className="p-3 bg-teal-50/70 border border-teal-200/80 rounded-2xl space-y-1.5 text-teal-950">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono uppercase font-bold text-teal-800">Razorpay Payment ID:</span>
                  <span className="font-mono font-bold text-xs bg-white px-2 py-0.5 rounded border border-teal-200">
                    {viewBookingModal.razorpayPaymentId || 'pay_direct_entry'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono uppercase font-bold text-teal-800">Razorpay Order ID:</span>
                  <span className="font-mono text-[11px] text-teal-900">
                    {viewBookingModal.razorpayOrderId || 'order_direct'}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-teal-200/60 font-bold">
                  <span>Total Amount Paid:</span>
                  <span className="text-sm font-bold text-emerald-700">₹{viewBookingModal.totalAmount}</span>
                </div>
              </div>

              {viewBookingModal.specialRequests && (
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/60 text-amber-900">
                  <strong className="block mb-0.5">Special Requests:</strong>
                  <span>&ldquo;{viewBookingModal.specialRequests}&rdquo;</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  const cleanPhone = (viewBookingModal.guestPhone || '').replace(/[^0-9]/g, '');
                  const text = encodeURIComponent(
                    `*SAGĒ CAFÉ GATHERINGS — EVENT TICKET PASS*\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                    `*Pass Ref:* #${viewBookingModal.bookingId}\n` +
                    `*Guest:* ${viewBookingModal.guestName}\n` +
                    `*Event:* ${viewBookingModal.eventTitle}\n` +
                    `*Date:* ${viewBookingModal.eventDate} at ${viewBookingModal.eventTime}\n` +
                    `*Tickets:* ${viewBookingModal.ticketsCount} Guests\n` +
                    `*Payment ID:* ${viewBookingModal.razorpayPaymentId}\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                    `Hello ${viewBookingModal.guestName}, your event admission pass is confirmed! We look forward to hosting you at Sagē Café Hazratganj.`
                  );
                  window.open(`https://wa.me/${cleanPhone || '915224028899'}?text=${text}`, '_blank');
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Guest Slip</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {newResModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#F4B245] uppercase">Host Desk Entry</span>
                <h3 className="text-xl font-serif font-bold text-slate-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Book New Table Reservation
                </h3>
              </div>
              <button onClick={() => setNewResModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateNewReservation} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Guest Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vivang Mishra"
                    value={newResForm.name}
                    onChange={(e) => setNewResForm({ ...newResForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0B1728]"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 95698 81374"
                    value={newResForm.phone}
                    onChange={(e) => setNewResForm({ ...newResForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0B1728]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Guest Email (for instant confirmation)</label>
                <input
                  type="email"
                  placeholder="guest@example.com"
                  value={newResForm.email}
                  onChange={(e) => setNewResForm({ ...newResForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0B1728]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newResForm.date}
                    onChange={(e) => setNewResForm({ ...newResForm, date: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0B1728]"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Time</label>
                  <input
                    type="text"
                    required
                    placeholder="07:30 PM"
                    value={newResForm.time}
                    onChange={(e) => setNewResForm({ ...newResForm, time: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0B1728]"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Guests</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    required
                    value={newResForm.guests}
                    onChange={(e) => setNewResForm({ ...newResForm, guests: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0B1728]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Seating Section</label>
                <select
                  value={newResForm.experience}
                  onChange={(e) => setNewResForm({ ...newResForm, experience: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0B1728]"
                >
                  <option value="Main Artisanal Dining Room">Main Artisanal Dining Room</option>
                  <option value="The Glasshouse Patio &amp; Garden">The Glasshouse Patio &amp; Garden</option>
                  <option value="Terrace &amp; Roastery Lounge">Terrace &amp; Roastery Lounge</option>
                  <option value="Private Tasting Cellar">Private Tasting Cellar</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Special Requests / Occasion</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Birthday celebration, window seat requested."
                  value={newResForm.specialRequests}
                  onChange={(e) => setNewResForm({ ...newResForm, specialRequests: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0B1728] resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#0B1728] hover:bg-[#1B365D] text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                >
                  Confirm &amp; Create Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPage;
