// External imports
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const cookieParser = require("cookie-parser");
const favicon = require("serve-favicon");

// Internal imports
const {
  notFoundHandler,
  errorHandler,
} = require("./middleware/common/errorHandler");
const connectDB = require("./config/database");
const categorieRoutes = require("./routes/categorieRoutes");
const tagRoutes = require("./routes/tagsRoutes");
const productAttributesRoutes = require("./routes/productAttributesRoutes");
const productRoutes = require("./routes/productRoutes");
const OrderRoutes = require("./routes/OrderRoutes");
const blogRoutes = require("./routes/blogRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const emailRoutes = require("./routes/emailRoute");

// Initialize Express application
const app = express();

// Enable trust proxy for secure cookies behind a proxy
app.set("trust proxy", 1);

// Define server port
const PORT = process.env.PORT || 5000;

// Middleware setup
// JSON body parsing
app.use(express.json());

// URL-encoded data parsing for form submissions
app.use(express.urlencoded({ extended: true }));

// CORS configuration to control access to server resources
const corsOptions = {
  origin: [
    "https://www.yokelifestyle.sufizaproperty.com",
    "https://yokelifestyle.sufizaproperty.com",
    "http://localhost:3000",
  ], // Allowed origins
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers in requests
  credentials: true, // Allow cookies and credentials to be sent
};
app.use(cors(corsOptions));

// Enable cookie parsing with a secret for signed cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// Serve static assets from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Serve favicon for browser default request
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

// Connect to MongoDB
connectDB();

// Define routes
// Health check route
app.get("/", (req, res) => res.send("Yoke lifestyle Server Running"));

// Categorie-related API routes
app.use("/api/categories", categorieRoutes);

// Tag-related API routes
app.use("/api/tags", tagRoutes);

// Product attribute-related API routes
app.use("/api/product-attributes", productAttributesRoutes);

// Product-related API routes
app.use("/api/products", productRoutes);

// Order-related API routes
app.use("/api/orders", OrderRoutes);

// Blog-related API routes
app.use("/api/blogs", blogRoutes);

// User-related API routes
app.use("/api/users", userRoutes);

// Admin-related API routes
app.use("/api/admins", adminRoutes);

// Email-related API routes
app.use("/api/send-email", emailRoutes);

// Custom 404 handler for unknown routes
app.use(notFoundHandler);

// General error handler for handling server errors
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Yoke lifestyle running on http://localhost:${PORT}`);
});
