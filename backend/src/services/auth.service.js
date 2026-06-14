const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const env = require("../config/env");
const User = require("../models/user.model");
const AppError = require("../utils/appError");
function signToken(user) {
  if (!env.jwtSecret) {
throw new AppError("JWT secret is not configured.", 500);
  }
  return jwt.sign(
    {
      sub: String(user._id),
      role: user.role,
      email: user.email,
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}
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
async function register({ fullName, email, password }) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Email is already in use.", 409);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
  });
  const token = signToken(user);
  return { token, user: sanitizeUser(user) };
}

async function login({ email, password }) {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }
  if (!user.active) {
    throw new AppError("User account is inactive.", 403);
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new AppError("Invalid email or password.", 401);
  }
  const token = signToken(user);
  return { token, user: sanitizeUser(user) };
}
module.exports = {
  register,
  login,
};
