const mongoose = require("mongoose");
const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 400,
      default: "",
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 5,
      max: 480,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
serviceSchema.index({ active: 1, createdAt: -1 });
const Service = mongoose.model("Service", serviceSchema);
module.exports = Service;
