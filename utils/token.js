// External imports
const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const accessExpTime = Number(process.env.ACCESS_TOKEN_EXP_TIME);
const refreshExpTime = Number(process.env.REFRESH_TOKEN_EXP_TIME);

// Generate Tokens
function generateTokens(user) {
  // Create Access Token (short lifespan)
  const accessToken = jwt.sign(
    {
      email: user.email,
      role: user.role,
    }, // Payload

    ACCESS_TOKEN_SECRET, // Secret key

    {
      expiresIn: accessExpTime, // Expiration time
    }
  );

  // Create Refresh Token (long lifespan)
  const refreshToken = jwt.sign(
    {
      email: user.email,
      role: user.role,
    }, // Payload

    REFRESH_TOKEN_SECRET, // Secret key

    { expiresIn: refreshExpTime } // Expiration time
  );

  return { accessToken, refreshToken };
}

// Verify Refresh Token
function verifyRefreshToken(token) {
  try {
    const userInfo = jwt.verify(token, REFRESH_TOKEN_SECRET);
    return userInfo;
  } catch (err) {
    return null;
  }
}

module.exports = {
  generateTokens,
  verifyRefreshToken,
};
