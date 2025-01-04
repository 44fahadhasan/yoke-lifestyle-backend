// Internal imports
const User = require("../../models/User");

// Middleware to check user is admin
async function checkIfAdmin(req, res, next) {
  try {
    // Fetch user by email and only role field
    const user = await User.findOne({ email: req.user.email }).select(
      "role -_id"
    );

    if (user?.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    next();
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
}

// Middleware to check if the current user is authorized to access specific user resources.
function checkUserAccess(req, res, next) {
  const currentUserEmail = req.user.email; // Email from decoded JWT
  const requestUserEmail = req?.params?.email || req?.body?.email;

  // Verify if the current user is authorized
  if (currentUserEmail !== requestUserEmail) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  next();
}

module.exports = { checkIfAdmin, checkUserAccess };
