// External imports
const express = require("express");

// Internal imports
const tagController = require("../controllers/tagController");
const { authenticateToken } = require("../middleware/common/authenticate");
const { checkIfAdmin } = require("../middleware/common/authorization");

// Initialize the router
const router = express.Router();

/**
 * @route   GET /api/tags/parent
 * @desc    Retrieve all parent tags
 * @access  Public
 */
router.get("/parent", tagController.getAllParentTags);

/**
 * @route   GET /api/tags/:parentId/children
 * @desc    Retrieve all children tags of any parent tag
 * @access  Public
 */
router.get("/:parentId/children", tagController.getAllChildrenTags);

/**
 * @route   GET /api/tags
 * @desc    Retrieve all tags
 * @access  Private(admin)
 */
router.get(
  "/",
  //  authenticateToken, checkIfAdmin,
  tagController.getAllTags
);

/**
 * @route   GET /api/tags/list
 * @desc    Retrieve all tags list
 * @access  Private(admin)
 */
router.get(
  "/list",
  authenticateToken,
  checkIfAdmin,
  tagController.getAllTagsList
);

/**
 * @route   GET /api/tags/details/:id
 * @desc    Retrieve a single tag details by ID
 * @access  Private(admin)
 */
router.get(
  "/details/:id",
  authenticateToken,
  checkIfAdmin,
  tagController.getTagDetailstById
);

/**
 * @route   POST /api/tags
 * @desc    Create a new tag
 * @access  Private(admin)
 */
router.post("/", authenticateToken, checkIfAdmin, tagController.createTag);

/**
 * @route   PUT /api/tags/:id
 * @desc    Update an existing tag by ID
 * @access  Private(admin)
 */
router.put("/:id", authenticateToken, checkIfAdmin, tagController.updateTag);

/**
 * @route   DELETE /api/tags/:id
 * @desc    Delete an existing tag by ID
 * @access  Private(admin)
 */
router.delete("/:id", authenticateToken, checkIfAdmin, tagController.deleteTag);

// Export the router
module.exports = router;
