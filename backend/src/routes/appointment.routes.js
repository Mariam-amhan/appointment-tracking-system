const express = require("express");

const appointmentController = require("../controllers/appointment.controller");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(verifyToken);

router.post("/", appointmentController.createAppointment);
router.get("/my", appointmentController.listMyAppointments);
router.patch("/:id/cancel", appointmentController.cancelMyAppointment);

module.exports = router;
