// External imports
const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the categorie schema
const categorieSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    required: [true, "Category name is required"],
  },
});

// Define the categories schema
const categoriesSchema = new Schema(
  {
    categories: {
      type: [categorieSchema],
      validate: {
        validator: function (value) {
          // Ensure at least one category exists
          return value.length > 0;
        },
        message: "At least one category is required.",
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create the Categories model
const Categorie = mongoose.model("Categorie", categoriesSchema);

// Export the model
module.exports = Categorie;
