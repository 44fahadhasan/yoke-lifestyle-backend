// Internal imports
const MyOrder = require("../models/MyOrder");
const Order = require("../models/Order");

/**
 * @route   GET /api/orders
 * @desc    Retrieve all order
 * @access  Private(admin)
 */
exports.getAllOrder = async (req, res) => {
  try {
    // destructure query parameters with default values
    const { page = 0, size = 6 } = req.query;

    // pagination settings
    const perPageOrders = parseInt(size);
    const currentPage = parseInt(page);
    const skipOrders = currentPage * perPageOrders;

    // the query object
    const query = {};

    // count total orders matching the query
    const totalOrdersNumber = await Order.countDocuments(query);

    // find orders with pagination
    const orders = await Order.find(query)
      .skip(skipOrders)
      .limit(perPageOrders);

    res.status(200).json({
      success: true,
      message: "Orders fetch successfully",
      totalOrders: totalOrdersNumber,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

/**
 * @route   GET /api/orders/my-orders/:email
 * @desc    Retrieve all my order
 * @access  Private(specific user)
 */
exports.getAllMyOrder = async (req, res) => {
  try {
    // destructure query parameters with default values
    const { page = 0, size = 6 } = req.query;

    // pagination settings
    const perPageMyOrders = parseInt(size);
    const currentPage = parseInt(page);
    const skipMyOrders = currentPage * perPageMyOrders;

    // the query object
    const query = { email: req.params.email };

    // count total products matching the query
    const totalMyOrdersNumber = await MyOrder.countDocuments(query);

    // find myOrders with pagination
    const myOrders = await MyOrder.find(query)
      .skip(skipMyOrders)
      .limit(perPageMyOrders);

    res.status(200).json({
      success: true,
      message: "My order fetch successfully",
      totalMyOrders: totalMyOrdersNumber,
      data: myOrders,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch my orders" });
  }
};

/**
 * @route   POST /api/orders
 * @desc    Create a new order for specific user & admin
 * @access  Private(specific user)
 */
exports.createNewOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    const myOrder = await MyOrder.create(req.body);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: myOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
};

/**
 * @route   PUT /api/orders/:id
 * @desc    Update an existing order by ID
 * @access  Private(admin)
 */
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Validate before updating
    });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order ID format" });
    }

    res.status(500).json({ success: false, message: "Failed to update order" });
  }
};

/**
 * @route   DELETE /api/orders/:id
 * @desc    Delete an existing order by ID
 * @access  Private(admin)
 */
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order ID format" });
    }

    res.status(500).json({ success: false, message: "Failed to delete order" });
  }
};

/**
 * @route   DELETE /api/orders/my-orders/:id
 * @desc    Delete an existing my order by ID
 * @access  Private(Specific User)
 */
exports.deleteMyOrder = async (req, res) => {
  try {
    const myOrder = await MyOrder.findByIdAndDelete(req.params.id);

    if (!myOrder) {
      return res
        .status(404)
        .json({ success: false, message: "My order not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "My order deleted successfully" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid my order ID format" });
    }

    res
      .status(500)
      .json({ success: false, message: "Failed to delete my order" });
  }
};
