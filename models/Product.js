// External imports
const mongoose = require("mongoose");

// Define the product schema
const productSchema = new mongoose.Schema(
  {
    address: {
      houseNumber: {
        type: String,
        trim: true,
        // required: [true, "House number is required"],
      },
      road: {
        type: String,
        trim: true,
        required: [true, "Road name is required"],
      },
      area: {
        type: String,
        trim: true,
        required: [true, "Area name is required"],
      },
      country: {
        type: String,
        trim: true,
        required: [true, "Country is required"],
        // lowercase: true,
      },
      division: {
        type: String,
        trim: true,
        // lowercase: true,
        required: [true, "Division is required"],
      },
      districtsOrThana: {
        type: String,
        trim: true,
        // lowercase: true,
        required: [true, "Districts or Thana is required"],
      },
    },
    apartmentDetails: {
      description: {
        type: String,
        required: [true, "Description field is required"],
      },
      images: {
        type: [String],
        required: [true, "Images field is required"],
        // validate: {
        //   validator: function (images) {
        //     return images.every((image) =>
        //       /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/.test(image)
        //     );
        //   },
        //   message:
        //     "All images must be valid URLs with supported formats (jpg, jpeg, png, gif, webp)",
        // },
      },
      video: {
        type: String,
        // validate: {
      },
      size: {
        type: Number,
        required: [true, "Size in square feet is required"],
        min: [1, "Size must be at least 1 square foot"],
      },
      bedrooms: {
        type: Number,
        required: [true, "Number of bedrooms is required"],
        min: [1, "At least one bedroom is required"],
      },
      balconies: {
        type: Number,
        required: [true, "Number of balconies is required"],
        min: [0, "Balconies cannot be negative"],
      },
      toilets: {
        type: Number,
        required: [true, "Number of toilets is required"],
        min: [1, "At least one toilet is required"],
      },
      drawingDining: {
        type: Number,
        required: [true, "Number of Drawing/dining room is required"],
        min: [1, "At least one Drawing/dining is required"],
      },
      kitchen: {
        type: Number,
        required: [true, "Number of kitchen is required"],
        min: [1, "At least one kitchen is required"],
      },
    },
    buildingDetails: {
      floorPosition: {
        type: [String],
        validate: {
          validator: function (v) {
            return Array.isArray(v) && v.length > 0;
          },
          message: "At least one floor position is required",
        },
      },
      unitsPerFloor: {
        type: Number,
        required: [true, "Units per floor are required"],
        min: [1, "There must be at least one unit per floor"],
      },
      lpgGas: {
        type: String,
        // lowercase: true,
        enum: {
          values: ["Yes", "No"],
          message: "lpgGas must be either 'Yes' or 'No'",
        },
        required: [true, "lpgGas is required"],
      },
      parkingArea: {
        type: String,
        // lowercase: true,
        enum: {
          values: ["Yes", "No"],
          message: "Parking area must be either 'Yes' or 'No'",
        },
        required: [true, "Parking area is required"],
      },
    },
    price: {
      ratePerSft: {
        type: Number,
        required: [true, "Rate per square foot is required"],
      },
    },
    orientation: {
      type: String,
      required: [true, "Orientation is required"],
    },
    completionStatus: {
      percentage: {
        type: Number,
        min: [0, "Completion percentage cannot be less than 0"],
        max: [100, "Completion percentage cannot exceed 100"],
      },
      condition: {
        type: String,
        // lowercase: true,
        enum: {
          values: ["New", "Used"],
          message: "Condition must be either 'New' or 'Used'",
        },
        required: [true, "Condition is required"],
      },
    },
    properties: {
      type: {
        type: String,
        // lowercase: true,
        enum: {
          values: ["Residential", "Commercial"],
          message: "Property type must be 'Residential' or 'Commercial'",
        },
        required: [true, "Property type is required"],
      },
    },
    objective: {
      status: {
        type: String,
        // lowercase: true,
        enum: {
          values: ["Buy", "Rent", "Sell"],
          message: "Objective status must be either 'Buy' or 'Rent' or 'Sell'",
        },
        required: [true, "Objective status is required"],
      },
    },
    featuredProperty: {
      type: String,
      // lowercase: true,
      enum: {
        values: ["Yes", "No"],
        message: "Featured property must be either 'Yes' or 'No'",
      },
      required: [true, "Featured property is required"],
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

// Create the products model
const Product = mongoose.model("Product", productSchema);

// Export the model
module.exports = Product;
