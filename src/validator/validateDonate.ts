import Joi from "joi";
import { SendDonate } from "../types/Requests";

export const validateDonate = async (request: SendDonate): Promise<void> => {
  const schema: Joi.ObjectSchema<SendDonate> = Joi.object({
    amount: Joi.number().required(),
    donator_name: Joi.string().required(),
    message: Joi.string().required(),
    payment_method: Joi.string().required(),
    donator_email: Joi.string().email().optional().allow(null),
  });
  const options: Joi.ValidationOptions = {
    abortEarly: false,
  };

  await schema.validateAsync(request, options);
};
