// External imports
const express = require("express");

// Internal imports
const brandController = require("../controllers/brandController");
const { authenticateToken } = require("../middleware/common/authenticate");
const { checkIfAdmin } = require("../middleware/common/authorization");

// Initialize the router
const router = express.Router();

/**
 * @route   GET /api/brands
 * @desc    Retrieve all brands
 * @access  Private(admin)
 */
router.get("/", authenticateToken, checkIfAdmin, brandController.getAllBrands);

/**
 * @route   GET /api/brands/list
 * @desc    Retrieve all brands list
 * @access  Private(admin)
 */
router.get(
  "/list",
  authenticateToken,
  checkIfAdmin,
  brandController.getAllBrandsList
);

/**
 * @route   GET /api/brands/details/:id
 * @desc    Retrieve a single brand details by ID
 * @access  Private(admin)
 */
router.get(
  "/details/:id",
  authenticateToken,
  checkIfAdmin,
  brandController.getBrandDetailstById
);

/**
 * @route   POST /api/brands
 * @desc    Create a new brand
 * @access  Private(admin)
 */
router.post("/", authenticateToken, checkIfAdmin, brandController.createBrand);

/**
 * @route   PUT /api/brands/:id
 * @desc    Update an existing brand by ID
 * @access  Private(admin)
 */
router.put(
  "/:id",
  authenticateToken,
  checkIfAdmin,
  brandController.updateBrand
);

/**
 * @route   DELETE /api/brands/:id
 * @desc    Delete an existing brand by ID
 * @access  Private(admin)
 */
router.delete(
  "/:id",
  authenticateToken,
  checkIfAdmin,
  brandController.deleteBrand
);

// Export the router
module.exports = router;
