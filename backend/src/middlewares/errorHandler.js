function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error.",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
}

module.exports = errorHandler;
