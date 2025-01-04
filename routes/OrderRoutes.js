// External imports
const express = require("express");

// Internal imports
const orderController = require("../controllers/orderController");
const { authenticateToken } = require("../middleware/common/authenticate");
const {
  checkUserAccess,
  checkIfAdmin,
} = require("../middleware/common/authorization");

// Initialize the router
const router = express.Router();

/**
 * @route   GET /api/orders
 * @desc    Retrieve all order
 * @access  Private(admin)
 */
router.get("/", authenticateToken, checkIfAdmin, orderController.getAllOrder);

/**
 * @route   GET /api/orders/my-orders/:email
 * @desc    Retrieve all my order
 * @access  Private(specific user)
 */
router.get(
  "/my-orders/:email",
  authenticateToken,
  checkUserAccess,
  orderController.getAllMyOrder
);

/**
 * @route   POST /api/orders
 * @desc    Create a new order for specific user & admin
 * @access  Private(specific user)
 */
router.post(
  "/",
  authenticateToken,
  checkUserAccess,
  orderController.createNewOrder
);

/**
 * @route   PUT /api/orders/:id
 * @desc    Update an existing order by ID
 * @access  Private(admin)
 */
router.put(
  "/:id",
  authenticateToken,
  checkIfAdmin,
  orderController.updateOrder
);

/**
 * @route   DELETE /api/orders/:id
 * @desc    Delete an existing order by ID
 * @access  Private(admin)
 */
router.delete(
  "/:id",
  authenticateToken,
  checkIfAdmin,
  orderController.deleteOrder
);

/**
 * @route   DELETE /api/orders/my-orders/:id
 * @desc    Delete an existing my order by ID
 * @access  Private(Specific User)
 */
router.delete(
  "/my-orders/:id",
  authenticateToken,
  checkUserAccess,
  orderController.deleteMyOrder
);

// Export the router
module.exports = router;
