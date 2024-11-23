import Joi from "joi";
import { UpdateUser } from "../types/Requests";

export const validateUpdateUser = async (
  request: UpdateUser
): Promise<void> => {
  const schema: Joi.ObjectSchema<UpdateUser> = Joi.object({
    name: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    roles: Joi.array().items(Joi.string()),
    balance: Joi.number().required(),
  });
  const options: Joi.ValidationOptions = {
    abortEarly: false,
  };
  await schema.validateAsync(request, options);
};
