import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

// Load .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

import { Admin } from '../models/Admin.js';
import { Reservation } from '../models/Reservation.js';
import { Contact } from '../models/Contact.js';
import { MenuItem } from '../models/MenuItem.js';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI not found in .env file!');
  process.exit(1);
}

const initialMenuItems = [
  {
    name: 'Loaded Smash Burger & Fries Platter',
    slug: 'loaded-smash-burger-fries',
    category: 'burgers-mains',
    cuisineTag: 'American Gourmet',
    description: 'Double smashed crispy beef/chicken patty, melted gouda, grilled brioche, served with seasoned golden fries and house dip.',
    price: 349,
    dietaryType: 'non-veg',
    spiceLevel: 1,
    rating: 4.9,
    reviewsCount: 142,
    images: ['https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'],
    isSignatureDish: true,
    isAvailable: true,
    displayOrder: 1,
    prepTime: '12-15 min',
    calories: '720 kcal'
  },
  {
    name: 'Honey Butter French Toast Platter',
    slug: 'honey-butter-french-toast-platter',
    category: 'desserts',
    cuisineTag: 'Artisanal Bakes',
    description: 'Golden brioche French toast topped with Madagascan vanilla gelato, fresh blueberries, cherries, banana slices, and dark chocolate drizzle.',
    price: 320,
    dietaryType: 'veg',
    spiceLevel: 0,
    rating: 5.0,
    reviewsCount: 289,
    images: ['https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=800&q=80'],
    isSignatureDish: true,
    isAvailable: true,
    displayOrder: 2,
    prepTime: '10 min',
    calories: '540 kcal'
  },
  {
    name: 'Neapolitan Wood-Fired Veggie Pizza',
    slug: 'neapolitan-wood-fired-veggie-pizza',
    category: 'burgers-mains',
    cuisineTag: 'Italian Heritage',
    description: 'Blistered wood-fired crust with charred bell peppers, kalamata olives, broccoli florets, and fresh mozzarella paired with cold brew.',
    price: 499,
    dietaryType: 'veg',
    spiceLevel: 1,
    rating: 4.9,
    reviewsCount: 198,
    images: ['https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80'],
    isSignatureDish: true,
    isAvailable: true,
    displayOrder: 3,
    prepTime: '15 min',
    calories: '680 kcal'
  },
  {
    name: 'Artisan Butter Croissant & Heart Latte',
    slug: 'artisan-butter-croissant-heart-latte',
    category: 'beverages',
    cuisineTag: 'Specialty Coffee',
    description: 'Flaky 100% French butter laminated croissant served warm with single-origin velvety espresso heart latte art.',
    price: 240,
    dietaryType: 'veg',
    spiceLevel: 0,
    rating: 4.9,
    reviewsCount: 165,
    images: ['https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80'],
    isSignatureDish: true,
    isAvailable: true,
    displayOrder: 4,
    prepTime: '5-7 min',
    calories: '380 kcal'
  },
  {
    name: 'Velvet Vanilla Tres Leches Cake',
    slug: 'velvet-vanilla-tres-leches-cake',
    category: 'desserts',
    cuisineTag: 'Sweet Finale',
    description: 'Sponge cake soaked overnight in a trio of rich milks, topped with silky whipped cream frosting and a fresh blueberry crown.',
    price: 260,
    dietaryType: 'egg',
    spiceLevel: 0,
    rating: 5.0,
    reviewsCount: 210,
    images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80'],
    isSignatureDish: true,
    isAvailable: true,
    displayOrder: 5,
    prepTime: '4 min',
    calories: '420 kcal'
  },
  {
    name: 'Sparkling Hibiscus & Berry Fizz',
    slug: 'sparkling-hibiscus-berry-fizz',
    category: 'beverages',
    cuisineTag: 'Craft Coolers',
    description: 'Wild hibiscus botanical brew, muddled forest berries, crushed ice, and effervescent sparkling soda.',
    price: 210,
    dietaryType: 'veg',
    spiceLevel: 0,
    rating: 4.8,
    reviewsCount: 94,
    images: ['https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80'],
    isSignatureDish: false,
    isAvailable: true,
    displayOrder: 6,
    prepTime: '4 min',
    calories: '120 kcal'
  },
  {
    name: 'Kashmiri Saffron Earthen Kulhad Chai',
    slug: 'kashmiri-saffron-earthen-kulhad-chai',
    category: 'beverages',
    cuisineTag: 'Indian Heritage',
    description: 'Slow-simmered rich Assam tea with green cardamom, lemongrass, Kashmiri saffron threads in unglazed terracotta.',
    price: 140,
    dietaryType: 'veg',
    spiceLevel: 0,
    rating: 5.0,
    reviewsCount: 340,
    images: ['https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80'],
    isSignatureDish: true,
    isAvailable: true,
    displayOrder: 7,
    prepTime: '6 min',
    calories: '130 kcal'
  },
  {
    name: 'Belgian Dark Chocolate Fondant',
    slug: 'belgian-dark-chocolate-fondant',
    category: 'desserts',
    cuisineTag: 'Dessert Room',
    description: '70% warm molten chocolate lava cake with roasted hazelnut butter core and vanilla bean cream.',
    price: 280,
    dietaryType: 'egg',
    spiceLevel: 0,
    rating: 4.9,
    reviewsCount: 180,
    images: ['https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80'],
    isSignatureDish: true,
    isAvailable: true,
    displayOrder: 8,
    prepTime: '8 min',
    calories: '490 kcal'
  }
];

const initialReservations = [
  {
    name: 'Aditi Rao',
    phone: '+91 98765 11223',
    email: 'aditi.rao@gmail.com',
    date: '2026-09-18',
    time: '08:00 PM',
    guests: 4,
    experience: 'Main Artisanal Dining Room',
    specialRequests: 'Window booth for birthday celebration',
    status: 'new',
  },
  {
    name: 'Karan Malhotra',
    phone: '+91 98450 44556',
    email: 'karan.m@yahoo.com',
    date: '2026-09-18',
    time: '07:30 PM',
    guests: 2,
    experience: "Chef's Private Tasting Salon",
    specialRequests: 'Quiet corner table for anniversary',
    status: 'confirmed',
  },
  {
    name: 'Sneha Patel',
    phone: '+91 99001 88776',
    email: 'sneha.patel@outlook.com',
    date: '2026-09-19',
    time: '09:00 PM',
    guests: 6,
    experience: 'The Glasshouse Patio & Garden',
    specialRequests: 'High chair needed, vegetarian menu preference',
    status: 'new',
  },
];

const initialContacts = [
  {
    name: 'Rohit Verma',
    email: 'rohit.v@example.com',
    phone: '+91 98112 33445',
    subject: 'Private Birthday Gathering Inquiry',
    message: 'We are looking to book the entire upstairs lounge for 25 people on Saturday evening. Please share menu packages.',
    status: 'unread',
  },
  {
    name: 'Pooja Sharma',
    email: 'pooja.s@lifestyle.in',
    phone: '+91 97123 45678',
    subject: 'Open Mic Night Registration',
    message: 'I would love to perform acoustic guitar and poetry during the upcoming Sage Acoustic Live session.',
    status: 'read',
  }
];

async function runMigration() {
  console.log('\n======================================================');
  console.log('🚀 STARTING SAGE CAFÉ MIGRATION TO MONGODB ATLAS');
  console.log('======================================================\n');

  try {
    console.log('⏳ Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI, {
      dbName: 'sage_cafe',
      serverSelectionTimeoutMS: 15000,
    });
    console.log('✅ Successfully connected to MongoDB Atlas (Database: sage_cafe)!\n');

    // 1. Migrate / Seed Admin User (Hashed with bcrypt)
    console.log('👤 [1/4] Checking & Securing Admin Credentials with bcrypt...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('sage@123', salt);

    const existingAdmin = await Admin.findOne({ email: 'sageowner@gmail.com' });
    if (!existingAdmin) {
      await Admin.create({
        email: 'sageowner@gmail.com',
        password: 'sage@123', // pre-save hook will hash it or we pass hashedPassword
        role: 'owner',
        cafeName: 'Sage Café & Roastery Hazratganj',
      });
      console.log('   ✓ Seeded Owner: sageowner@gmail.com (Password: [Bcrypt Hashed])');
    } else {
      existingAdmin.password = 'sage@123';
      await existingAdmin.save(); // triggers bcrypt pre-save hook
      console.log('   ✓ Updated Admin password to secure Bcrypt hash in Atlas.');
    }

    // 2. Migrate Menu Items
    console.log('\n🍽️  [2/4] Migrating Menu Catalogue...');
    for (const item of initialMenuItems) {
      await MenuItem.findOneAndUpdate(
        { slug: item.slug },
        { $set: item },
        { upsert: true, new: true }
      );
    }
    const menuCount = await MenuItem.countDocuments();
    console.log(`   ✓ ${menuCount} Menu items migrated/synced in Atlas.`);

    // 3. Migrate Reservations
    console.log('\n📅 [3/4] Migrating Table Reservations...');
    for (const res of initialReservations) {
      const exists = await Reservation.findOne({ phone: res.phone, date: res.date });
      if (!exists) {
        await Reservation.create(res);
      }
    }
    const resCount = await Reservation.countDocuments();
    console.log(`   ✓ ${resCount} Total table reservations active in Atlas.`);

    // 4. Migrate Contact Inquiries
    console.log('\n💬 [4/4] Migrating Contact Inquiries...');
    for (const msg of initialContacts) {
      const exists = await Contact.findOne({ email: msg.email, subject: msg.subject });
      if (!exists) {
        await Contact.create(msg);
      }
    }
    const msgCount = await Contact.countDocuments();
    console.log(`   ✓ ${msgCount} Contact inquiries saved in Atlas.`);

    console.log('\n======================================================');
    console.log('🎉 MIGRATION COMPLETED SUCCESSFULLY!');
    console.log('✨ All data is now live in MongoDB Atlas (Database: sage_cafe)');
    console.log('======================================================\n');
  } catch (error) {
    console.error('\n❌ Migration Failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB Atlas.');
    process.exit(0);
  }
}

runMigration();
