import { AxiosError } from "axios";
import Joi from "joi";
import { errors as joseErrors } from "jose";
import HTTPError from "./HTTPError";
import logger from "./logger";

const errorHandler = (error: any): { code: number; message: string } => {
  let code: number = 500;
  let message: string = "Internal server error";

  switch (true) {
    case error instanceof Joi.ValidationError:
      code = 400;
      message = error.message;
      break;

    case error instanceof HTTPError:
      code = error.code;
      message = error.message;
      if (code >= 500) {
        logger.error(error.message);
      }
      break;

    case error instanceof AxiosError:
      code = 500;
      message = error.message;
      logger.error(error);
      break;

    case error instanceof joseErrors.JWTExpired:
      code = 401;
      message = "Token expired";
      break;

    case error instanceof joseErrors.JWTInvalid:
      code = 401;
      message = "Token invalid";
      break;

    case error instanceof joseErrors.JWTClaimValidationFailed:
      code = 401;
      message = error.code;
      break;

    case error instanceof joseErrors.JOSEError:
      code = 401;
      message = error.code;
      break;

    default:
      logger.error(error.message ?? "Internal server error");
      break;
  }

  return {
    code: code,
    message: message,
  };
};

export default errorHandler;
