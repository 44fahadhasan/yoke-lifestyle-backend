// External imports
const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the attribute values schema
const attributeValuesSchema = new Schema({
  value: {
    type: String,
    unique: true,
    trim: true,
    required: [true, "Attribute value is required."],
  },
});

// Define the product attributes schema
const productAttributesSchema = new Schema(
  {
    attribute_name: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Attribute name is required"],
    },
    attribute_values: {
      type: [attributeValuesSchema],
      validate: {
        validator: function (value) {
          // Ensure at least one attribute value exists
          return value.length > 0;
        },
        message: "At least one attribute value is required.",
      },
    },
    priority_number: {
      type: Number,
      min: [0, "Priority number must be at least 0"],
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: "Priority number must be an integer",
      },
    },
    global_attributes: {
      type: String,
      enum: {
        values: ["yes", "no"],
        message: 'global attribute must be either "yes" or "no".',
      },
      default: "yes",
    },
    category_specific_attributes: {
      type: Schema.Types.ObjectId,
      ref: "Categorie",
      default: null,
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

// Create the product attributes model
const ProductAttribute = mongoose.model(
  "ProductAttribute",
  productAttributesSchema
);

// Export the model
module.exports = ProductAttribute;
