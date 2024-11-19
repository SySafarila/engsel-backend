import Joi from "joi";

export const validateReplayDonate = async (request: {
  transaction_id: string;
}): Promise<void> => {
  const schema: Joi.ObjectSchema<{ transaction_id: string }> = Joi.object({
    transaction_id: Joi.string().required(),
  });
  const options: Joi.ValidationOptions = {
    abortEarly: false,
  };

  await schema.validateAsync(request, options);
};
