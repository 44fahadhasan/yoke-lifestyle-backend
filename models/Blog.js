// External imports
const mongoose = require("mongoose");

// Define the Blog schema
const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "The title field is required."],
    },

    content: {
      type: String,
      required: [true, "The content field is required."],
    },

    thumbnailImage: {
      type: String,
      required: [true, "Images field is required"],
      validate: {
        validator: function (value) {
          // Validate that the src is a valid URL
          return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?.*$/i.test(
            value
          );
        },
        message: "Invalid URL format for image.",
      },
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

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create the Blog model
const Blog = mongoose.model("Blog", blogSchema);

// Export the model
module.exports = Blog;
