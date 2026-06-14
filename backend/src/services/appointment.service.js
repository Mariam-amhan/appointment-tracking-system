const mongoose = require("mongoose");

const Appointment = require("../models/appointment.model");
const AppError = require("../utils/appError");
const { ensureServiceExists, sanitizeService } = require("./service.service");

function sanitizeAppointment(appointment) {
  let mappedService = null;

  if (appointment.service) {
    if (typeof appointment.service === "object") {
      mappedService = sanitizeService(appointment.service);
    } else {
      mappedService = String(appointment.service);
    }
  }

  return {
    id: String(appointment._id),
    user:
      appointment.user && typeof appointment.user === "object"
        ? {
            id: String(appointment.user._id || appointment.user.id),
            fullName: appointment.user.fullName,
            email: appointment.user.email,
            role: appointment.user.role,
          }
        : String(appointment.user),
    service: mappedService,
    appointmentAt: appointment.appointmentAt,
    status: appointment.status,
    note: appointment.note,
    createdAt: appointment.createdAt,
    updatedAt: appointment.updatedAt,
  };
}

async function ensureSlotAvailable(serviceId, appointmentAt, excludeId = null) {
  const query = {
    service: serviceId,
    appointmentAt,
    status: { $in: ["pending", "approved"] },
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const conflict = await Appointment.findOne(query);
  if (conflict) {
    throw new AppError("Bu randevu saati zaten dolu.", 409);
  }
}

async function createAppointment(userId, { serviceId, appointmentAt, note }) {
  const service = await ensureServiceExists(serviceId);
  await ensureSlotAvailable(service._id, appointmentAt);

  const appointment = await Appointment.create({
    user: userId,
    service: service._id,
    appointmentAt,
    note,
  });

  const appointmentWithService = await Appointment.findById(appointment._id).populate(
    "service"
  );

  return sanitizeAppointment(appointmentWithService);
}

async function listMyAppointments(userId) {
  const appointments = await Appointment.find({ user: userId })
    .populate("service")
    .sort({
      appointmentAt: 1,
    });

  return appointments.map(sanitizeAppointment);
}

async function cancelMyAppointment(userId, appointmentId) {
  if (!mongoose.isValidObjectId(appointmentId)) {
    throw new AppError("Gecersiz randevu kimligi.", 400);
  }

  const appointment = await Appointment.findOne({
    _id: appointmentId,
    user: userId,
  });

  if (!appointment) {
    throw new AppError("Randevu bulunamadi.", 404);
  }

  if (appointment.status === "approved") {
    throw new AppError("Kabul edilen randevu iptal edilemez.", 400);
  }

  if (appointment.status === "cancelled") {
    throw new AppError("Randevu zaten iptal edilmis.", 400);
  }

  appointment.status = "cancelled";
  await appointment.save();

  const appointmentWithService = await Appointment.findById(appointment._id).populate(
    "service"
  );

  return sanitizeAppointment(appointmentWithService);
}

module.exports = {
  createAppointment,
  listMyAppointments,
  cancelMyAppointment,
  ensureSlotAvailable,
  sanitizeAppointment,
};
