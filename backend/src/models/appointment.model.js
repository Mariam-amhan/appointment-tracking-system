const mongoose = require("mongoose");
const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    appointmentAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "cancelled"],
      default: "pending",
    },
    note: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },
  },
  { timestamps: true }
);
appointmentSchema.index({ service: 1, appointmentAt: 1, status: 1 });
appointmentSchema.index({ user: 1, createdAt: -1 });
const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
