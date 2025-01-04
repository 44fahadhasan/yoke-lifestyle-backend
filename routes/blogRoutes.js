// External imports
const express = require("express");

// Internal imports
const blogController = require("../controllers/blogController");
const { authenticateToken } = require("../middleware/common/authenticate");
const { checkIfAdmin } = require("../middleware/common/authorization");

// Initialize the router
const router = express.Router();

/**
 * @route   GET /api/blogs
 * @desc    Retrieve all blogs
 * @access  Public
 */
router.get("/", blogController.getAllBlogs);

/**
 * @route   GET /api/blogs/details/:id
 * @desc    Retrieve a single blog details by ID
 * @access  Public
 */
router.get("/details/:id", blogController.getBlogDetailstById);

/**
 * @route   POST /api/blogs
 * @desc    Create a new blog
 * @access  Private(admin)
 */
router.post("/", authenticateToken, checkIfAdmin, blogController.createBlog);

/**
 * @route   PUT /api/blogs/:id
 * @desc    Update an existing blog by ID
 * @access   Private(admin)
 */
router.put("/:id", authenticateToken, checkIfAdmin, blogController.updateBlog);

/**
 * @route   DELETE /api/blogs/:id
 * @desc    Delete an existing blog by ID
 * @access  Public
 */
router.delete(
  "/:id",
  authenticateToken,
  checkIfAdmin,
  blogController.deleteBlog
);

// Export the router
module.exports = router;
