import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      default: 'burgers-mains',
    },
    cuisineTag: {
      type: String,
      default: 'Artisanal Selection',
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: true,
      default: 250,
    },
    dietaryType: {
      type: String,
      enum: ['veg', 'non-veg', 'egg', 'vegan'],
      default: 'veg',
    },
    spiceLevel: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.9,
    },
    reviewsCount: {
      type: Number,
      default: 100,
    },
    images: {
      type: [String],
      default: [],
    },
    isSignatureDish: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 1,
    },
    prepTime: {
      type: String,
      default: '10 min',
    },
    calories: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export const MenuItem = mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);
