// External imports
const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the meta schema
const metaSchema = new Schema({
  name: {
    type: String,
    trim: true,
  },
  property: {
    type: String,
    trim: true,
  },
  content: {
    type: String,
    trim: true,
  },
});

// Define the brands schema
const brandsSchema = new Schema(
  {
    image_url: {
      type: String,
      trim: true,
    },
    img_alt: {
      type: String,
      trim: true,
    },
    brand_name: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Brand name is required"],
    },
    slug_name: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Slug name is required"],
      match: [
        /^[a-z-]+$/,
        "Slug name can only contain lowercase letters and hyphens.",
      ],
    },
    brand_description: {
      type: String,
      trim: true,
    },
    priority_number: {
      type: Number,
      min: [0, "Priority number must be at least 0"],
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: "Priority number must be an integer",
      },
    },
    featured_brand: {
      type: String,
      enum: {
        values: ["yes", "no"],
        message: 'Featured brand must be either "yes" or "no".',
      },
      default: "no",
    },
    meta_info: {
      type: [metaSchema],
    },
    status: {
      type: String,
      enum: {
        values: ["published", "archived", "draft"],
        message: 'Status must be either "published", "archived", or "draft".',
      },
      default: "published",
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: [true, "Email is required"],
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address.",
      ],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true, // Ensures createdAt cannot be changed
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    versionKey: false, // Removes the __v field
  }
);

// Create the Brands model
const Brand = mongoose.model("Brand", brandsSchema);

// Export the model
module.exports = Brand;
