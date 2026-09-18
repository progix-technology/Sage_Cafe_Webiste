import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin.js';

dotenv.config();

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sage_cafe';
  try {
    const conn = await mongoose.connect(uri, {
      dbName: 'sage_cafe',
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`🌿 MongoDB Connected: ${conn.connection.host} (Database: sage_cafe)`);

    // Ensure Admin Account is seeded in MongoDB Atlas
    try {
      const adminEmail = (process.env.ADMIN_EMAIL || 'sageowner@gmail.com').trim().toLowerCase();
      const adminPassword = process.env.ADMIN_PASSWORD || 'sage@123';
      const existingAdmin = await Admin.findOne({ email: adminEmail });
      if (!existingAdmin) {
        await Admin.create({
          email: adminEmail,
          password: adminPassword,
          role: 'owner',
          cafeName: 'Sage Café & Roastery Hazratganj',
        });
        console.log(`🔐 Initialized Secure Bcrypt Admin Account in MongoDB for: ${adminEmail}`);
      }
    } catch (seedErr) {
      console.warn('Admin seed notice:', seedErr.message);
    }

    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    return false;
  }
};

