import winston, { format } from "winston";

const { combine, timestamp, printf } = format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${new Date(timestamp).toUTCString()} ${level}: ${message}`;
});

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: "error",
      format: combine(timestamp(), myFormat),
    }),
    new winston.transports.File({
      filename: "./storage/logs/errors.json",
      level: "error",
      format: combine(
        timestamp({
          format() {
            return new Date().toUTCString();
          },
        }),
        format.json()
      ),
    }),
    new winston.transports.File({
      filename: "./storage/logs/any.json",
      format: combine(
        format((info) => {
          if (info.level === "error") {
            return false;
          }
          return info;
        })(),
        timestamp({
          format() {
            return new Date().toUTCString();
          },
        }),
        format.json()
      ),
    }),
  ],
});

export default logger;
