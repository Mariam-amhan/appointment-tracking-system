const express = require("express");

const serviceController = require("../controllers/service.controller");

const router = express.Router();

router.get("/", serviceController.listPublicServices);

module.exports = router;
