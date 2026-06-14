const AppError = require("../utils/appError");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRegisterInput(payload) {
  const fullName = payload?.fullName?.trim();
  const email = payload?.email?.trim()?.toLowerCase();
  const password = payload?.password;

  if (!fullName || fullName.length < 2) {
    throw new AppError("Full name must be at least 2 characters.", 400);
  }

  if (!email || !emailPattern.test(email)) {
    throw new AppError("A valid email is required.", 400);
  }

  if (!password || password.length < 6) {
    throw new AppError("Password must be at least 6 characters.", 400);
  }

  return { fullName, email, password };
}

function validateLoginInput(payload) {
  const email = payload?.email?.trim()?.toLowerCase();
  const password = payload?.password;

  if (!email || !emailPattern.test(email)) {
    throw new AppError("A valid email is required.", 400);
  }

  if (!password) {
    throw new AppError("Password is required.", 400);
  }

  return { email, password };
}

module.exports = {
  validateRegisterInput,
  validateLoginInput,
};
