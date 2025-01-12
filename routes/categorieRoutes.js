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
 * @access  Private(admin)
 */
router.get(
  "/",
  authenticateToken,
  checkIfAdmin,
  categorieController.getAllCategories
);

/**
 * @route   GET /api/categories/list
 * @desc    Retrieve all categories list
 * @access  Private(admin)
 */
router.get(
  "/list",
  authenticateToken,
  checkIfAdmin,
  categorieController.getAllCategoriesList
);

/**
 * @route   GET /api/categories/details/:id
 * @desc    Retrieve a single categorie details by ID
 * @access  Private(admin)
 */
router.get(
  "/details/:id",
  authenticateToken,
  checkIfAdmin,
  categorieController.getCategorieDetailstById
);

/**
 * @route   POST /api/categories
 * @desc    Create a new categorie
 * @access  Private(admin)
 */
router.post(
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
