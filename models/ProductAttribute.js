// External imports
const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the attribute value schema
const attributeValueSchema = new Schema({
  value: {
    type: String,
    required: [true, "Attribute value is required."],
    unique: true,
    trim: true,
  },
});

// Define the product attribute schema
const productAttributeSchema = new Schema({
  attributeTitle: {
    type: String,
    required: true,
    trim: true,
    required: [true, "Attribute title name is required"],
  },
  attributeValue: [attributeValueSchema],
});

// Define the product attributes schema
const productAttributesSchema = new Schema(
  {
    productAttributes: {
      type: [productAttributeSchema],
      validate: {
        validator: function (value) {
          // Ensure at least one product attribute exists
          return value.length > 0;
        },
        message: "At least one product attribute is required.",
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

// Create the product attributes model
const ProductAttribute = mongoose.model(
  "ProductAttribute",
  productAttributesSchema
);

// Export the model
module.exports = ProductAttribute;
