import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sage_staff_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// =========================================================================
// AUTHENTICATION APIS (Strictly Authenticated via MongoDB Atlas Database)
// =========================================================================
export const loginWithCredentials = async (email, password) => {
  try {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      (error.code === 'ERR_NETWORK'
        ? 'Cannot connect to backend server. Please make sure the server is running.'
        : 'Invalid email address or password.');
    throw new Error(message);
  }
};

export const verifyToken = async () => {
  try {
    const res = await api.get('/auth/verify');
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Session expired. Please log in again.');
  }
};

// =========================================================================
// RESERVATION APIS (Stored directly in MongoDB Database)
// =========================================================================
export const createReservation = async (reservationData) => {
  try {
    const res = await api.post('/reservations', reservationData);
    return res.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      'Failed to place reservation. Please ensure the backend server is reachable.';
    throw new Error(message);
  }
};

export const getReservations = async () => {
  try {
    const res = await api.get('/reservations');
    return res.data?.data || [];
  } catch (error) {
    console.error('Error fetching reservations from database:', error);
    return [];
  }
};

export const updateReservationStatus = async (id, payloadOrStatus) => {
  try {
    const payload = typeof payloadOrStatus === 'string' ? { status: payloadOrStatus } : payloadOrStatus;
    const res = await api.patch(`/reservations/${id}`, payload);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update reservation in database.');
  }
};

// =========================================================================
// CONTACT & INQUIRY APIS (Stored directly in MongoDB Database)
// =========================================================================
export const submitContactMessage = async (contactData) => {
  try {
    const res = await api.post('/contact', contactData);
    return res.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      'Failed to send message. Please ensure backend server is online.';
    throw new Error(message);
  }
};

export const getContactMessages = async () => {
  try {
    const res = await api.get('/contact');
    return res.data?.data || [];
  } catch (error) {
    console.error('Error fetching contact messages from database:', error);
    return [];
  }
};

export const updateContactStatus = async (id, status) => {
  try {
    const res = await api.patch(`/contact/${id}`, { status });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update message status.');
  }
};

export const deleteContactMessage = async (id) => {
  try {
    const res = await api.delete(`/contact/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete message from database.');
  }
};

// =========================================================================
// MENU PDF CMS APIS (Stored directly in Cloudinary & MongoDB Database)
// =========================================================================
export const getMenuPdf = async () => {
  try {
    const res = await api.get('/menu-pdf');
    return res.data || { success: true, hasMenuPdf: false, menuPdfUrl: '', sections: {} };
  } catch (error) {
    console.error('Error fetching Menu PDF from database:', error);
    return { success: true, hasMenuPdf: false, menuPdfUrl: '', sections: {} };
  }
};

export const uploadMenuPdf = async (formData) => {
  try {
    const res = await api.post('/menu-pdf/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000,
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to upload PDF menu.');
  }
};

export const setMenuPdfUrl = async ({ url, name, section = 'all' }) => {
  try {
    const res = await api.post('/menu-pdf/set-url', { url, name, section });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update PDF link.');
  }
};

export const deleteMenuPdf = async (section = 'all') => {
  try {
    const res = await api.delete(`/menu-pdf?section=${section}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to remove PDF from database.');
  }
};

// =========================================================================
// TABLE ORDER APIS (Live Dining Orders Stored in MongoDB Database)
// =========================================================================
export const createTableOrder = async (orderData) => {
  try {
    const res = await api.post('/orders', orderData);
    return res.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      'Failed to place order. Please check connection with server.';
    throw new Error(message);
  }
};

export const getTableOrders = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await api.get(`/orders${query ? `?${query}` : ''}`);
    return res.data?.orders || [];
  } catch (error) {
    console.error('Error fetching orders from database:', error);
    return [];
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const res = await api.patch(`/orders/${id}/status`, { status });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update order status.');
  }
};

export const deleteTableOrder = async (id) => {
  try {
    const res = await api.delete(`/orders/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete order from database.');
  }
};

// =========================================================================
// EVENT MANAGEMENT & RAZORPAY TICKET APIS (Stored in MongoDB & Cloudinary)
// =========================================================================
export const getEvents = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await api.get(`/events${query ? `?${query}` : ''}`);
    return res.data?.data || [];
  } catch (error) {
    console.error('Error fetching events from database:', error);
    return [];
  }
};

export const createEvent = async (formData) => {
  try {
    const res = await api.post('/events', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create event in database.');
  }
};

export const updateEvent = async (id, formData) => {
  try {
    const res = await api.patch(`/events/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update event.');
  }
};

export const deleteEvent = async (id) => {
  try {
    const res = await api.delete(`/events/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete event from database.');
  }
};

// Razorpay Order Creation
export const createEventPaymentOrder = async (payload) => {
  try {
    const res = await api.post('/events/create-payment-order', payload);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to initialize payment gateway.');
  }
};

// Razorpay Payment Verification
export const verifyEventPayment = async (payload) => {
  try {
    const res = await api.post('/events/verify-payment', payload);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Payment verification failed.');
  }
};

// Admin Bookings & Attendees
export const getEventBookings = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await api.get(`/events/bookings${query ? `?${query}` : ''}`);
    return res.data?.bookings || res.data?.data || [];
  } catch (error) {
    console.error('Error fetching event bookings:', error);
    return [];
  }
};

export const deleteEventBooking = async (id) => {
  try {
    const res = await api.delete(`/events/bookings/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to remove booking record.');
  }
};

export default api;
