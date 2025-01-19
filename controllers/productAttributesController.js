// Internal imports
const ProductAttribute = require("../models/ProductAttribute");

/**
 * @route   GET /api/product-attributes
 * @desc    Retrieve all product attributes
 * @access  Private(admin)
 */
exports.getAllProductAttributes = async (req, res) => {
  try {
    // destructure query parameters with default values
    const { search, status, sort, page = 0, size = 6 } = req.query;

    // pagination settings
    const perPageAttributes = parseInt(size);
    const currentPage = parseInt(page);
    const skipAttributes = currentPage * perPageAttributes;

    // the query object
    const query = {};

    // search by search text (attribute or categorie name)
    if (search) {
      query.$or = [
        { attribute_name: { $regex: search, $options: "i" } },
        { categorie_name: { $regex: search, $options: "i" } },
      ];
    }

    // filter by status
    if (status) {
      query.status = { $regex: status, $options: "i" };
    }

    // the sort object
    const sortOptions = { createdAt: -1 };

    if (sort) {
      if (sort.toLowerCase() === "newest") {
        sortOptions.createdAt = -1;
      }
      if (sort.toLowerCase() === "oldest") {
        sortOptions.createdAt = 1;
      }
    }

    // find attributes with pagination
    const productAttributes = await ProductAttribute.find(query)
      .select(
        "_id attribute_name global_attribute categorie_name priority_number status createdAt"
      )
      .sort(sortOptions)
      .skip(skipAttributes)
      .limit(perPageAttributes);

    // count total attributes matching the query
    const totalAttributesNumber = await ProductAttribute.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Product attributes fetch successfully",
      totalAttributes: totalAttributesNumber,
      data: productAttributes,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch product attributes" });
  }
};

/**
 * @route   POST /api/product-attributes
 * @desc    Create a new product attribute
 * @access  Private(admin)
 */
exports.createProductAttribute = async (req, res) => {
  try {
    const productAttribute = await ProductAttribute.create(req.body);

    res.status(201).json({
      success: true,
      message: "Product attribute create successfully",
      data: productAttribute,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create product attribute",
      error,
    });
  }
};

/**
 * @route   PUT /api/product-attributes/:id
 * @desc    Update an existing product attribute by ID
 * @access  Private(admin)
 */
exports.updateProductAttribute = async (req, res) => {
  try {
    const productAttribute = await ProductAttribute.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return the updated document
        runValidators: true, // Validate before updating
      }
    );

    if (!productAttribute) {
      return res
        .status(404)
        .json({ success: false, message: "Product attribute not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product attribute updated successfully",
      data: productAttribute,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid product attribute ID format",
      });
    }

    res
      .status(500)
      .json({ success: false, message: "Failed to update product attribute" });
  }
};

/**
 * @route   DELETE /api/product-attributes/:id
 * @desc    Delete an existing product attribute by ID
 * @access  Private(admin)
 */
exports.deleteProductAttribute = async (req, res) => {
  try {
    const productAttribute = await ProductAttribute.findByIdAndDelete(
      req.params.id
    );

    if (!productAttribute) {
      return res
        .status(404)
        .json({ success: false, message: "Product attribute not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product attribute deleted successfully",
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid product attribute ID format",
      });
    }

    res
      .status(500)
      .json({ success: false, message: "Failed to delete product attribute" });
  }
};
