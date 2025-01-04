// Internal imports
const Apartment = require("../models/Product");
const BannerSlider = require("../models/BannerSlider");
const BannerSliderContent = require("../models/BannerSliderContent");
const Blog = require("../models/Blog");
const CustomerReview = require("../models/CustomerReviews");
const FeatureLocation = require("../models/FeatureLocation");
const Location = require("../models/Categorie");
const User = require("../models/User");

/**
 * @route   GET /api/admins/apartments
 * @desc    Retrieve all apartments
 * @access  Private(admin)
 */
exports.getAllApartments = async (req, res) => {
  try {
    // destructure query parameters with default values
    const { page = 1, limit = 12, objective } = req.query;

    // pagination settings
    const skip = parseInt(page - 1) * parseInt(limit);

    // the query object
    const query = {};

    // Search by objective (buy, rent, sell)
    if (objective) {
      query["objective.status"] = { $regex: objective, $options: "i" };
    }

    const apartments = await Apartment.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const totalApartmentsNumber = await Apartment.countDocuments(query);

    const hasMore = skip + apartments.length < totalApartmentsNumber;

    res.status(200).json({
      success: true,
      message: "Apartment fetch successfully",
      totalApartments: totalApartmentsNumber,
      data: apartments,
      hasMore,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch apartments" });
  }
};

/**
 * @route   GET /api/blogs
 * @desc    Retrieve all blogs
 * @access  Private(admin)
 */
exports.getAllBlogs = async (req, res) => {
  try {
    // destructure query parameters with default values
    const { page = 1, limit = 12 } = req.query;

    // pagination settings
    const skip = parseInt(page - 1) * parseInt(limit);

    // the query object
    const query = {};

    const blogs = await Blog.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    // count total blogs matching the query
    const totalBlogsNumber = await Blog.countDocuments(query);

    const hasMore = skip + blogs.length < totalBlogsNumber;

    res.status(200).json({
      success: true,
      message: "Blogs fetch successfully",
      totalBlogs: totalBlogsNumber,
      data: blogs,
      hasMore,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch blogs" });
  }
};

/**
 * @route   GET /api/admins/locations
 * @desc    Retrieve all locations
 * @access  Private(admin)
 */
exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find().sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: locations });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch locations" });
  }
};

/**
 * @route   GET /api/admins/locations/:countryId
 * @desc    Retrieve an location
 * @access  Private(admin)
 */
exports.getAnLocation = async (req, res) => {
  try {
    const location = await Location.findById(req.params.countryId);

    res.status(200).json({ success: true, data: location });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch location" });
  }
};

/**
 * @route   GET /api/admins/statistics
 * @desc    Retrieve an statistics
 * @access  Private(admin)
 */
exports.getStatistics = async (req, res) => {
  try {
    const location = await Location.countDocuments();
    const buy = await Apartment.countDocuments({ "objective.status": "Buy" });
    const rent = await Apartment.countDocuments({ "objective.status": "Rent" });
    const sell = await Apartment.countDocuments({ "objective.status": "Sell" });
    const apartment = await Apartment.countDocuments();
    const user = await User.countDocuments({ role: "user" });
    const admin = await User.countDocuments({ role: "admin" });
    const allUser = await User.countDocuments();

    res.status(200).json({
      success: true,
      data: { location, buy, rent, sell, apartment, user, admin, allUser },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch statistics" });
  }
};

/**
 * @route   GET /api/admins/feature-location
 * @desc    Retrieve all feature location
 * @access  Private(admin)
 */
exports.getAllFeatureLocations = async (req, res) => {
  try {
    const featureLocations = await FeatureLocation.find();

    res.status(201).json({
      success: true,
      message: "Feature Location fetch successfully",
      data: featureLocations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create feature location",
      error,
    });
  }
};

/**
 * @route   POST /api/admins/feature-location
 * @desc    Create a new feature location
 * @access  Private(admin)
 */
exports.createFeatureLocation = async (req, res) => {
  try {
    const totalFeatureLocationsNumber = await FeatureLocation.countDocuments();

    if (totalFeatureLocationsNumber >= 6) {
      return res.status(500).json({
        success: false,
        message:
          "You can create maximum 6 feature locations. Please delete an existing location",
      });
    }

    const featureLocation = await FeatureLocation.create(req.body);

    res.status(201).json({
      success: true,
      message: "Feature location created successfully",
      data: featureLocation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create feature location",
      error,
    });
  }
};

/**
 * @route   DELETE /api/admins/feature-location/:id
 * @desc    Delete an existing feature location by ID
 * @access  Private(admin)
 */
exports.deleteFeatureLocation = async (req, res) => {
  try {
    const featureLocation = await FeatureLocation.findByIdAndDelete(
      req.params.id
    );

    if (!featureLocation) {
      return res
        .status(404)
        .json({ success: false, message: "Feature location not found" });
    }

    res.status(200).json({
      success: true,
      message: "Feature location deleted successfully",
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid feature location ID format",
      });
    }

    res
      .status(500)
      .json({ success: false, message: "Failed to delete feature location" });
  }
};

/**
 * @route   GET /api/admins/customer-reviews
 * @desc    Retrieve all customer reviews
 * @access  Private(admin)
 */
exports.getAllCustomerReviews = async (req, res) => {
  try {
    const customerReviews = await CustomerReview.find();

    res.status(201).json({
      success: true,
      message: "Customer reviews fetch successfully",
      data: customerReviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch customer reviews",
    });
  }
};

/**
 * @route   POST /api/admins/customer-reviews
 * @desc    Create a new customer review
 * @access  Private(admin)
 */
exports.createCustomerReview = async (req, res) => {
  try {
    const totalCustomerReview = await CustomerReview.countDocuments();

    if (totalCustomerReview >= 1) {
      return res.status(500).json({
        success: false,
        message: "You can create maximum 1 customer review.",
      });
    }

    const customerReview = await CustomerReview.create(req.body);

    res.status(201).json({
      success: true,
      message: "Customer review created successfully",
      data: customerReview,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to customer review" });
  }
};

/**
 * @route   POST /api/admins/customer-reviews/:id
 * @desc    Update customer reviews
 * @access  Private(admin)
 */
exports.updateCustomerReviews = async (req, res) => {
  try {
    const customerReviews = await CustomerReview.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return the updated document
        runValidators: true, // Validate before updating
      }
    );

    if (!customerReviews) {
      return res
        .status(404)
        .json({ success: false, message: "Customer review not found" });
    }

    res.status(200).json({
      success: true,
      message: "Customer reviews updated successfully",
      data: customerReviews,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid customer reviews ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update customer reviews",
    });
  }
};

/**
 * @route   GET /api/admins/banner-sliders
 * @desc    Retrieve all banner sliders
 * @access  Private(admin)
 */
exports.getAllBannerSliders = async (req, res) => {
  try {
    const bannerSliders = await BannerSlider.find();

    res.status(201).json({
      success: true,
      message: "Banner sliders fetch successfully",
      data: bannerSliders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch banner sliders",
    });
  }
};

/**
 * @route   POST /api/admins/banner-sliders
 * @desc    Create a new banner slider
 * @access  Private(admin)
 */
exports.createBannerSlider = async (req, res) => {
  try {
    const bannerSliders = await BannerSlider.countDocuments();

    if (bannerSliders >= 1) {
      return res.status(500).json({
        success: false,
        message: "You can create maximum 1 banner slider.",
      });
    }

    const bannerSlider = await BannerSlider.create(req.body);

    res.status(201).json({
      success: true,
      message: "Banner slider created successfully",
      data: bannerSlider,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to slider created" });
  }
};

/**
 * @route   POST /api/admins/banner-sliders/:id
 * @desc    Update an existing banner slider by ID
 * @access  Private(admin)
 */
exports.updateBannerSliders = async (req, res) => {
  try {
    const bannerSliders = await BannerSlider.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return the updated document
        runValidators: true, // Validate before updating
      }
    );

    if (!bannerSliders) {
      return res
        .status(404)
        .json({ success: false, message: "Banner slider not found" });
    }

    res.status(200).json({
      success: true,
      message: "Banner slider updated successfully",
      data: bannerSliders,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid banner slider ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update banner slider",
    });
  }
};

/**
 * @route   GET /api/admins/banner-slider-contents
 * @desc    Retrieve all banner slider contents
 * @access  Public
 */
exports.getAllBannerSlidersContents = async (req, res) => {
  try {
    const bannerSliderContents = await BannerSliderContent.find();

    res.status(201).json({
      success: true,
      message: "Banner slider content fetch successfully",
      data: bannerSliderContents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch banner slider content",
    });
  }
};

/**
 * @route   POST /api/admins/banner-slider-contents
 * @desc    Create a new banner slider content
 * @access  Private(admin)
 */
exports.createBannerSliderContent = async (req, res) => {
  try {
    const bannerSlidercontent = await BannerSliderContent.countDocuments();

    if (bannerSlidercontent >= 1) {
      return res.status(500).json({
        success: false,
        message: "You can create maximum 1 banner slider content.",
      });
    }

    const bannerSlider = await BannerSliderContent.create(req.body);

    res.status(201).json({
      success: true,
      message: "Banner slider content created successfully",
      data: bannerSlider,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to slider content created" });
  }
};

/**
 * @route   POST /api/admins/banner-slider-contents/:id
 * @desc    Update an existing banner slider content by ID
 * @access  Private(admin)
 */
exports.updateBannerSlidersContent = async (req, res) => {
  try {
    const bannerSlidercontent = await BannerSliderContent.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return the updated document
        runValidators: true, // Validate before updating
      }
    );

    if (!bannerSlidercontent) {
      return res
        .status(404)
        .json({ success: false, message: "Banner slider content not found" });
    }

    res.status(200).json({
      success: true,
      message: "Banner slider content updated successfully",
      data: bannerSlidercontent,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid banner slider content ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update banner slider content",
    });
  }
};
