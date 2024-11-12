import Joi from "joi";
import HTTPError from "./HTTPError";
import logger from "./logger";

const errorHandler = (error: any): { code: number; message: string } => {
  let code: number | undefined = undefined;
  let message: string | undefined = undefined;

  if (error instanceof Joi.ValidationError) {
    code = 400;
    message = error.message;
  } else if (error instanceof HTTPError) {
    code = error.code;
    message = error.message;
  } else {
    logger.error(error.message ?? "Internal server error");
  }

  return {
    code: code ?? 500,
    message: message ?? "Internal server error",
  };
};

export default errorHandler;
