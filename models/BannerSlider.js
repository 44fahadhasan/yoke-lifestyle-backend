// External imports
const mongoose = require("mongoose");

// Define the src schema
const srcSchema = new mongoose.Schema({
  src: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        // Validate that the src is a valid URL
        return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?.*$/i.test(
          value
        );
      },
      message: "Invalid URL format for the hero slider image.",
    },
  },
});

// Define the banner slider schema
const bannerSliderSchema = new mongoose.Schema(
  {
    heroSlider: {
      type: [srcSchema],
      validate: {
        validator: function (value) {
          // Ensure at least one hero slider exists
          return value.length > 0;
        },
        message: "At least one hero slider is required.",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// // Create the Banner Slider model
const BannerSlider = mongoose.model("BannerSlider", bannerSliderSchema);

// Export the model
module.exports = BannerSlider;
