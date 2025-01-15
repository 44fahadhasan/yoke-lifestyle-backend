// External imports
const mongoose = require("mongoose");

// Internal imports
const Categorie = require("../models/Categorie");

/**
 * @route   GET /api/categories/parent
 * @desc    Retrieve all parent categories
 * @access  Public
 */
exports.getAllParentCategories = async (req, res) => {
  try {
    const { featured } = req.query;

    const query = {
      parent_categorie: null,
      status: "published",
    };

    // filter by featured categorie
    if (featured) {
      query.featured_categorie = { $regex: featured, $options: "i" };
    }

    const categories = await Categorie.find(query)
      .select("-updatedAt -createdAt -email -status")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Parent categories fetch successfully",
      data: categories,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch parent categories" });
  }
};

/**
 * @route   GET /api/categories/:parentId/children
 * @desc    Retrieve all children categories of any parent categorie
 * @access  Public
 */
exports.getAllChildrenCategories = async (req, res) => {
  try {
    const { featured } = req.query;
    const { parentId } = req.params;

    // validate parentId
    if (!mongoose.Types.ObjectId.isValid(parentId)) {
      return res.status(500).json({
        success: false,
        message: "Invalid parent categorie id format",
      });
    }

    const query = {
      parent_categorie: parentId,
      status: "published",
    };

    // filter by featured categorie
    if (featured) {
      query.featured_categorie = { $regex: featured, $options: "i" };
    }

    const categories = await Categorie.find(query)
      .select("-updatedAt -createdAt -email -status")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Children categories fetch successfully",
      data: categories,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch children categories" });
  }
};

/**
 * @route   GET /api/categories
 * @desc    Retrieve all categories
 * @access  Private(admin)
 */
exports.getAllCategories = async (req, res) => {
  try {
    // destructure query parameters with default values
    const { search, featured, status, sort, page = 0, size = 6 } = req.query;

    // pagination settings
    const perPageCategories = parseInt(size);
    const currentPage = parseInt(page);
    const skipCategories = currentPage * perPageCategories;

    // the query object
    const query = {};

    // search by search text (category name or slug/path)
    if (search) {
      query.$or = [
        { categorie_name: { $regex: search, $options: "i" } },
        { slug_name: { $regex: search, $options: "i" } },
      ];
    }

    // filter by featured categorie
    if (featured) {
      query.featured_categorie = { $regex: featured, $options: "i" };
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

    // find categories with pagination
    const categories = await Categorie.find(query)
      .select(
        "_id categorie_name slug_name status featured_categorie createdAt"
      )
      .sort(sortOptions)
      .skip(skipCategories)
      .limit(perPageCategories);

    // count total categories matching the query
    const totalCategoriesNumber = await Categorie.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Categories fetch successfully",
      totalCategories: totalCategoriesNumber,
      data: categories,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch categories" });
  }
};

/**
 * @route   GET /api/categories/list
 * @desc    Retrieve all categories list
 * @access  Private(admin)
 */
exports.getAllCategoriesList = async (req, res) => {
  try {
    const categories_list = await Categorie.find({
      status: "published",
    })
      .select("_id categorie_name")
      .sort({ createdAt: -1 });

    // modify data
    const modified_categories_list = categories_list?.map(
      ({ categorie_name, _id }) => ({
        label: categorie_name,
        value: categorie_name,
        _id,
      })
    );

    res.status(200).json({
      success: true,
      message: "Categories list fetch successfully",
      data: [
        ...modified_categories_list,
        {
          label: "No Parent Category",
          value: null,
          _id: null,
        },
      ],
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch categories list" });
  }
};

/**
 * @route   GET /api/categories/details/:id
 * @desc    Retrieve a single categorie details by ID
 * @access  Private(admin)
 */
exports.getCategorieDetailstById = async (req, res) => {
  try {
    const categorie = await Categorie.findById(req.params.id);

    if (!categorie) {
      return res
        .status(404)
        .json({ success: false, message: "Categorie not found" });
    }

    res.status(200).json({
      success: true,
      message: "Categorie fetch successfully",
      data: categorie,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid categorie ID format" });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch categorie",
    });
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
