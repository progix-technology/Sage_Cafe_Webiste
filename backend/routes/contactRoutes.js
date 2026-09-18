import express from 'express';
import { Contact } from '../models/Contact.js';

const router = express.Router();

// @route   GET /api/contact
// @desc    Get all contact inquiries strictly from MongoDB Atlas
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return res.json({ success: true, count: contacts.length, data: contacts });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch contact inquiries from database' });
  }
});

// @route   POST /api/contact
// @desc    Submit a contact / inquiry message into MongoDB Atlas
router.post('/', async (req, res) => {
  try {
    const { name, contact, email, phone, purpose, subject, message } = req.body;

    if (!name || (!contact && !email && !phone)) {
      return res.status(400).json({
        success: false,
        message: 'Name and contact info (email or phone) are required.',
      });
    }

    const contactStr = (contact || email || phone || '').trim();
    const isEmail = contactStr.includes('@');

    const newMsgData = {
      name: name.trim(),
      contact: contactStr,
      email: email?.trim() || (isEmail ? contactStr : ''),
      phone: phone?.trim() || (!isEmail ? contactStr : ''),
      purpose: purpose || subject || 'General Inquiry',
      subject: subject || purpose || 'General Inquiry',
      message: (message || 'No additional message provided.').trim(),
      status: 'unread',
    };

    const savedContact = await Contact.create(newMsgData);
    console.log(`📩 New Guest Inquiry Saved in MongoDB from ${name} (${contactStr})`);

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Our team will get back to you shortly.',
      data: savedContact,
    });
  } catch (error) {
    console.error('Contact inquiry error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit inquiry' });
  }
});

// @route   PATCH /api/contact/:id
// @desc    Update contact inquiry status in MongoDB Atlas
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['read', 'unread', 'resolved'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const updated = await Contact.findByIdAndUpdate(id, { status }, { new: true });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    return res.json({
      success: true,
      message: `Status updated to ${status}`,
      data: updated,
    });
  } catch (error) {
    console.error('Contact status update error:', error);
    res.status(500).json({ success: false, message: 'Failed to update message status' });
  }
});

// @route   DELETE /api/contact/:id
// @desc    Delete a contact inquiry from MongoDB Atlas
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Contact.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    return res.json({ success: true, message: 'Inquiry deleted successfully from database' });
  } catch (error) {
    console.error('Contact delete error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete inquiry' });
  }
});

export default router;
