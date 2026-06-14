const userService = require("../services/user.service");

async function getMe(req, res, next) {
  try {
    const user = await userService.getMe(req.user.id);

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully.",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getMe,
};
