import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      default: 'sageowner@gmail.com',
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'owner',
    },
    cafeName: {
      type: String,
      default: 'Sage Café & Roastery Hazratganj',
    },
  },
  { timestamps: true }
);

// Pre-save hook to hash password with bcrypt
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to verify entered password against hashed password
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
