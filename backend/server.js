import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import authRoutes from './routes/authRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import menuPdfRoutes from './routes/menuPdfRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
connectDB();

// Security Headers against XSS
app.use(helmet());

// Data Sanitization against NoSQL Injection
app.use(mongoSanitize());

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL || 'https://sagecafe.in'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps or Postman)
      if (!origin) return callback(null, true);
      
      // Allow any localhost port for local development
      if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        return callback(null, true);
      }
      
      // Allow any Vercel preview or production URLs
      if (origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('The CORS policy for this API does not allow access from the specified origin.'), false);
    },
    credentials: true,
  })
);
app.use(express.json());

// Helper to skip rate limiting on localhost or during local development
const isLocalOrDev = (req) => {
  const ip = req.ip || req.connection?.remoteAddress || '';
  return (
    process.env.NODE_ENV !== 'production' ||
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip === '::ffff:127.0.0.1' ||
    ip.includes('127.0.0.1')
  );
};

// 1. Global API Rate Limiter (Protection against DDoS & high-frequency spam in production)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000, // Generous limit: 2000 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  skip: isLocalOrDev,
  message: {
    success: false,
    message: 'Server is currently receiving too many requests. Please wait a moment and try again.',
  },
});
app.use('/api', globalLimiter);

// 2. Strict Auth Rate Limiter (Brute-force protection for Admin PIN / Login)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 attempts per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  skip: isLocalOrDev,
  message: {
    success: false,
    message: 'Too many login attempts. For security, please try again in a few minutes.',
  },
});

// 3. Form & Booking Spam Protection Limiter (Contact, Reservations & Orders)
const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 submissions per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  skip: isLocalOrDev,
  message: {
    success: false,
    message: 'Too many requests. Please wait a few moments before trying again.',
  },
});

// Serve static uploads for fallback PDF menu storage
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root Health Check Route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    cafe: 'Sage Café & Roastery API',
    location: 'Hazratganj, Lucknow',
    time: new Date().toISOString(),
  });
});

// API Routes with tailored rate limiting
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/reservations', submissionLimiter, reservationRoutes);
app.use('/api/contact', submissionLimiter, contactRoutes);
app.use('/api/orders', submissionLimiter, orderRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/menu-pdf', menuPdfRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`\n==============================================`);
  console.log(`☕ SAGĒ CAFÉ BACKEND SERVER RUNNING`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🔐 Admin Email: ${process.env.ADMIN_EMAIL || 'sageowner@gmail.com'}`);
  console.log(`🔑 Admin Default PIN: ${process.env.ADMIN_PIN || '1234'}`);
  console.log(`==============================================\n`);
});
