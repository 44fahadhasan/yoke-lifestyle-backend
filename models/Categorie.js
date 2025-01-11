// External imports
const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the meta schema
const metaSchema = new Schema(
  {
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
  },
  { _id: false } // Disables _id creation for subdocuments.
);

// Define the categories schema
const categoriesSchema = new Schema(
  {
    image_url: {
      type: String,
      trim: true,
    },
    img_alt: {
      type: String,
      trim: true,
    },
    img_caption: {
      type: String,
      trim: true,
    },
    categorie_name: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Categorie name is required"],
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
    categorie_description: {
      type: String,
      trim: true,
    },
    parent_categorie: {
      type: Schema.Types.ObjectId,
      ref: "Categorie",
      default: null,
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

// Create the Categories model
const Categorie = mongoose.model("Categorie", categoriesSchema);

// Export the model
module.exports = Categorie;
