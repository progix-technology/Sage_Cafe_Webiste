import express from 'express';
import mongoose from 'mongoose';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { Event } from '../models/Event.js';
import { EventBooking } from '../models/EventBooking.js';
import { sendEventTicketConfirmationEmail } from '../config/emailService.js';

const router = express.Router();

// -------------------------------------------------------------
// Cloudinary & Multer Config for Event Banner Uploads
// -------------------------------------------------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dbp97xecb',
  api_key: process.env.CLOUDINARY_API_KEY || '581168557759297',
  api_secret: process.env.CLOUDINARY_API_SECRET || '77hhhHW4y7kmdDBhuYnRnlc1YAk',
});

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPG, PNG, WEBP) are allowed'), false);
    }
  },
});

// -------------------------------------------------------------
// Razorpay Instance Initialization
// -------------------------------------------------------------
const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_placeholder_secret';
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

// Initial Events Seed Data (Populates MongoDB on first run)
const INITIAL_EVENTS = [
  {
    title: 'Midnight Vinyl & Velvet Jazz Sessions',
    category: 'music',
    tag: 'RESIDENT NIGHT',
    host: 'Featuring The Sagē Trio & DJ Julian',
    date: 'THURSDAY, SEPT 18',
    time: '08:00 PM – 11:30 PM',
    location: 'Terrace Pergola & Cocktail Lounge',
    price: 999,
    includes: 'Welcome botanical spritz & house sourdough bites',
    totalSpots: 30,
    spotsLeft: 8,
    featured: true,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=85',
    description:
      'An intimate candlelit evening with rare 1970s soul & modal jazz vinyl records spun live, paired with house herbal tonics and warm hearth bakes under the terrace string lights.',
  },
  {
    title: 'Single-Origin Cupping & Sensory Workshop',
    category: 'coffee',
    tag: 'MASTERCLASS',
    host: 'Led by Master Roaster Marco Vance',
    date: 'SATURDAY, SEPT 20',
    time: '10:00 AM – 12:30 PM',
    location: 'Artisanal Roastery Salon',
    price: 1499,
    includes: 'Tasting of 6 rare microlots + 250g bean bag to take home',
    totalSpots: 15,
    spotsLeft: 4,
    featured: false,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85',
    description:
      'Explore origin terroir, processing methods (anaerobic, honey, natural), and calibration techniques. Learn how to smell, slurp, and score coffee like certified Q-graders.',
  },
  {
    title: '36-Hour Wild Yeast Sourdough & Lamination',
    category: 'bakery',
    tag: 'HANDS-ON BAKING',
    host: 'With Head Baker Elena Moreau',
    date: 'SUNDAY, SEPT 21',
    time: '09:00 AM – 01:00 PM',
    location: 'Hearth Bakery Kitchen',
    price: 1999,
    includes: 'Freshly baked loaf, starter jar & artisanal brunch platter',
    totalSpots: 12,
    spotsLeft: 3,
    featured: true,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=85',
    description:
      'Demystify sourdough baking from nurturing a wild starter, mixing high hydration doughs, to intricate scoring techniques and hand-laminating cardamom brioche.',
  },
  {
    title: 'Sagē Words: Acoustic & Spoken Word Open Mic',
    category: 'community',
    tag: 'COMMUNITY STAGE',
    host: 'Curated by The City Writers Collective',
    date: 'TUESDAY, SEPT 23',
    time: '07:30 PM – 10:30 PM',
    location: 'The Library Lounge',
    price: 0,
    includes: 'Complimentary pour-over coffee bar for performers',
    totalSpots: 40,
    spotsLeft: 12,
    featured: false,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=85',
    description:
      'A warm, welcoming stage for songwriters, poets, and storytellers. Enjoy acoustic guitars, candid stories, and fresh herbal teas in our cozy bookshelf salon.',
  },
  {
    title: 'Golden Hour Acoustic Chillout: Strings & Soul',
    category: 'music',
    tag: 'TERRACE VIBES',
    host: 'Featuring Cello & Guitar Duo Maya & Leon',
    date: 'FRIDAY, SEPT 26',
    time: '06:00 PM – 09:00 PM',
    location: 'Al Fresco Terrace Pergola',
    price: 799,
    includes: 'Table reserve + choice of botanical mocktail or specialty elixir',
    totalSpots: 25,
    spotsLeft: 8,
    featured: false,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=85',
    description:
      'Unwind as the sunset filters through our climbing jasmine pergolas with classical meets indie folk arrangements and shared mezze platters.',
  },
];

// Helper: Ensure initial events exist in DB
const ensureEventsSeed = async () => {
  try {
    const count = await Event.countDocuments();
    if (count === 0) {
      await Event.insertMany(INITIAL_EVENTS);
      console.log('🎉 Seeded initial Sagē Café events in MongoDB Atlas.');
    }
  } catch (err) {
    console.warn('Events seed notice:', err.message);
  }
};
ensureEventsSeed();

// -------------------------------------------------------------
// 1. PUBLIC: GET /api/events (Fetch all active events)
// -------------------------------------------------------------
router.get('/', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json({ success: true, count: INITIAL_EVENTS.length, data: INITIAL_EVENTS });
  }
  try {
    const events = await Event.find({ status: { $ne: 'cancelled' } }).sort({ createdAt: -1 }).maxTimeMS(3000);
    return res.json({ success: true, count: events.length, data: events });
  } catch (error) {
    console.warn('Error fetching events from DB, serving initial events:', error.message);
    return res.json({ success: true, count: INITIAL_EVENTS.length, data: INITIAL_EVENTS });
  }
});

// -------------------------------------------------------------
// 2. ADMIN: POST /api/events (Create a new Event with optional Image upload)
// -------------------------------------------------------------
router.post('/', upload.single('imageFile'), async (req, res) => {
  try {
    const {
      title,
      category,
      tag,
      host,
      date,
      time,
      location,
      price,
      includes,
      totalSpots,
      spotsLeft,
      imageUrl,
      description,
      featured,
    } = req.body;

    if (!title || !date || !time || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title, Date, Time, and Description are required fields.',
      });
    }

    let finalImageUrl = imageUrl || '';

    // If image file was uploaded, upload to Cloudinary
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const uploadRes = await cloudinary.uploader.upload(dataURI, {
        folder: 'sage_cafe_events',
        resource_type: 'image',
      });
      finalImageUrl = uploadRes.secure_url;
    }

    if (!finalImageUrl) {
      finalImageUrl =
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=85';
    }

    const spots = Number(totalSpots) || 20;

    const event = await Event.create({
      title: title.trim(),
      category: category || 'special',
      tag: tag || 'EXCLUSIVE EVENT',
      host: host || 'Sagē Curators',
      date: date.trim(),
      time: time.trim(),
      location: location || 'Terrace Pergola & Lounge',
      price: Number(price) || 0,
      includes: includes || 'Welcome drink & artisanal bakes',
      totalSpots: spots,
      spotsLeft: Number(spotsLeft) !== undefined ? Number(spotsLeft) : spots,
      image: finalImageUrl,
      description: description.trim(),
      featured: featured === 'true' || featured === true,
      status: 'active',
    });

    console.log(`🎉 New Event Created in MongoDB: "${event.title}" on ${event.date}`);

    return res.status(201).json({
      success: true,
      message: 'Event created and published successfully!',
      data: event,
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to create event' });
  }
});

// Helper to safely locate an event by MongoDB ObjectId or title fallback
const findEventSafely = async (eventId, eventTitle) => {
  if (eventId && mongoose.isValidObjectId(eventId)) {
    const found = await Event.findById(eventId);
    if (found) return found;
  }
  if (eventTitle && typeof eventTitle === 'string') {
    const found = await Event.findOne({ title: new RegExp(`^${eventTitle.trim()}$`, 'i') });
    if (found) return found;
    const partialMatch = await Event.findOne({ title: new RegExp(eventTitle.trim().slice(0, 15), 'i') });
    if (partialMatch) return partialMatch;
  }
  return await Event.findOne({ status: 'active' }) || await Event.findOne();
};

// -------------------------------------------------------------
// 3. ADMIN: PATCH /api/events/:id (Update Event details / image)
// -------------------------------------------------------------
router.patch('/:id', upload.single('imageFile'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Event ID format' });
    }
    const updateData = { ...req.body };

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const uploadRes = await cloudinary.uploader.upload(dataURI, {
        folder: 'sage_cafe_events',
        resource_type: 'image',
      });
      updateData.image = uploadRes.secure_url;
    }

    if (updateData.price !== undefined) updateData.price = Number(updateData.price);
    if (updateData.totalSpots !== undefined) updateData.totalSpots = Number(updateData.totalSpots);
    if (updateData.spotsLeft !== undefined) updateData.spotsLeft = Number(updateData.spotsLeft);
    if (updateData.featured !== undefined) updateData.featured = updateData.featured === 'true' || updateData.featured === true;

    const updated = await Event.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    return res.json({
      success: true,
      message: 'Event updated successfully!',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return res.status(500).json({ success: false, message: 'Failed to update event' });
  }
});

// -------------------------------------------------------------
// 4. ADMIN: DELETE /api/events/:id (Delete Event)
// -------------------------------------------------------------
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Event ID format' });
    }
    const deleted = await Event.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    return res.json({ success: true, message: 'Event deleted successfully from database' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete event' });
  }
});

// -------------------------------------------------------------
// 5. PUBLIC: POST /api/events/create-payment-order (Initiate Razorpay Order)
// -------------------------------------------------------------
router.post('/create-payment-order', async (req, res) => {
  try {
    const { eventId, eventTitle, ticketPrice, ticketsCount = 1, guestName, guestEmail, guestPhone } = req.body;

    if (!guestName || !guestEmail || !guestPhone) {
      return res.status(400).json({
        success: false,
        message: 'Guest Name, Email, and Phone number are required.',
      });
    }

    const event = await findEventSafely(eventId, eventTitle);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event gathering not found' });
    }

    const count = Math.max(1, Number(ticketsCount) || 1);

    if (event.spotsLeft < count && event.spotsLeft > 0) {
      return res.status(400).json({
        success: false,
        message: `Only ${event.spotsLeft} ticket(s) left for this gathering.`,
      });
    }

    const unitPrice = typeof event.price === 'number' ? event.price : (Number(ticketPrice) || 0);
    const totalAmount = unitPrice * count; // Total in INR

    // If event is free ($0 / ₹0 RSVP)
    if (totalAmount === 0) {
      return res.json({
        success: true,
        isFree: true,
        amount: 0,
        currency: 'INR',
        eventTitle: event.title,
        message: 'Free RSVP Gathering. No payment required.',
      });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Check if live Razorpay keys are configured
    if (keyId && keySecret && keyId !== 'rzp_test_placeholder_key') {
      const razorpay = getRazorpayInstance();
      const options = {
        amount: Math.round(totalAmount * 100), // Amount in paise (e.g. ₹500 = 50000 paise)
        currency: 'INR',
        receipt: `rcpt_${Date.now().toString().slice(-8)}`,
        notes: {
          eventId: event._id.toString(),
          eventTitle: event.title,
          guestName: guestName.trim(),
          ticketsCount: count,
        },
      };

      const order = await razorpay.orders.create(options);

      return res.json({
        success: true,
        isFree: false,
        orderId: order.id,
        amount: totalAmount,
        amountPaise: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
        eventTitle: event.title,
      });
    } else {
      // Razorpay Test / Sandbox simulation mode
      const mockOrderId = `order_sim_${Date.now()}`;
      return res.json({
        success: true,
        isFree: false,
        isSandbox: true,
        orderId: mockOrderId,
        amount: totalAmount,
        currency: 'INR',
        keyId: keyId || 'rzp_test_simulated_key',
        eventTitle: event.title,
        message: 'Razorpay Sandbox Mode: Simulated checkout order created.',
      });
    }
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to initiate payment order.',
    });
  }
});

// -------------------------------------------------------------
// 6. PUBLIC: POST /api/events/verify-payment (Verify Signature & Confirm Ticket)
// -------------------------------------------------------------
router.post('/verify-payment', async (req, res) => {
  try {
    const {
      eventId,
      eventTitle,
      ticketsCount = 1,
      guestName,
      guestEmail,
      guestPhone,
      specialRequests,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      isFree,
    } = req.body;

    if (!guestName || !guestEmail || !guestPhone) {
      return res.status(400).json({
        success: false,
        message: 'Missing essential attendee information.',
      });
    }

    const event = await findEventSafely(eventId, eventTitle);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const count = Math.max(1, Number(ticketsCount) || 1);
    const totalAmount = isFree ? 0 : event.price * count;

    // Verify HMAC SHA256 Signature if paid event and live Razorpay keys set
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!isFree && keySecret && keySecret !== 'rzp_test_placeholder_secret' && razorpayOrderId && razorpayPaymentId && razorpaySignature) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      if (generatedSignature !== razorpaySignature) {
        return res.status(400).json({
          success: false,
          message: 'Payment verification failed: Invalid transaction signature.',
        });
      }
    }

    // Create Event Booking in MongoDB Atlas
    const booking = await EventBooking.create({
      event: event._id,
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: event.time,
      eventLocation: event.location,
      ticketPrice: event.price,
      ticketsCount: count,
      totalAmount,
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim().toLowerCase(),
      guestPhone: guestPhone.trim(),
      specialRequests: (specialRequests || '').trim(),
      razorpayOrderId: razorpayOrderId || `FREE_RSVP_${Date.now()}`,
      razorpayPaymentId: razorpayPaymentId || `FREE_PASS_${Date.now()}`,
      razorpaySignature: razorpaySignature || '',
      paymentStatus: isFree ? 'free_rsvp' : 'paid',
      paymentMethod: isFree ? 'Free Community Pass' : 'Razorpay (UPI / Card / Netbanking)',
    });

    // Decrement available spots in Event document
    event.spotsLeft = Math.max(0, event.spotsLeft - count);
    if (event.spotsLeft === 0) {
      event.status = 'sold-out';
    }
    await event.save();

    console.log(`🎟️ [TICKET BOOKED & VERIFIED] Booking #${booking.bookingId} for ${guestName} (${event.title})`);

    // Send confirmation email asynchronously with ticket receipt
    sendEventTicketConfirmationEmail(booking).catch((err) =>
      console.error('Ticket confirmation email dispatch error:', err.message)
    );

    return res.status(201).json({
      success: true,
      message: 'Ticket confirmed successfully!',
      booking,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while verifying ticket payment.',
    });
  }
});

// -------------------------------------------------------------
// 7. ADMIN: GET /api/events/bookings (Fetch all ticket bookings)
// -------------------------------------------------------------
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await EventBooking.find().sort({ createdAt: -1 });
    return res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    console.error('Error fetching event bookings:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch ticket bookings' });
  }
});

// -------------------------------------------------------------
// 8. ADMIN: DELETE /api/events/bookings/:id (Delete / Cancel Ticket)
// -------------------------------------------------------------
router.delete('/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await EventBooking.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    return res.json({ success: true, message: 'Booking record removed successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete booking' });
  }
});

export default router;
