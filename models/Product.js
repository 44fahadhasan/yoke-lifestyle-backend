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

// Define the subsection schema
const SubsectionSchema = new mongoose.Schema({
  id: {
    type: Number,
    min: 0,
    id: { type: Number, required: [true, "Product id number is required"] },
  },
  attribute_name: { type: String, trim: true },
  attribute_values: {
    type: [
      {
        value: {
          type: String,
          required: true,
        },
        label: {
          type: String,
          required: true,
        },
      },
    ],
  },
});

// Define the variant schema
const VariantSchema = new mongoose.Schema({
  id: {
    type: Number,
    min: 0,
    required: [true, "Product id number is required"],
  },
  image_url: { type: String, trim: true },
  sku: {
    type: String,
    unique: true,
    trim: true,
    required: [true, "Product sku is required"],
  },
  product_quantity: {
    type: Number,
    min: 0,
    required: [true, "Product quantity is required"],
  },
  product_price: {
    type: Number,
    min: 0,
    required: [true, "Product price is required"],
  },
  stock_status: {
    type: String,
    enum: {
      values: ["in stock", "out of stock", "pre order"],
      message:
        'Stock must be either "in stock", "out of stock", or "pre order".',
    },
    default: "in stock",
  },
  subsections: { type: [SubsectionSchema] },
});

// Define the product schema
const productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      trim: true,
      required: [true, "Product name is required"],
    },
    product_category: {
      type: String,
      trim: true,
      required: [true, "Product category is required"],
    },
    product_tag: { type: String, trim: true },
    product_brand: { type: String, trim: true },
    featured_product: {
      type: String,
      enum: {
        values: ["yes", "no"],
        message: 'Featured product must be either "yes" or "no".',
      },
      default: "no",
    },
    product_images_url: [{ image: { type: String, trim: true } }],
    product_video_link: { type: String, trim: true },
    discount_type: {
      type: String,
      enum: ["percentage", "direct"],
      default: "percentage",
    },
    discount_percentage: { type: Number, min: 0, max: 100 },
    variants: { type: [VariantSchema] },
    product_description: { type: String },
    additional_information: { type: String },
    shipping_warranty: { type: String },
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

// Create the products model
const Product = mongoose.model("Product", productSchema);

// Export the model
module.exports = Product;
