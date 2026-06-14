const User = require("../models/user.model");
const AppError = require("../utils/appError");

function sanitizeUser(user) {
  return {
    id: String(user._id),
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    active: user.active,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function getMe(userId) {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  return sanitizeUser(user);
}

module.exports = {
  getMe,
};
