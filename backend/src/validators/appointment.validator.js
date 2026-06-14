const AppError = require("../utils/appError");
const mongoose = require("mongoose");

function parseAppointmentAt(value) {
  const date = new Date(value);

  if (!value || Number.isNaN(date.getTime())) {
    throw new AppError("A valid appointmentAt datetime is required.", 400);
  }

  if (date.getTime() <= Date.now()) {
    throw new AppError("appointmentAt must be a future datetime.", 400);
  }

  return date;
}

function validateCreateAppointmentInput(payload) {
  const serviceId = payload?.serviceId;
  const appointmentAt = parseAppointmentAt(payload?.appointmentAt);
  const note = payload?.note ? String(payload.note).trim() : "";

  if (!serviceId || !mongoose.isValidObjectId(serviceId)) {
    throw new AppError("A valid serviceId is required.", 400);
  }

  if (note.length > 300) {
    throw new AppError("Note cannot exceed 300 characters.", 400);
  }

  return {
    serviceId,
    appointmentAt,
    note,
  };
}

module.exports = {
  validateCreateAppointmentInput,
};
