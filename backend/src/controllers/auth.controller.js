const authService = require("../services/auth.service");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../validators/auth.validator");

function setTokenCookie(res, token) {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });
}

async function register(req, res, next) {
  try {
    const payload = validateRegisterInput(req.body);
    const { token, user } = await authService.register(payload);

    setTokenCookie(res, token);

    res.status(201).json({
      success: true,
      message: "Register successful.",
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const payload = validateLoginInput(req.body);
    const { token, user } = await authService.login(payload);

    setTokenCookie(res, token);

    res.status(200).json({
      success: true,
      message: "Login successful.",
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
};
