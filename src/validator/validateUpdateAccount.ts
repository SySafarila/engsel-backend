import Joi from "joi";
import { UpdateAccount } from "../types/Requests";

export const validateUpdateAccount = async (
  request: UpdateAccount
): Promise<void> => {
  const schema: Joi.ObjectSchema<UpdateAccount> = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).allow(null),
    name: Joi.string().required(),
    username: Joi.string().required(),
  });
  const options: Joi.ValidationOptions = {
    abortEarly: false,
  };

  await schema.validateAsync(
    {
      email: request.email,
      password: request.password,
      name: request.name,
      username: request.username,
    } as UpdateAccount,
    options
  );
};
