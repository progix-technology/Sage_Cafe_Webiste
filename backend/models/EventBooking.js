import mongoose from 'mongoose';

const eventBookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
      required: true,
      default: () => 'TKT-' + Math.floor(100000 + Math.random() * 900000),
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: false,
    },
    eventTitle: {
      type: String,
      required: true,
    },
    eventDate: {
      type: String,
      required: true,
    },
    eventTime: {
      type: String,
      required: true,
    },
    eventLocation: {
      type: String,
      default: 'Sagē Café Hazratganj',
    },
    ticketPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    ticketsCount: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    guestName: {
      type: String,
      required: [true, 'Guest name is required'],
      trim: true,
    },
    guestEmail: {
      type: String,
      required: [true, 'Guest email is required'],
      trim: true,
      lowercase: true,
    },
    guestPhone: {
      type: String,
      required: [true, 'Guest phone number is required'],
      trim: true,
    },
    specialRequests: {
      type: String,
      default: '',
    },
    razorpayOrderId: {
      type: String,
      default: '',
    },
    razorpayPaymentId: {
      type: String,
      default: '',
    },
    razorpaySignature: {
      type: String,
      default: '',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'free_rsvp', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      default: 'Razorpay (UPI / Card / Netbanking)',
    },
  },
  { timestamps: true }
);

export const EventBooking =
  mongoose.models.EventBooking || mongoose.model('EventBooking', eventBookingSchema);
export default EventBooking;
