const AppError = require("../utils/appError");

function validateUpdateAppointmentStatusInput(payload) {
  const status = payload?.status;
  const allowed = ["pending", "approved", "cancelled"];

  if (!allowed.includes(status)) {
    throw new AppError(
      "Invalid status. Allowed values: pending, approved, cancelled.",
      400
    );
  }

  return { status };
}

function validateUpdateUserRoleInput(payload) {
  const role = payload?.role;
  const allowed = ["user", "admin"];

  if (!allowed.includes(role)) {
    throw new AppError("Invalid role. Allowed values: user, admin.", 400);
  }

  return { role };
}

function validateUpdateUserActiveInput(payload) {
  if (typeof payload?.active !== "boolean") {
    throw new AppError("Invalid active value. Allowed values: true, false.", 400);
  }

  return { active: payload.active };
}

module.exports = {
  validateUpdateAppointmentStatusInput,
  validateUpdateUserRoleInput,
  validateUpdateUserActiveInput,
};
