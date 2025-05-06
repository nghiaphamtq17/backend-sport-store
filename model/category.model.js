const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    description: {
      type: String,
      trim: true
    },
    image: {
      type: String,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes for better query performance
categorySchema.index({ name: 'text' });
categorySchema.index({ isActive: 1 });

// Middleware to generate slug before saving
categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model("Category", categorySchema);
