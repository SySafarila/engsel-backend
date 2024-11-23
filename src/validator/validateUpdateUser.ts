import Joi from "joi";
import { SendDonate } from "../types/Requests";

export const validateUpdateUser = async (request: {
  name: string;
  username: string;
  roles: string[];
}): Promise<void> => {
  const schema: Joi.ObjectSchema<{
    name: string;
    username: string;
    roles: string[];
  }> = Joi.object({
    name: Joi.string().required(),
    username: Joi.string().required(),
    roles: Joi.array().items(Joi.string()),
  });
  const options: Joi.ValidationOptions = {
    abortEarly: false,
  };
  await schema.validateAsync(request, options);
};
