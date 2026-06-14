const appointmentService = require("../services/appointment.service");
const {
  validateCreateAppointmentInput,
} = require("../validators/appointment.validator");

async function createAppointment(req, res, next) {
  try {
    const payload = validateCreateAppointmentInput(req.body);
    const appointment = await appointmentService.createAppointment(
      req.user.id,
      payload
    );

    res.status(201).json({
      success: true,
      message: "Randevu basariyla olusturuldu.",
      data: { appointment },
    });
  } catch (error) {
    next(error);
  }
}

async function listMyAppointments(req, res, next) {
  try {
    const appointments = await appointmentService.listMyAppointments(req.user.id);

    res.status(200).json({
      success: true,
      message: "Randevular basariyla listelendi.",
      data: { appointments },
    });
  } catch (error) {
    next(error);
  }
}

async function cancelMyAppointment(req, res, next) {
  try {
    const appointment = await appointmentService.cancelMyAppointment(
      req.user.id,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Randevu basariyla iptal edildi.",
      data: { appointment },
    });
  } catch (error) {
    next(error);
  }
}
module.exports = {
  createAppointment,
  listMyAppointments,
  cancelMyAppointment,
};
