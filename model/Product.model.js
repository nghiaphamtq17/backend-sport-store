const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  images: [{
    type: String,
    required: true
  }],
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  sportType: {
    type: Schema.Types.ObjectId,
    ref: 'SportType',
    required: true
  },
  variants: [{
    color: {
      type: Schema.Types.ObjectId,
      ref: 'Color',
      required: true
    },
    sizes: [{
      size: {
        type: Schema.Types.ObjectId,
        ref: 'Size',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 0
      }
    }]
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ sportType: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ featured: 1 });

module.exports = mongoose.model('Product', productSchema);
