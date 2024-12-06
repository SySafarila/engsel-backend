import Joi from "joi";
import { RoleCreate, RoleUpdate } from "../types/Requests";

export default class ValidateRole {
  static async validateStore(values: RoleCreate) {
    const schema: Joi.ObjectSchema<RoleCreate> = Joi.object({
      name: Joi.string().required(),
      level: Joi.number().required(),
      permissions: Joi.array().items(Joi.string()).required(),
    });
    const options: Joi.ValidationOptions = {
      abortEarly: false,
    };

    await schema.validateAsync(
      {
        name: values.name,
        level: values.level,
        permissions: values.permissions,
      } as RoleCreate,
      options
    );
  }

  static async validateUpdate(values: RoleUpdate) {
    const schema: Joi.ObjectSchema<RoleUpdate> = Joi.object({
      name: Joi.string().required(),
      level: Joi.number().optional(),
      permissions: Joi.array().items(Joi.string()).optional(),
    });
    const options: Joi.ValidationOptions = {
      abortEarly: false,
    };

    await schema.validateAsync(
      {
        name: values.name,
        level: values.level,
        permissions: values.permissions,
      } as RoleUpdate,
      options
    );
  }
}
