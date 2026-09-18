import express from 'express';
import { Reservation } from '../models/Reservation.js';
import { 
  sendReservationReceivedEmail, 
  sendReservationConfirmedEmail, 
  sendReservationCustomUpdateEmail 
} from '../config/emailService.js';

const router = express.Router();

// Helper function to cleanup expired declined reservations (older than 24 hours / 1 day)
const cleanupExpiredDeclinedReservations = async () => {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  try {
    const result = await Reservation.deleteMany({
      status: 'declined',
      $or: [
        { expireAt: { $ne: null, $lte: new Date() } },
        { declinedAt: { $ne: null, $lte: oneDayAgo } },
        { updatedAt: { $lte: oneDayAgo } }
      ]
    });
    if (result.deletedCount > 0) {
      console.log(`🧹 Auto-purged ${result.deletedCount} expired declined reservation(s) from MongoDB.`);
    }
  } catch (err) {
    console.error('Error during auto-purge:', err.message);
  }
};

// Periodic auto-clean every 30 minutes
setInterval(cleanupExpiredDeclinedReservations, 30 * 60 * 1000);

// @route   GET /api/reservations
// @desc    Get all reservations directly from MongoDB Atlas
router.get('/', async (req, res) => {
  try {
    await cleanupExpiredDeclinedReservations();
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    return res.json({ success: true, count: reservations.length, data: reservations });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch reservations from database' });
  }
});

// @route   POST /api/reservations
// @desc    Create a new table reservation in MongoDB & send automated confirmation email
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, date, time, guests, experience, specialRequests } = req.body;

    if (!name || !phone || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone number, date, and time are required.',
      });
    }

    const newResData = {
      name: name.trim(),
      phone: phone.trim(),
      email: (email || '').trim(),
      date,
      time,
      guests: Number(guests) || 2,
      experience: experience || 'Main Dining & Garden Room',
      specialRequests: specialRequests || '',
      status: 'new',
      customNote: '',
      declinedAt: null,
      expireAt: null,
    };

    const savedReservation = await Reservation.create(newResData);
    console.log(`🛎️ New Table Reservation Saved in MongoDB: ${name} (${guests} guests on ${date} at ${time})`);

    // Asynchronously dispatch luxury "Booking Received" email to user (not blocking response)
    if (savedReservation.email) {
      sendReservationReceivedEmail(savedReservation).catch((err) =>
        console.error('Email dispatch error on booking:', err)
      );
    }

    return res.status(201).json({
      success: true,
      message: 'Table reservation placed successfully! Our concierge will confirm in 2–3 hours.',
      data: savedReservation,
    });
  } catch (error) {
    console.error('Reservation creation error:', error);
    res.status(500).json({ success: false, message: 'Server error while booking reservation.' });
  }
});

// @route   PATCH /api/reservations/:id
// @desc    Update reservation status in MongoDB or send custom email
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, customNote, alternateTime, alternateDate, customMessage, sendCustomEmail } = req.body;

    const updateFields = {};
    if (status) updateFields.status = status;
    if (alternateDate) updateFields.date = alternateDate;
    if (alternateTime) updateFields.time = alternateTime;
    if (customNote || customMessage) updateFields.customNote = (customNote || customMessage).trim();

    // AUTO-EXPIRY RULES:
    if (status === 'declined') {
      const now = new Date();
      updateFields.declinedAt = now;
      updateFields.expireAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      console.log(`🗑️ Reservation #${id} marked DECLINED in MongoDB. Auto-deletion set for 24h.`);
    } else if (status === 'confirmed' || customNote || customMessage || sendCustomEmail) {
      updateFields.expireAt = null;
      updateFields.declinedAt = null;
    }

    const updated = await Reservation.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Reservation not found in database.' });
    }

    // Email Triggers:
    if (sendCustomEmail || customMessage || (alternateTime && status !== 'confirmed')) {
      sendReservationCustomUpdateEmail(
        updated, 
        customMessage || customNote, 
        alternateTime || '', 
        alternateDate || ''
      ).catch((e) => console.error('Custom update email error:', e));
    } else if (status === 'confirmed') {
      sendReservationConfirmedEmail(updated, customNote || '').catch((e) =>
        console.error('Confirmation email error:', e)
      );
    }

    return res.json({
      success: true,
      message: 'Reservation updated successfully in database!',
      data: updated,
    });
  } catch (error) {
    console.error('Reservation update error:', error);
    res.status(500).json({ success: false, message: 'Failed to update reservation in database.' });
  }
});

// @route   DELETE /api/reservations/:id
// @desc    Delete a reservation permanently from MongoDB Atlas
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Reservation.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }
    return res.json({ success: true, message: 'Reservation permanently deleted from database' });
  } catch (error) {
    console.error('Reservation delete error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete reservation' });
  }
});

export default router;
