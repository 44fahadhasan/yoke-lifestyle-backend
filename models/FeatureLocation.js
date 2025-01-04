// External imports
const mongoose = require("mongoose");

// Define the Feature Location schema
const featureLocationSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: [true, "Country name is required."],
      trim: true,
    },

    districtsOrThana: {
      type: String,
      required: [true, "Districts or Thana is required"],
      unique: true,
      trim: true,
    },

    image: {
      type: String,
      required: [true, "Image field is required"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address",
      ],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create the Feature Location model
const FeatureLocation = mongoose.model(
  "FeatureLocation",
  featureLocationSchema
);

// Export the model
module.exports = FeatureLocation;
