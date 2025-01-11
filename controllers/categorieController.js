// Internal imports
const Categorie = require("../models/Categorie");

/**
 * @route   GET /api/categories
 * @desc    Retrieve all categories
 * @access  Public
 */
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Categorie.find();

    res.status(200).json({
      success: true,
      message: "Categories fetch successfully",
      data: categories,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch categories" });
  }
};

/**
 * @route   POST /api/categories
 * @desc    Create a new categorie
 * @access  Private(admin)
 */
exports.createCategorie = async (req, res) => {
  try {
    const categorie = await Categorie.create(req.body);

    res.status(201).json({
      success: true,
      message: "Categorie create successfully",
      data: categorie,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to create categorie", error });
  }
};

/**
 * @route   PUT /api/categories/:id
 * @desc    Update an existing categorie by ID
 * @access  Private(admin)
 */
exports.updateCategorie = async (req, res) => {
  try {
    const categorie = await Categorie.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return the updated document
        runValidators: true, // Validate before updating
      }
    );

    if (!categorie) {
      return res
        .status(404)
        .json({ success: false, message: "Categorie not found" });
    }

    res.status(200).json({
      success: true,
      message: "Categorie updated successfully",
      data: categorie,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid categorie ID format" });
    }

    res
      .status(500)
      .json({ success: false, message: "Failed to update categorie" });
  }
};

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete an existing categorie by ID
 * @access  Private(admin)
 */
exports.deleteCategorie = async (req, res) => {
  try {
    const categorie = await Categorie.findByIdAndDelete(req.params.id);

    if (!categorie) {
      return res
        .status(404)
        .json({ success: false, message: "Categorie not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Categorie deleted successfully" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid categorie ID format" });
    }

    res
      .status(500)
      .json({ success: false, message: "Failed to delete categorie" });
  }
};
