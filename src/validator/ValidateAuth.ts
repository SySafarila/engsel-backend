import Joi from "joi";
import { Login, Register } from "../types/Requests";

export default class ValidateAuth {
  static async login(request: Login): Promise<void> {
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
  }

  static async register(values: Register) {
    const regex = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
    const schema: Joi.ObjectSchema<Register> = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      name: Joi.string().required(),
      username: Joi.string().regex(regex).required(),
    });
    const options: Joi.ValidationOptions = {
      abortEarly: false,
    };

    await schema.validateAsync(
      {
        email: values.email,
        password: values.password,
        name: values.name,
        username: values.username,
      } as Register,
      options
    );
  }
}
