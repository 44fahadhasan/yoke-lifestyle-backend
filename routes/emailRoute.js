// External imports
const express = require("express");

// Internal imports
const { handleSendEmail } = require("../controllers/emailController");

// Initialize the router
const router = express.Router();

/**
 * @route   POST /api/send-email
 * @desc    Send an email
 * @access  Public
 */
router.post("/", handleSendEmail);

module.exports = router;
