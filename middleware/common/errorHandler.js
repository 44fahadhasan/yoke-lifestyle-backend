// External imports
const createError = require("http-errors");

// Not found handler (404)
const notFoundHandler = (req, res, next) => {
  const error = createError(
    404,
    "We’re sorry, but the requested resource was not found!"
  );
  next(error);
};

// Default error handler
const errorHandler = (err, req, res, next) => {
  // Set the response status code
  const status = err.status || 500;

  // Log the error
  console.error({ err });

  // Send the error response
  res.status(status).json({
    status,
    message: err.message || "An unexpected error occurred!",
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
