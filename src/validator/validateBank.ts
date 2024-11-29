import Joi from "joi";
import { BankCreate } from "../types/Requests";

export const validateBank = async (request: BankCreate): Promise<void> => {
  const schema: Joi.ObjectSchema<BankCreate> = Joi.object({
    number: Joi.string().required(),
    bank: Joi.string().required(),
  });
  const options: Joi.ValidationOptions = {
    abortEarly: false,
  };

  await schema.validateAsync(request, options);
};
