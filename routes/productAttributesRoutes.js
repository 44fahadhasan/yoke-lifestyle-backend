// External imports
const express = require("express");

// Internal imports
const productAttributesController = require("../controllers/productAttributesController");
const { authenticateToken } = require("../middleware/common/authenticate");
const { checkIfAdmin } = require("../middleware/common/authorization");

// Initialize the router
const router = express.Router();

/**
 * @route   GET /api/product-attributes/global
 * @desc    Retrieve all global product attributes
 * @access  Public
 */
router.get(
  "/global",
  productAttributesController.getAllGlobalProductAttributes
);

/**
 * @route   GET /api/product-attributes/category-specific/:categoryId
 * @desc    Retrieve all category specific product attributes
 * @access  Public
 */
router.get(
  "/category-specific/:categoryId",
  productAttributesController.getAllCategorySpecificProductAttributes
);

/**
 * @route   GET /api/product-attributes
 * @desc    Retrieve all product attributes
 * @access  Private(admin)
 */
router.get(
  "/",
  authenticateToken,
  checkIfAdmin,
  productAttributesController.getAllProductAttributes
);

/**
 * @route   GET /api/product-attributes/details/:id
 * @desc    Retrieve a single product attribute details by ID
 * @access  Private(admin)
 */
router.get(
  "/details/:id",
  authenticateToken,
  checkIfAdmin,
  productAttributesController.getProductAttributeDetailstById
);

/**
 * @route   POST /api/product-attributes
 * @desc    Create a new product attribute
 * @access  Private(admin)
 */
router.post(
  "/",
  authenticateToken,
  checkIfAdmin,
  productAttributesController.createProductAttribute
);

/**
 * @route   PUT /api/product-attributes/:id
 * @desc    Update an existing product attribute by ID
 * @access  Private(admin)
 */
router.put(
  "/:id",
  authenticateToken,
  checkIfAdmin,
  productAttributesController.updateProductAttribute
);

/**
 * @route   DELETE /api/product-attributes/:id
 * @desc    Delete an existing product attribute by ID
 * @access  Private(admin)
 */
router.delete(
  "/:id",
  authenticateToken,
  checkIfAdmin,
  productAttributesController.deleteProductAttribute
);

// Export the router
module.exports = router;
