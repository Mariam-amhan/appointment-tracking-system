const express = require("express");

const userController = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/me", verifyToken, userController.getMe);

module.exports = router;
