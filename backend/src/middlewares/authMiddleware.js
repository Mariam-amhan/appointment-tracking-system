const jwt = require("jsonwebtoken");
const env = require("../config/env");
const User = require("../models/user.model");
const AppError = require("../utils/appError");
function extractToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }
  if (req.cookies?.token) {
    return req.cookies.token;
  }
  return null;
}

async function verifyToken(req, res, next) {
  try {
    const token = extractToken(req);

    if (!token) {
      throw new AppError("Unauthorized. Token is required.", 401);
    }

    if (!env.jwtSecret) {
      throw new AppError("JWT secret is not configured.", 500);
    }

    const decoded = jwt.verify(token, env.jwtSecret);

    const user = await User.findById(decoded.sub);

    if (!user) {
      throw new AppError("Unauthorized. User not found.", 401);
    }

    if (!user.active) {
      throw new AppError("User account is inactive.", 403);
    }

    req.user = {
      id: String(user._id),
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      active: user.active,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return next(new AppError("Invalid or expired token.", 401));
    }

    next(error);
  }
}
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Unauthorized.", 401));
    }
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Forbidden. Insufficient permissions.", 403));
    }
    next();
  };
}
module.exports = {
  verifyToken,
  authorizeRoles,
};
