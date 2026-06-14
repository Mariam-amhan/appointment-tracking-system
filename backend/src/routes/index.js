const express = require("express");
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const appointmentRoutes = require("./appointment.routes");
const adminRoutes = require("./admin.routes");
const serviceRoutes = require("./service.routes");

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running.",
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/admin", adminRoutes);
router.use("/services", serviceRoutes);

module.exports = router;
