// External imports
const mongoose = require("mongoose");

// Define the content schema for individual slider items
const contentSchema = new mongoose.Schema({
  animation: {
    type: String,
    enum: {
      values: ["Yes", "No"],
      message: "Animation must be either 'Yes' or 'No'",
    },
  },
  titleTop: {
    type: String,
    required: [true, "The 'titleTop' field is required."],
  },
  titleBottom: {
    type: String,
    required: [true, "The 'titleBottom' field is required."],
  },
  content: {
    type: String,
    required: [true, "The 'content' field is required."],
  },
});

// Define the banner slider schema for managing the hero slider
const bannerSliderContentSchema = new mongoose.Schema(
  {
    heroSliderContent: {
      type: [contentSchema],
      validate: {
        validator: function (value) {
          // Ensure at least one hero slider content exists
          return value && value.length > 0;
        },
        message:
          "The 'heroSlider' field must contain at least one slider content item.",
      },
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
    versionKey: false, // Disable the __v field for versioning
  }
);

// Create the Banner Slider Content model
const BannerSliderContent = mongoose.model(
  "BannerSliderContent",
  bannerSliderContentSchema
);

// Export the model
module.exports = BannerSliderContent;
