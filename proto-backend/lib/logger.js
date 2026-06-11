const pino = require("pino");
const config = require("../config");

const isLocal = config.ENVIRONMENT === "local";

const logger = pino({
  level: process.env.LOG_LEVEL || (isLocal ? "debug" : "info"),
  base: {
    service: "proto-backend",
    environment: config.ENVIRONMENT,
  },
  redact: {
    paths: [
      "req.headers.authorization",
      "password",
      "*.password",
      "token",
      "*.token",
    ],
    censor: "[Redacted]",
  },
  ...(isLocal && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss",
        ignore: "pid,hostname,service,environment",
      },
    },
  }),
});

const createLogger = (moduleName) => logger.child({ module: moduleName });

module.exports = logger;
module.exports.createLogger = createLogger;
