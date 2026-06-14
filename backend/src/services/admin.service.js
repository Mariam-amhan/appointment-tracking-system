const mongoose = require("mongoose");

const Appointment = require("../models/appointment.model");
const User = require("../models/user.model");
const AppError = require("../utils/appError");
const Service = require("../models/service.model");
const {
  ensureSlotAvailable,
  sanitizeAppointment,
} = require("./appointment.service");
const { sanitizeService } = require("./service.service");

function sanitizeUser(user) {
  return {
    id: String(user._id),
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    active: user.active,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function listAllAppointments() {
  const appointments = await Appointment.find()
    .populate("user", "fullName email role")
    .populate("service")
    .sort({ appointmentAt: -1 });

  return appointments.map(sanitizeAppointment);
}

async function updateAppointmentStatus(appointmentId, status) {
  if (!mongoose.isValidObjectId(appointmentId)) {
    throw new AppError("Invalid appointment id.", 400);
  }

  const appointment = await Appointment.findById(appointmentId).populate(
    "user",
    "fullName email role"
  );

  if (!appointment) {
    throw new AppError("Appointment not found.", 404);
  }

  if (status === "approved" && appointment.status !== "approved") {
    await ensureSlotAvailable(
      appointment.service,
      appointment.appointmentAt,
      appointment._id
    );
  }

  appointment.status = status;
  await appointment.save();

  const updatedAppointment = await Appointment.findById(appointment._id)
    .populate("user", "fullName email role")
    .populate("service");

  return sanitizeAppointment(updatedAppointment);
}

async function listUsers() {
  const users = await User.find().sort({ createdAt: -1 });
  return users.map(sanitizeUser);
}

async function updateUserRole(userId, role) {
  if (!mongoose.isValidObjectId(userId)) {
    throw new AppError("Invalid user id.", 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found.", 404);
  }

  user.role = role;
  await user.save();

  return sanitizeUser(user);
}

async function updateUserActive(userId, active, actorId) {
  if (!mongoose.isValidObjectId(userId)) {
    throw new AppError("Invalid user id.", 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found.", 404);
  }

  if (String(user._id) === String(actorId) && !active) {
    throw new AppError("You cannot deactivate your own account.", 400);
  }

  user.active = active;
  await user.save();

  return sanitizeUser(user);
}

function sanitizeServiceAdmin(service) {
  return sanitizeService(service);
}

async function listServices() {
  const services = await Service.find().sort({ createdAt: -1 });
  return services.map(sanitizeServiceAdmin);
}

async function createService(payload) {
  const existing = await Service.findOne({ name: payload.name });
  if (existing) {
    throw new AppError("Service name already exists.", 409);
  }

  const service = await Service.create(payload);
  return sanitizeServiceAdmin(service);
}

async function updateService(serviceId, payload) {
  if (!mongoose.isValidObjectId(serviceId)) {
    throw new AppError("Invalid service id.", 400);
  }

  const service = await Service.findById(serviceId);
  if (!service) {
    throw new AppError("Service not found.", 404);
  }

  if (payload.name) {
    const duplicate = await Service.findOne({
      name: payload.name,
      _id: { $ne: serviceId },
    });

    if (duplicate) {
      throw new AppError("Service name already exists.", 409);
    }
  }

  Object.assign(service, payload);
  await service.save();

  return sanitizeServiceAdmin(service);
}

async function deleteAppointment(appointmentId) {
  if (!mongoose.isValidObjectId(appointmentId)) {
    throw new AppError("Invalid appointment id.", 400);
  }

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    throw new AppError("Appointment not found.", 404);
  }

  await Appointment.deleteOne({ _id: appointmentId });
}

async function deleteUser(userId, actorId) {
  if (!mongoose.isValidObjectId(userId)) {
    throw new AppError("Invalid user id.", 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found.", 404);
  }

  if (String(user._id) === String(actorId)) {
    throw new AppError("You cannot delete your own account.", 400);
  }

  await Appointment.deleteMany({ user: user._id });
  await User.deleteOne({ _id: userId });
}

async function deleteService(serviceId) {
  if (!mongoose.isValidObjectId(serviceId)) {
    throw new AppError("Invalid service id.", 400);
  }

  const service = await Service.findById(serviceId);
  if (!service) {
    throw new AppError("Service not found.", 404);
  }

  await Appointment.deleteMany({ service: service._id });
  await Service.deleteOne({ _id: serviceId });
}

module.exports = {
  listAllAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  listUsers,
  updateUserRole,
  updateUserActive,
  deleteUser,
  listServices,
  createService,
  updateService,
  deleteService,
};
