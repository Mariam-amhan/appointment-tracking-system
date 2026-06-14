function sendSuccess(
  res,
  { statusCode = 200, message = "Success", data = null } = {}
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

function sendError(
  res,
  { statusCode = 400, message = "Error", errors = null } = {}
) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
}

module.exports = {
  sendSuccess,
  sendError,
};
