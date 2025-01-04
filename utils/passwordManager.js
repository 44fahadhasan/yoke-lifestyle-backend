// External imports
const bcrypt = require("bcryptjs");

// generate hashed password
async function hashPassword(password) {
  const saltRounds = 10;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (err) {
    console.error("Error hashing the password:", err);
  }
}

// compare hashed password
async function comparePassword(plainPassword, storedHashedPassword) {
  try {
    const isMatch = await bcrypt.compare(plainPassword, storedHashedPassword);
    return isMatch;
  } catch (err) {
    console.error("Error comparing passwords:", err);
  }
}

module.exports = {
  hashPassword,
  comparePassword,
};
