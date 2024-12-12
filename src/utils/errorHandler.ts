import { AxiosError } from "axios";
import Joi from "joi";
import HTTPError from "./HTTPError";
import logger from "./logger";

const errorHandler = (error: any): { code: number; message: string } => {
  let code: number = 500;
  let message: string = "Internal server error";

  if (error instanceof Joi.ValidationError) {
    code = 400;
    message = error.message;
  } else if (error instanceof HTTPError) {
    code = error.code;
    message = error.message;
    if (code >= 500) {
      logger.error(error.message);
    }
  } else if (error instanceof AxiosError) {
    code = 500;
    message = error.message;
    logger.error(error);
  } else {
    logger.error(error.message ?? "Internal server error");
  }

  return {
    code: code,
    message: message,
  };
};

export default errorHandler;
