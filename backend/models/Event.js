import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['music', 'coffee', 'bakery', 'community', 'special', 'all'],
      default: 'special',
    },
    tag: {
      type: String,
      default: 'EXCLUSIVE EVENT',
      trim: true,
    },
    host: {
      type: String,
      default: 'Sagē Café Curators',
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Event date is required'],
    },
    time: {
      type: String,
      required: [true, 'Event time is required'],
    },
    location: {
      type: String,
      default: 'Terrace Pergola & Lounge',
    },
    price: {
      type: Number,
      required: [true, 'Ticket price is required'],
      default: 0, // 0 for free RSVP
    },
    includes: {
      type: String,
      default: 'Welcome drink & artisanal bakes',
    },
    totalSpots: {
      type: Number,
      default: 20,
    },
    spotsLeft: {
      type: Number,
      default: 20,
    },
    image: {
      type: String,
      required: [true, 'Event banner image is required'],
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'sold-out', 'completed', 'cancelled'],
      default: 'active',
    },
  },
  { timestamps: true }
);

export const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);
export default Event;
