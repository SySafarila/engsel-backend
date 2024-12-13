import { AxiosError } from "axios";
import Joi from "joi";
import { errors as joseErrors } from "jose";
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
  } else if (error instanceof joseErrors.JWTExpired) {
    code = 401;
    message = "Token expired";
  } else if (error instanceof joseErrors.JWTInvalid) {
    code = 401;
    message = "Token invalid";
  } else if (error instanceof joseErrors.JWTClaimValidationFailed) {
    code = 401;
    message = error.code;
  } else if (error instanceof joseErrors.JOSEError) {
    code = 401;
    message = error.code;
  } else {
    logger.error(error.message ?? "Internal server error");
  }

  return {
    code: code,
    message: message,
  };
};

export default errorHandler;
