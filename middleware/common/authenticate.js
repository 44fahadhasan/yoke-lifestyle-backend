// External imports
const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

// Middleware to Authenticate Access Token
function authenticateToken(req, res, next) {
  const accessToken = req.signedCookies.accessToken;

  if (!accessToken) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    req.user = user; // Attach user info to request
    next();
  });
}

module.exports = { authenticateToken };
