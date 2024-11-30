import winston from "winston";

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: "./storage/logs/errors.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "./storage/logs/any.log",
    }),
  ],
});

export default logger;
