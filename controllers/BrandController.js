// External imports
const mongoose = require("mongoose");

// Internal imports
const Brand = require("../models/Brand");

/**
 * @route   GET /api/brands
 * @desc    Retrieve all brands
 * @access  Private(admin)
 */
exports.getAllBrands = async (req, res) => {
  try {
    // destructure query parameters with default values
    const { search, featured, status, sort, page = 0, size = 6 } = req.query;

    // pagination settings
    const perPageBrands = parseInt(size);
    const currentPage = parseInt(page);
    const skipBrands = currentPage * perPageBrands;

    // the query object
    const query = {};

    // search by search text (brand name or slug/path)
    if (search) {
      query.$or = [
        { brand_name: { $regex: search, $options: "i" } },
        { slug_name: { $regex: search, $options: "i" } },
      ];
    }

    // filter by featured brand
    if (featured) {
      query.featured_brand = { $regex: featured, $options: "i" };
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

    // find brands with pagination
    const brands = await Brand.find(query)
      .select(
        "_id brand_name slug_name priority_number status featured_brand createdAt"
      )
      .sort(sortOptions)
      .skip(skipBrands)
      .limit(perPageBrands);

    // count total brands matching the query
    const totalBrandsNumber = await Brand.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Brands fetch successfully",
      totalBrands: totalBrandsNumber,
      data: brands,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch brands" });
  }
};

/**
 * @route   GET /api/brands/list
 * @desc    Retrieve all brands list
 * @access  Private(admin)
 */
exports.getAllBrandsList = async (req, res) => {
  try {
    const brands_list = await Brand.find({
      status: "published",
    })
      .select("_id brand_name")
      .sort({ createdAt: -1 });

    // modify data
    const modified_brands_list = brands_list?.map(({ brand_name, _id }) => ({
      label: brand_name,
      value: brand_name,
      _id,
    }));

    res.status(200).json({
      success: true,
      message: "Brands list fetch successfully",
      data: [
        {
          label: "No Brand",
          value: null,
          _id: null,
        },
        ...modified_brands_list,
      ],
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch brands list" });
  }
};

/**
 * @route   GET /api/brands/details/:id
 * @desc    Retrieve a single brand details by ID
 * @access  Private(admin)
 */
exports.getBrandDetailstById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res
        .status(404)
        .json({ success: false, message: "Brand not found" });
    }

    res.status(200).json({
      success: true,
      message: "Brand fetch successfully",
      data: brand,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid brand ID format" });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch brand",
    });
  }
};

/**
 * @route   POST /api/brands
 * @desc    Create a new brand
 * @access  Private(admin)
 */
exports.createBrand = async (req, res) => {
  try {
    const brand = await Brand.create(req.body);

    res.status(201).json({
      success: true,
      message: "Brand create successfully",
      data: brand,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to create brand", error });
  }
};

/**
 * @route   PUT /api/brands/:id
 * @desc    Update an existing brand by ID
 * @access  Private(admin)
 */
exports.updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Validate before updating
    });

    if (!brand) {
      return res
        .status(404)
        .json({ success: false, message: "Brand not found" });
    }

    res.status(200).json({
      success: true,
      message: "Brand updated successfully",
      data: brand,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid brand ID format" });
    }

    res.status(500).json({ success: false, message: "Failed to update brand" });
  }
};

/**
 * @route   DELETE /api/brands/:id
 * @desc    Delete an existing brand by ID
 * @access  Private(admin)
 */
exports.deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);

    if (!brand) {
      return res
        .status(404)
        .json({ success: false, message: "Brand not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Brand deleted successfully" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid brand ID format" });
    }

    res.status(500).json({ success: false, message: "Failed to delete brand" });
  }
};
