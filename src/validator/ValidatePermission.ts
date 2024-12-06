import Joi from "joi";
import { PermissionCreate, PermissionUpdate } from "../types/Requests";

export default class ValidatePermission {
  static async validateStore(values: PermissionCreate) {
    const schema: Joi.ObjectSchema<PermissionCreate> = Joi.object({
      name: Joi.string().required(),
    });
    const options: Joi.ValidationOptions = {
      abortEarly: false,
    };

    await schema.validateAsync(
      { name: values.name } as PermissionCreate,
      options
    );
  }

  static async validateUpdate(values: PermissionUpdate) {
    const schema: Joi.ObjectSchema<PermissionUpdate> = Joi.object({
      name: Joi.string().required(),
    });
    const options: Joi.ValidationOptions = {
      abortEarly: false,
    };

    await schema.validateAsync(
      { name: values.name } as PermissionUpdate,
      options
    );
  }
}
