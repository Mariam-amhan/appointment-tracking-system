const adminService = require("../services/admin.service");
const {
  validateUpdateAppointmentStatusInput,
  validateUpdateUserRoleInput,
  validateUpdateUserActiveInput,
} = require("../validators/admin.validator");
const {
  validateCreateServiceInput,
  validateUpdateServiceInput,
} = require("../validators/service.validator");


async function listAllAppointments(req, res, next) {
  try {
    const appointments = await adminService.listAllAppointments();
    res.status(200).json({
      success: true,
      message: "All appointments fetched successfully.",
      data: { appointments },
    });
  } catch (error) {
    next(error);
  }
}

async function updateAppointmentStatus(req, res, next) {
  try {
    const payload = validateUpdateAppointmentStatusInput(req.body);
    const appointment = await adminService.updateAppointmentStatus(
      req.params.id,
      payload.status
    );
    res.status(200).json({
      success: true,
      message: "Appointment status updated successfully.",
      data: { appointment },
    });
  } catch (error) {
    next(error);
  }
}

async function deleteAppointment(req, res, next) {
  try {
    await adminService.deleteAppointment(req.params.id);

    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully.",
      data: {},
    });
  } catch (error) {
    next(error);
  }
}

async function listUsers(req, res, next) {
  try {
    const users = await adminService.listUsers();
    res.status(200).json({
      success: true,
      message: "Users fetched successfully.",
      data: { users },
    });
  } catch (error) {
    next(error);
  }
}

async function updateUserRole(req, res, next) {
  try {
    const payload = validateUpdateUserRoleInput(req.body);
    const user = await adminService.updateUserRole(req.params.id, payload.role);
    res.status(200).json({
      success: true,
      message: "Rol Başarıyla güncellendi.",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
}

async function updateUserActive(req, res, next) {
  try {
    const payload = validateUpdateUserActiveInput(req.body);
    const user = await adminService.updateUserActive(
      req.params.id,
      payload.active,
      req.user.id
    );
    res.status(200).json({
      success: true,
      message: "User status updated successfully.",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    await adminService.deleteUser(req.params.id, req.user.id);
    res.status(200).json({
      success: true,
      message: "User deleted successfully.",
      data: {},
    });
  } catch (error) {
    next(error);
  }
}

async function listServices(req, res, next) {
  try {
    const services = await adminService.listServices();
    res.status(200).json({
      success: true,
      message: "Services fetched successfully.",
      data: { services },
    });
  } catch (error) {
    next(error);
  }
}

async function createService(req, res, next) {
  try{const payload = validateCreateServiceInput(req.body);
    const service = await adminService.createService(payload);
    res.status(201).json({
      success: true,
      message: "Service created successfully.",
      data: { service },
    });
  } catch (error) {
    next(error);}}

async function updateService(req, res, next) {
  try {
    const payload = validateUpdateServiceInput(req.body);
    const service = await adminService.updateService(req.params.id, payload);
    res.status(200).json({
      success: true,
      message: "Service updated successfully.",
      data: { service },
    });
  } catch (error) {
    next(error);
  }
}

async function deleteService(req, res, next) {
  try {
    await adminService.deleteService(req.params.id);
    res.status(200).json({
      success: true,
      message: "Service deleted successfully.",
      data: {},
    });
  } catch (error) {
    next(error);
  }
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
