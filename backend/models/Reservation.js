import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      default: '',
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    guests: {
      type: Number,
      required: true,
      default: 2,
    },
    experience: {
      type: String,
      default: 'Main Dining & Garden Room',
    },
    specialRequests: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['new', 'confirmed', 'declined', 'completed'],
      default: 'new',
    },
    customNote: {
      type: String,
      default: '',
    },
    declinedAt: {
      type: Date,
      default: null,
    },
    // MongoDB TTL Index: Documents with an expireAt date will be automatically purged by MongoDB once the date is reached
    expireAt: {
      type: Date,
      default: null,
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

export const Reservation = mongoose.models.Reservation || mongoose.model('Reservation', reservationSchema);

