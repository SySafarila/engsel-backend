import Joi from "joi";

export default class ValidateSetting {
  static async minTts(request: { amount: number }): Promise<void> {
    const schema: Joi.ObjectSchema<{ amount: number }> = Joi.object({
      amount: Joi.number().required(),
    });
    const options: Joi.ValidationOptions = {
      abortEarly: false,
    };

    await schema.validateAsync(
      { amount: request.amount } as { amount: number },
      options
    );
  }
}
