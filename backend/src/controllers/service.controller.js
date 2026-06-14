const serviceService = require("../services/service.service");

async function listPublicServices(req, res, next) {
  try {
    const services = await serviceService.listPublicServices();
    res.status(200).json({
      success: true,
      message: "Services fetched successfully.",
      data: { services },
    });
  } catch (error) {
    next(error);
  }
}
module.exports = {
  listPublicServices,
};
