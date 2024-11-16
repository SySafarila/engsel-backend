import Joi from "joi";
import { Login } from "../types/Requests";

export const validateLogin = async (request: Login): Promise<void> => {
  const schema: Joi.ObjectSchema<Login> = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });
  const options: Joi.ValidationOptions = {
    abortEarly: false,
  };

  await schema.validateAsync(
    { email: request.email, password: request.password } as Login,
    options
  );
};
