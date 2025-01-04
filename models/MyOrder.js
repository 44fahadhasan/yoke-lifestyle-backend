// External imports
const mongoose = require("mongoose");

// Define the my order schema
const myOrderSchema = new mongoose.Schema(
  {
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

// Create the my orders model
const MyOrder = mongoose.model("MyOrder", myOrderSchema);

// Export the model
module.exports = MyOrder;
