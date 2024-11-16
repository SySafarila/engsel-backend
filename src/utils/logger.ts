import winston from "winston";

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: "errors.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "any.log",
    }),
  ],
});

export default logger;
