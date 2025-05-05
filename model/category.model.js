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
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null
    },
    level: {
      type: Number,
      default: 1
    },
    path: {
      type: String,
      default: ""
    },
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Indexes for better query performance
categorySchema.index({ name: 'text' });
categorySchema.index({ parent: 1 });
categorySchema.index({ isActive: 1 });

module.exports = mongoose.model("Category", categorySchema);
