const AppError = require("../utils/appError");

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function validateCreateServiceInput(payload) {
  const name = normalizeText(payload?.name);
  const description = normalizeText(payload?.description);
  const durationMinutes = Number(payload?.durationMinutes);
  const active = payload?.active === undefined ? true : Boolean(payload.active);

  if (!name || name.length < 2) {
    throw new AppError("Service name must be at least 2 characters.", 400);
  }

  if (!Number.isInteger(durationMinutes) || durationMinutes < 5 || durationMinutes > 480) {
    throw new AppError("durationMinutes must be an integer between 5 and 480.", 400);
  }

  if (description.length > 400) {
    throw new AppError("Description cannot exceed 400 characters.", 400);
  }

  return {
    name,
    description,
    durationMinutes,
    active,
  };
}

function validateUpdateServiceInput(payload) {
  const update = {};

  if (payload?.name !== undefined) {
    const name = normalizeText(payload.name);
    if (!name || name.length < 2) {
      throw new AppError("Service name must be at least 2 characters.", 400);
    }
    update.name = name;
  }

  if (payload?.description !== undefined) {
    const description = normalizeText(payload.description);
    if (description.length > 400) {
      throw new AppError("Description cannot exceed 400 characters.", 400);
    }
    update.description = description;
  }

  if (payload?.durationMinutes !== undefined) {
    const durationMinutes = Number(payload.durationMinutes);
    if (!Number.isInteger(durationMinutes) || durationMinutes < 5 || durationMinutes > 480) {
      throw new AppError("durationMinutes must be an integer between 5 and 480.", 400);
    }
    update.durationMinutes = durationMinutes;
  }

  if (payload?.active !== undefined) {
    update.active = Boolean(payload.active);
  }

  if (Object.keys(update).length === 0) {
    throw new AppError("At least one field is required to update service.", 400);
  }

  return update;
}

module.exports = {
  validateCreateServiceInput,
  validateUpdateServiceInput,
};
