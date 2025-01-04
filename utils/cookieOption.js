const isTrue = process.env.NODE_ENV === "production";

// Cookie options
function cookieOptions(expTime) {
  return {
    httpOnly: true,
    secure: isTrue ? true : false,
    signed: true,
    maxAge: expTime,
    sameSite: isTrue ? "None" : "Lax",
    path: "/",
  };
}

module.exports = { cookieOptions };
