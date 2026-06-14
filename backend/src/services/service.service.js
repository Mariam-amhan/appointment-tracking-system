const mongoose = require("mongoose");

const Service = require("../models/service.model");
const AppError = require("../utils/appError");

function sanitizeService(service) {
  return {
    id: String(service._id),
    name: service.name,
    description: service.description,
    durationMinutes: service.durationMinutes,
    active: service.active,
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
  };
}

async function ensureServiceExists(serviceId, { mustBeActive = true } = {}) {
  if (!mongoose.isValidObjectId(serviceId)) {
    throw new AppError("Invalid service id.", 400);
  }

  const service = await Service.findById(serviceId);
  if (!service) {
    throw new AppError("Service not found.", 404);
  }

  if (mustBeActive && !service.active) {
    throw new AppError("Selected service is not active.", 400);
  }

  return service;
}

async function listPublicServices() {
  const services = await Service.find({ active: true }).sort({ createdAt: -1 });
  return services.map(sanitizeService);
}

async function listAllServices() {
  const services = await Service.find().sort({ createdAt: -1 });
  return services.map(sanitizeService);
}

async function createService(payload) {
  const existing = await Service.findOne({ name: payload.name });
  if (existing) {
    throw new AppError("Service name already exists.", 409);
  }

  const service = await Service.create(payload);
  return sanitizeService(service);
}

async function updateService(serviceId, payload) {
  await ensureServiceExists(serviceId, { mustBeActive: false });

  if (payload.name) {
    const duplicate = await Service.findOne({
      name: payload.name,
      _id: { $ne: serviceId },
    });
    if (duplicate) {
      throw new AppError("Service name already exists.", 409);
    }
  }

  const service = await Service.findByIdAndUpdate(serviceId, payload, {
    new: true,
    runValidators: true,
  });

  return sanitizeService(service);
}

module.exports = {
  sanitizeService,
  ensureServiceExists,
  listPublicServices,
  listAllServices,
  createService,
  updateService,
};
