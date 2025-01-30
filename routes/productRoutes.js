// External imports
const express = require("express");

// Internal imports
const productController = require("../controllers/productController");
const { authenticateToken } = require("../middleware/common/authenticate");
const { checkIfAdmin } = require("../middleware/common/authorization");

// Initialize the router
const router = express.Router();

/**
 * @route   GET /api/products
 * @desc    Retrieve all products
 * @access  Public
 */
router.get("/", productController.getAllProducts);

/**
 * @route   GET /api/products/admin
 * @desc    Retrieve all products
 * @access  Private(admin)
 */
router.get(
  "/admin",
  authenticateToken,
  checkIfAdmin,
  productController.getAllProductsAdmin
);

/**
 * @route   GET /api/products/details/:id/admin
 * @desc    Retrieve a single product details by ID
 * @access  Private(admin)
 */
router.get(
  "/details/:id/admin",
  authenticateToken,
  checkIfAdmin,
  productController.getProductDetailstByIdAdmin
);

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Private(admin)
 */
router.post(
  "/",
  authenticateToken,
  checkIfAdmin,
  productController.createProduct
);

/**
 * @route   PUT /api/products/:id
 * @desc    Update an existing product by ID
 * @access  Private(admin)
 */
router.put(
  "/:id",
  authenticateToken,
  checkIfAdmin,
  productController.updateProduct
);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete an existing product by ID
 * @access  Private(admin)
 */
router.delete(
  "/:id",
  authenticateToken,
  checkIfAdmin,
  productController.deleteProduct
);

// Export the router
module.exports = router;
