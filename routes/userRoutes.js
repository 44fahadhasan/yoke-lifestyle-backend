// External imports
const express = require("express");

// Internal imports
const userController = require("../controllers/userController");
const {
  checkIfAdmin,
  checkUserAccess,
} = require("../middleware/common/authorization");
const { authenticateToken } = require("../middleware/common/authenticate");

// Initialize the router
const router = express.Router();

/**
 * @route   GET /api/users
 * @desc    Retrieve all users
 * @access  Private(admin)
 */
router.get("/", authenticateToken, checkIfAdmin, userController.getAllUsers);

/**
 * @route   GET /api/users/:email
 * @desc    Retrieve an single user by email
 * @access  Private(Specific User)
 */
router.get(
  "/:email",
  authenticateToken,
  checkUserAccess,
  userController.getUserDetailsByEmail
);

/**
 * @route   POST /api/users/signup
 * @desc    Create a new user
 * @access  Public
 */
router.post("/signup", userController.createUser);

/**
 * @route   PUT /api/users/:id
 * @desc    Update an existing user by ID
 * @access  Private(Specific User)
 */
router.put("/:id", authenticateToken, userController.updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete an existing user by ID
 * @access  Private(admin)
 */
router.delete(
  "/:id",
  authenticateToken,
  checkIfAdmin,
  userController.deleteUser
);

/**
 * @route   POST /api/users/login
 * @desc    An singup user login
 * @access  Public
 */
router.post("/login", userController.userLogin);

/**
 * @route   POST /api/users/logout
 * @desc    An logged user logout
 * @access  Public
 */
router.post("/logout", userController.userLogout);

/**
 * @route   POST /api/users/refresh
 * @desc    Access token refresh of a logged user
 * @access  Public
 */
router.post("/refresh", userController.AccessTokenRefresh);

// Export the router
module.exports = router;
