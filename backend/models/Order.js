import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, default: 1, min: 1 },
  notes: { type: String, default: '' },
});

const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      default: () => `ORD-${Date.now().toString().slice(-6)}`,
    },
    tableNo: {
      type: String,
      required: [true, 'Table number is required'],
      trim: true,
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    customerPhone: {
      type: String,
      required: [true, 'Customer contact phone is required'],
      trim: true,
    },
    items: [OrderItemSchema],
    customItemNotes: {
      type: String,
      default: '',
      trim: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    orderType: {
      type: String,
      enum: ['Dine-in (Table Service)', 'Takeaway Pickup'],
      default: 'Dine-in (Table Service)',
    },
    status: {
      type: String,
      enum: ['pending', 'preparing', 'served', 'completed', 'cancelled'],
      default: 'pending',
    },
    specialInstructions: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Order', OrderSchema);
