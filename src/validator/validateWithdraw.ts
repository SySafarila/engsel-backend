import Joi from "joi";

export const validateWithdraw = async (request: {
  amount: number;
}): Promise<void> => {
  const schema: Joi.ObjectSchema<{ amount: number }> = Joi.object({
    amount: Joi.number().required(),
  });
  const options: Joi.ValidationOptions = {
    abortEarly: false,
  };

  await schema.validateAsync(request, options);
};
