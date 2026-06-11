const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const routes = require("./routes");
const config = require("./config");
const logger = require("./lib/logger");
const requestLogger = require("./middleware/requestLogger");

const app = express();

require("./db");

const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
  : ["http://localhost:3000", "http://localhost:3001"];

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  cors({
    origin: corsOrigins,
    exposedHeaders: ["X-Session-Id", "X-New-Session", "X-Request-Id"],
  })
);

app.use(requestLogger);
app.use((req, res, next) => {
  if (req.id) {
    res.setHeader("X-Request-Id", req.id);
  }
  next();
});
app.use(express.json({ limit: "1mb" }));

app.get("/proto/api/health", async (req, res) => {
  try {
    const db = require("./db");
    await db.query("SELECT 1");
    res.json({
      status: "healthy",
      environment: config.ENVIRONMENT || "unknown",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    req.log.error({ err: error }, "Health check failed");
    res.status(503).json({
      status: "unhealthy",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

app.use("/proto/api", routes);

app.use((err, req, res, next) => {
  const log = req.log || logger;
  log.error({ err }, "Unhandled request error");

  if (err && typeof err === "object" && err.code) {
    return res.status(err.code).json({
      success: false,
      error: err.error || err.message || "An error occurred",
      message: err.message || err.error || "An error occurred",
    });
  }

  if (typeof err === "string") {
    return res.status(400).json({
      success: false,
      error: err,
      message: err,
    });
  }

  if (err instanceof Error) {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      error: err.message || "Internal server error",
      message: err.message || "Internal server error",
    });
  }

  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: "An unexpected error occurred",
  });
});

module.exports = app;
