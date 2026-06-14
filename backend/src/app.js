const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const env = require("./config/env");
const apiRoutes = require("./routes");
const notFoundHandler = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

const parsedOrigins = env.corsOrigin
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions =
  parsedOrigins.length === 1 && parsedOrigins[0] === "*"
    ? { origin: true, credentials: true }
    : { origin: parsedOrigins, credentials: true };

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Tracking System Backend API",
  });
});

app.use("/api", apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
