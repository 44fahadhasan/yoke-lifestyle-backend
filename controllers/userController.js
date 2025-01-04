// Internal imports
const User = require("../models/User");
const { cookieOptions } = require("../utils/cookieOption");
const { hashPassword, comparePassword } = require("../utils/passwordManager");
const { generateTokens, verifyRefreshToken } = require("../utils/token");

/**
 * @route   GET /api/users
 * @desc    Retrieve all users
 * @access  Private(admin)
 */
exports.getAllUsers = async (req, res) => {
  try {
    // destructure query parameters with default values
    const { page = 1, limit = 12 } = req.query;

    // pagination settings
    const skip = parseInt(page - 1) * parseInt(limit);

    const users = await User.find()
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const totalUsersNumber = await User.countDocuments();

    const hasMore = skip + users.length < totalUsersNumber;

    res.status(200).json({
      success: true,
      message: "User fetch successfully",
      totalUsers: totalUsersNumber,
      data: users,
      hasMore,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

/**
 * @route   GET /api/users/:email
 * @desc    Retrieve an single user by email
 * @access  Private(Specific User)
 */
exports.getUserDetailsByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select(
      "-password -role"
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch User",
    });
  }
};

/**
 * @route   POST /api/users/signup
 * @desc    Create a new user
 * @access  Public
 */
exports.createUser = async (req, res) => {
  console.log(req.body);
  try {
    // check requested user already signup
    const userIsAvailable = await User.findOne({
      email: req.body.email,
    });

    if (userIsAvailable) {
      return res
        .status(500)
        .json({ success: false, message: "You are already signup" });
    }

    let avatar;
    if (!req.body.avatar) {
      const full_name = req.body.full_name.split(" ").join("");
      avatar = `https://avatar.iran.liara.run/username?username=${full_name}&length=1`;
    }

    const password = await hashPassword(req.body.password);

    const user = await User.create({
      ...req.body,
      avatar: req.body.avatar || avatar,
      password,
    });

    res.status(201).json({
      message: "Signup successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to signup" });
  }
};

/**
 * @route   PUT /api/users/:id
 * @desc    Update an existing user by ID
 * @access  Private(Specific User)
 */
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Validate before updating
    }).select("-password -role");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      message: "User info updated successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid User ID format" });
    }

    res
      .status(500)
      .json({ success: false, message: "Failed to update user ifno" });
  }
};

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete an existing user by ID
 * @access  Private(admin)
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid User ID format" });
    }

    res.status(500).json({ success: false, message: "Failed to delete User" });
  }
};

/**
 * @route   POST /api/users/login
 * @desc    An singup user login
 * @access  Public
 */
exports.userLogin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user || !(await comparePassword(req.body.password, user?.password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    // Store tokens to browser cookies
    const accessExpTime = Number(process.env.ACCESS_TOKEN_EXP_TIME);
    const refreshExpTime = Number(process.env.REFRESH_TOKEN_EXP_TIME);

    res.cookie("accessToken", accessToken, cookieOptions(accessExpTime));
    res.cookie("refreshToken", refreshToken, cookieOptions(refreshExpTime));

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to logged" });
  }
};

/**
 * @route   POST /api/users/logout
 * @desc    An logged user logout
 * @access  Public
 */
exports.userLogout = async (req, res) => {
  const expTime = 0;
  res.clearCookie("accessToken", cookieOptions(expTime));
  res.clearCookie("refreshToken", cookieOptions(expTime));

  res.status(200).json({ success: true, message: "Logged out successfully" });
};

/**
 * @route   POST /api/users/refresh
 * @desc    Access token refresh of a logged user
 * @access  Public
 */
exports.AccessTokenRefresh = async (req, res) => {
  const refreshToken = req.signedCookies.refreshToken;

  if (!refreshToken)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const user = verifyRefreshToken(refreshToken);

    const { accessToken } = generateTokens(user);

    const expTime = Number(process.env.ACCESS_TOKEN_EXP_TIME);

    res.cookie("accessToken", accessToken, cookieOptions(expTime));

    res.status(200).json({ success: true, message: "Access token refreshed" });
  } catch (error) {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};
