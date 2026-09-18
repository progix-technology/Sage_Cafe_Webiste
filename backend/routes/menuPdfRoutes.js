import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cloudinary, { isCloudinaryConfigured } from '../config/cloudinary.js';
import Setting from '../models/Setting.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../uploads');

// Ensure local uploads directory exists for fallback
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Memory storage for multer so we can stream to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF documents are allowed.'), false);
    }
  },
});

const VALID_SECTIONS = ['all', 'breakfast', 'lunch-dinner', 'dessert', 'beverages'];

/**
 * Helper to automatically delete previous PDF from Cloudinary or local disk
 */
const deletePreviousPdfFile = async (prevData) => {
  if (!prevData || typeof prevData !== 'object') return;

  // 1. Delete from Cloudinary if public ID or Cloudinary URL exists
  try {
    if (isCloudinaryConfigured()) {
      let publicId = prevData.cloudinaryPublicId;
      
      // If public ID was not stored directly, extract from URL
      if (!publicId && prevData.url && prevData.url.includes('res.cloudinary.com')) {
        const parts = prevData.url.split('/upload/');
        if (parts[1]) {
          const cleanPath = parts[1].replace(/^v\d+\//, '');
          publicId = cleanPath;
        }
      }

      if (publicId) {
        // Delete raw asset (and invalidate CDN cache)
        await cloudinary.uploader.destroy(publicId, { resource_type: 'raw', invalidate: true });
        const idWithoutExt = publicId.replace(/\.pdf$/i, '');
        await cloudinary.uploader.destroy(idWithoutExt, { resource_type: 'raw', invalidate: true });
        await cloudinary.uploader.destroy(idWithoutExt, { resource_type: 'image', invalidate: true });
        console.log(`🗑️ Auto-deleted old Cloudinary PDF: ${publicId}`);
      }
    }
  } catch (err) {
    console.warn('Could not auto-delete old Cloudinary PDF asset:', err.message);
  }

  // 2. Delete from local server disk if stored locally
  try {
    if (prevData.url && prevData.url.includes('/uploads/')) {
      const filename = path.basename(prevData.url);
      const localFilePath = path.join(uploadsDir, filename);
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
        console.log(`🗑️ Auto-deleted old local PDF file: ${filename}`);
      }
    }
  } catch (err) {
    console.warn('Could not auto-delete old local PDF file:', err.message);
  }
};

/**
 * @route   GET /api/menu-pdf
 * @desc    Get active Menu PDFs for all sections
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const settings = await Setting.find({ key: { $regex: /^menu_pdf/ } });
    
    const sections = {
      all: null,
      breakfast: null,
      'lunch-dinner': null,
      dessert: null,
      beverages: null,
    };

    settings.forEach((s) => {
      if (s.key === 'menu_pdf' || s.key === 'menu_pdf_all') {
        sections.all = s.value;
      } else {
        const secKey = s.key.replace('menu_pdf_', '');
        if (sections.hasOwnProperty(secKey)) {
          sections[secKey] = s.value;
        }
      }
    });

    const hasAnyPdf = Object.values(sections).some((v) => Boolean(v && v.url));
    const masterPdfUrl = sections.all?.url || Object.values(sections).find((v) => v?.url)?.url || '';

    res.json({
      success: true,
      hasMenuPdf: hasAnyPdf,
      menuPdfUrl: masterPdfUrl,
      sections,
    });
  } catch (err) {
    console.error('Error fetching Menu PDF:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch menu PDF' });
  }
});

/**
 * @route   POST /api/menu-pdf/upload
 * @desc    Upload new Menu PDF for specific section or all (Auto-deletes previous PDF)
 * @access  Admin / Staff
 */
router.post('/upload', upload.single('menuPdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select a PDF file to upload.' });
    }

    const section = (req.body.section || 'all').toLowerCase();
    const originalName = req.file.originalname || `Sage_${section}_Menu.pdf`;
    const fileSizeFormatted = `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`;
    const dbKey = section === 'all' ? 'menu_pdf' : `menu_pdf_${section}`;

    // 0. Auto-Delete previous PDF for this section from Cloudinary / Disk
    try {
      const prevSetting = await Setting.findOne({ key: dbKey });
      if (prevSetting && prevSetting.value) {
        await deletePreviousPdfFile(prevSetting.value);
      }
    } catch (prevErr) {
      console.warn('Error checking/deleting previous PDF:', prevErr.message);
    }

    let finalUrl = '';
    let cloudinaryPublicId = null;
    let storageType = 'Server';

    // 1. Try Cloudinary Upload if configured with fast timeout
    if (isCloudinaryConfigured()) {
      try {
        const publicIdTarget = `sage_cafe/menu_pdfs/${section}/sage_${section}_menu_${Date.now()}.pdf`;
        const uploadPromise = new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              resource_type: 'raw',
              public_id: publicIdTarget,
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });

        // 4.5s timeout for Cloudinary network stream
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Cloudinary timeout')), 4500)
        );

        const uploadResult = await Promise.race([uploadPromise, timeoutPromise]);
        if (uploadResult && uploadResult.secure_url) {
          finalUrl = uploadResult.secure_url;
          cloudinaryPublicId = uploadResult.public_id || publicIdTarget;
          storageType = 'Cloudinary';
        }
      } catch (cloudErr) {
        console.warn('Cloudinary upload error / 403 restriction, falling back to local server storage:', cloudErr.message);
      }
    }

    // 2. Fallback to local file storage if Cloudinary failed or unconfigured
    if (!finalUrl) {
      const uniqueFileName = `sage_${section}_menu_${Date.now()}.pdf`;
      const localFilePath = path.join(uploadsDir, uniqueFileName);
      fs.writeFileSync(localFilePath, req.file.buffer);
      
      const host = req.get('host') || 'localhost:5000';
      const protocol = req.protocol || 'http';
      finalUrl = `${protocol}://${host}/uploads/${uniqueFileName}`;
      storageType = 'Local Server';
    }

    // 3. Persist setting for this section
    const valueObj = {
      url: finalUrl,
      name: originalName,
      size: fileSizeFormatted,
      section,
      storageType,
      cloudinaryPublicId,
      uploadedAt: new Date(),
    };

    await Setting.findOneAndUpdate(
      { key: dbKey },
      {
        key: dbKey,
        value: valueObj,
        description: `Official Sagē Café Dine-In PDF Menu for ${section}`,
      },
      { upsert: true, new: true }
    );

    // Also update generic key if all
    if (section === 'all') {
      await Setting.findOneAndUpdate(
        { key: 'menu_pdf_all' },
        { key: 'menu_pdf_all', value: valueObj },
        { upsert: true }
      );
    }

    res.json({
      success: true,
      message: `🎉 ${section.toUpperCase()} PDF Menu uploaded successfully! (${storageType})`,
      section,
      menuPdfUrl: finalUrl,
      menuPdfName: originalName,
      fileSize: fileSizeFormatted,
      storageType,
      uploadedAt: new Date(),
    });
  } catch (err) {
    console.error('Upload Menu PDF error:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to upload menu PDF' });
  }
});

/**
 * @route   POST /api/menu-pdf/set-url
 * @desc    Directly link an external Cloudinary / Drive PDF URL to a section
 * @access  Admin / Staff
 */
router.post('/set-url', async (req, res) => {
  try {
    const { url, name, section = 'all' } = req.body;
    if (!url || !url.trim()) {
      return res.status(400).json({ success: false, message: 'Valid PDF URL is required.' });
    }

    const sec = section.toLowerCase();
    const dbKey = sec === 'all' ? 'menu_pdf' : `menu_pdf_${sec}`;

    // Auto-delete previous file if replacing
    try {
      const prevSetting = await Setting.findOne({ key: dbKey });
      if (prevSetting && prevSetting.value) {
        await deletePreviousPdfFile(prevSetting.value);
      }
    } catch (e) {}

    const valueObj = {
      url: url.trim(),
      name: name?.trim() || `Sage_${sec}_Menu.pdf`,
      size: 'Cloud Linked',
      section: sec,
      storageType: 'Direct URL',
      uploadedAt: new Date(),
    };

    await Setting.findOneAndUpdate(
      { key: dbKey },
      {
        key: dbKey,
        value: valueObj,
        description: `Official Sagē Café Dine-In PDF Menu for ${sec}`,
      },
      { upsert: true, new: true }
    );

    if (sec === 'all') {
      await Setting.findOneAndUpdate(
        { key: 'menu_pdf_all' },
        { key: 'menu_pdf_all', value: valueObj },
        { upsert: true }
      );
    }

    res.json({
      success: true,
      message: `PDF URL updated for ${sec.toUpperCase()}!`,
      section: sec,
      menuPdfUrl: url.trim(),
      menuPdfName: valueObj.name,
      uploadedAt: new Date(),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update PDF URL' });
  }
});

/**
 * @route   DELETE /api/menu-pdf
 * @desc    Remove attached Menu PDF for specific section or all (Auto-deletes from Cloudinary / Disk)
 * @access  Admin / Staff
 */
router.delete('/', async (req, res) => {
  try {
    const section = (req.query.section || 'all').toLowerCase();
    const dbKey = section === 'all' ? 'menu_pdf' : `menu_pdf_${section}`;

    // 1. Delete previous file from Cloudinary / Disk
    const prevSetting = await Setting.findOne({ key: dbKey });
    if (prevSetting && prevSetting.value) {
      await deletePreviousPdfFile(prevSetting.value);
    }

    // 2. Remove DB record
    await Setting.findOneAndDelete({ key: dbKey });
    if (section === 'all') {
      await Setting.findOneAndDelete({ key: 'menu_pdf_all' });
    }

    res.json({ success: true, message: `Menu PDF for ${section} removed & deleted successfully` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to remove menu PDF' });
  }
});

export default router;
