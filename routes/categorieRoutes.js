// External imports
const express = require("express");

// Internal imports
const categorieController = require("../controllers/categorieController");
const { authenticateToken } = require("../middleware/common/authenticate");
const { checkIfAdmin } = require("../middleware/common/authorization");

// Initialize the router
const router = express.Router();

/**
 * @route   GET /api/categories
 * @desc    Retrieve all categories
 * @access  Public
 */
router.get("/", categorieController.getAllCategories);

/**
 * @route   PUT /api/categories
 * @desc    Create a new categorie
 * @access  Private(admin)
 */
router.put(
  "/",
  authenticateToken,
  checkIfAdmin,
  categorieController.createCategorie
);

/**
 * @route   PUT /api/categories/:id
 * @desc    Update an existing categorie by ID
 * @access  Private(admin)
 */
router.put(
  "/:id",
  authenticateToken,
  checkIfAdmin,
  categorieController.updateCategorie
);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete an existing categorie by ID
 * @access  Private(admin)
 */
router.delete(
  "/:id",
  authenticateToken,
  checkIfAdmin,
  categorieController.deleteCategorie
);

// Export the router
module.exports = router;
