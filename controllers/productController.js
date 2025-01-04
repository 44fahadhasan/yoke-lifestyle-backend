// Internal imports
const Product = require("../models/Product");

/**
 * @route   GET /api/products
 * @desc    Retrieve all products
 * @access  Public
 */
exports.getAllProducts = async (req, res) => {
  try {
    // destructure query parameters with default values
    const { page = 0, size = 6 } = req.query;

    // pagination settings
    const perPageProducts = parseInt(size);
    const currentPage = parseInt(page);
    const skipProducts = currentPage * perPageProducts;

    // the query object
    const query = {};

    // count total products matching the query
    const totalProductsNumber = await Product.countDocuments(query);

    // find products with pagination
    const products = await Product.find(query)
      .skip(skipProducts)
      .limit(perPageProducts);

    res.status(200).json({
      success: true,
      message: "Product fetch successfully",
      totalProducts: totalProductsNumber,
      data: products,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch products" });
  }
};

/**
 * @route   GET /api/products/details/:id
 * @desc    Retrieve a single product details by ID
 * @access  Public
 */
exports.getProductDetailstById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product fetch successfully",
      data: product,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID format" });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Private(admin)
 */
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to create product" });
  }
};

/**
 * @route   PUT /api/products/:id
 * @desc    Update an existing product by ID
 * @access  Private(admin)
 */
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Validate before updating
    });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID format" });
    }

    res
      .status(500)
      .json({ success: false, message: "Failed to update product" });
  }
};

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete an existing product by ID
 * @access  Private(admin)
 */
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID format" });
    }

    res
      .status(500)
      .json({ success: false, message: "Failed to delete product" });
  }
};
