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
    const regex = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/; // regex for username, source: https://regexr.com/3cg7r
    // username harus memenuhi ketentuan berikut
    // 1. tidak boleh mengandung dua titik berturut-turut (..)
    // 2. tidak boleh diakhiri dengan titik (.)
    // 3. harus diawali dengan karakter huruf, angka, atau underscore
    // 4. hanya boleh mengandung huruf, angka, titik, atau underscore
    // 5. panjang username maksimal 30 karakter

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
