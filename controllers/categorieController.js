// Internal imports
const Categorie = require("../models/Categorie");

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
    const sortOptions = {};

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
    }).select("_id categorie_name");

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
      data: modified_categories_list,
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
