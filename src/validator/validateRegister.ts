import Joi from "joi";
import { Register } from "../types/Requests";

const validateRegister = async (values: Register) => {
  const schema: Joi.ObjectSchema<Register> = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().required(),
    username: Joi.string().required(),
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
};

export default validateRegister;
