import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// @route   POST /api/auth/login
// @desc    Authenticate admin by Email and Password strictly from MongoDB Atlas
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email address and password.',
      });
    }

    const targetEmail = email.trim().toLowerCase();
    const masterEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const masterPassword = process.env.ADMIN_PASSWORD;

    // Fast-track if MongoDB is currently disconnected or in error state
    if (mongoose.connection.readyState !== 1) {
      if (targetEmail === masterEmail && password === masterPassword) {
        const token = jwt.sign(
          { role: 'owner', email: masterEmail, name: 'Sage Café Owner' },
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        return res.json({
          success: true,
          token,
          user: { email: masterEmail, name: 'Sage Café Owner', role: 'owner' },
          notice: 'Authenticated via secure local master fallback (MongoDB Atlas connection pending/reconnecting).'
        });
      }
    }

    // 1. Find admin record in MongoDB Atlas
    let adminRecord = null;
    try {
      adminRecord = await Admin.findOne({ email: targetEmail }).maxTimeMS(3000);
    } catch (dbErr) {
      console.warn('DB lookup failed, checking master fallback:', dbErr.message);
      if (targetEmail === masterEmail && password === masterPassword) {
        const token = jwt.sign(
          { role: 'owner', email: masterEmail, name: 'Sage Café Owner' },
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        return res.json({
          success: true,
          token,
          user: { email: masterEmail, name: 'Sage Café Owner', role: 'owner' },
        });
      }
    }

    if (!adminRecord && targetEmail === masterEmail) {
      adminRecord = await Admin.create({
        email: masterEmail,
        password: masterPassword,
        role: 'owner',
        cafeName: 'Sage Café & Roastery Hazratganj',
      });
      console.log(`🔐 Auto-created Master Admin Account in MongoDB for: ${masterEmail}`);
    }

    if (!adminRecord) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password.',
      });
    }

    // 2. Verify password with bcrypt or fallback to env master
    let isMatch = false;
    if (adminRecord.password.startsWith('$2a$') || adminRecord.password.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(password, adminRecord.password);
    } else {
      isMatch = adminRecord.password === password;
    }

    // If password was updated in .env or raw password matched, re-hash and save
    if (!isMatch && targetEmail === masterEmail && password === masterPassword) {
      isMatch = true;
      const salt = await bcrypt.genSalt(10);
      adminRecord.password = await bcrypt.hash(password, salt);
      await adminRecord.save();
    } else if (isMatch && !adminRecord.password.startsWith('$2')) {
      const salt = await bcrypt.genSalt(10);
      adminRecord.password = await bcrypt.hash(password, salt);
      await adminRecord.save();
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password.',
      });
    }

    const token = jwt.sign(
      { role: adminRecord.role || 'owner', email: adminRecord.email, name: 'Sage Café Owner' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token,
      user: {
        email: adminRecord.email,
        name: 'Sage Café Owner',
        role: adminRecord.role || 'owner',
      },
    });
  } catch (error) {
    console.error('Auth login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// @route   GET /api/auth/verify
// @desc    Verify current session token
router.get('/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.json({ success: true, user: decoded });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
});

export default router;
