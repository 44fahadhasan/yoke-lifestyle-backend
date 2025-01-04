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
      message: "Invalid URL format for the feedback source.",
    },
  },
});

// Define the Customer Review schema
const customerReviewSchema = new mongoose.Schema(
  {
    customerFeedbacks: {
      type: [srcSchema],
      validate: {
        validator: function (value) {
          // Ensure at least one feedback exists
          return value.length > 0;
        },
        message: "At least one customer feedback is required.",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create the Customer Review model
const CustomerReview = mongoose.model("CustomerReview", customerReviewSchema);

// Export the model
module.exports = CustomerReview;
