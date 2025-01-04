// External imports
const express = require("express");

// Internal imports
const adminController = require("../controllers/adminController");
const { checkIfAdmin } = require("../middleware/common/authorization");
const { authenticateToken } = require("../middleware/common/authenticate");

// Initialize the router
const router = express.Router();

/**
 * @route   GET /api/admins/apartments
 * @desc    Retrieve all apartments
 * @access  Private(admin)
 */
router.get(
  "/apartments",
  authenticateToken,
  checkIfAdmin,
  adminController.getAllApartments
);

/**
 * @route   GET /api/admins/blogs
 * @desc    Retrieve all blogs
 * @access  Private(admin)
 */
router.get(
  "/blogs",
  authenticateToken,
  checkIfAdmin,
  adminController.getAllBlogs
);

/**
 * @route   GET /api/admins/locations
 * @desc    Retrieve all locations
 * @access  Private(admin)
 */
router.get(
  "/locations",
  authenticateToken,
  checkIfAdmin,
  adminController.getAllLocations
);

/**
 * @route   GET /api/admins/locations/:countryId
 * @desc    Retrieve an location
 * @access  Private(admin)
 */
router.get(
  "/locations/:countryId",
  authenticateToken,
  checkIfAdmin,
  adminController.getAnLocation
);

/**
 * @route   GET /api/admins/statistics
 * @desc    Retrieve an statistics
 * @access  Private(admin)
 */
router.get(
  "/statistics",
  authenticateToken,
  checkIfAdmin,
  adminController.getStatistics
);

/**
 * @route   GET /api/admins/feature-location
 * @desc    Retrieve all feature location
 * @access  Public
 */
router.get("/feature-location", adminController.getAllFeatureLocations);

/**
 * @route   POST /api/admins/feature-location
 * @desc    Create a new feature location
 * @access  Private(admin)
 */
router.post(
  "/feature-location",
  authenticateToken,
  checkIfAdmin,
  adminController.createFeatureLocation
);

/**
 * @route   DELETE /api/admins/feature-location/:id
 * @desc    Delete an existing feature location by ID
 * @access  Private(admin)
 */
router.delete(
  "/feature-location/:id",
  authenticateToken,
  checkIfAdmin,
  adminController.deleteFeatureLocation
);

/**
 * @route   GET /api/admins/customer-reviews
 * @desc    Retrieve all customer reviews
 * @access  Public
 */
router.get("/customer-reviews", adminController.getAllCustomerReviews);

/**
 * @route   POST /api/admins/customer-reviews
 * @desc    Create a new customer review
 * @access  Private(admin)
 */
router.post(
  "/customer-reviews",
  authenticateToken,
  checkIfAdmin,
  adminController.createCustomerReview
);

/**
 * @route   POST /api/admins/customer-reviews/:id
 * @desc    Update an existing customer review by ID
 * @access  Private(admin)
 */
router.post(
  "/customer-reviews/:id",
  authenticateToken,
  checkIfAdmin,
  adminController.updateCustomerReviews
);

/**
 * @route   GET /api/admins/banner-sliders
 * @desc    Retrieve all banner sliders
 * @access  Private(admin)
 */
router.get("/banner-sliders", adminController.getAllBannerSliders);

/**
 * @route   POST /api/admins/banner-sliders
 * @desc    Create a new banner slider
 * @access  Private(admin)
 */
router.post(
  "/banner-sliders",
  authenticateToken,
  checkIfAdmin,
  adminController.createBannerSlider
);

/**
 * @route   POST /api/admins/banner-sliders/:id
 * @desc    Update an existing banner slider by ID
 * @access  Private(admin)
 */
router.post(
  "/banner-sliders/:id",
  authenticateToken,
  checkIfAdmin,
  adminController.updateBannerSliders
);

/**
 * @route   GET /api/admins/banner-slider-contents
 * @desc    Retrieve all banner slider contents
 * @access  Public
 */
router.get(
  "/banner-slider-contents",
  adminController.getAllBannerSlidersContents
);

/**
 * @route   POST /api/admins/banner-slider-contents
 * @desc    Create a new banner slider content
 * @access  Private(admin)
 */
router.post(
  "/banner-slider-contents",
  authenticateToken,
  checkIfAdmin,
  adminController.createBannerSliderContent
);

/**
 * @route   POST /api/admins/banner-slider-contents/:id
 * @desc    Update an existing banner slider content by ID
 * @access  Private(admin)
 */
router.post(
  "/banner-slider-contents/:id",
  authenticateToken,
  checkIfAdmin,
  adminController.updateBannerSlidersContent
);

// Export the router
module.exports = router;
