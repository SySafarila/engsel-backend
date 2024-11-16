import Joi from "joi";
import { RoleCreate, RoleDelete, RoleUpdate } from "../types/Requests";

export const validateStore = async (values: RoleCreate) => {
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
};

export const validateUpdate = async (values: RoleUpdate) => {
  const schema: Joi.ObjectSchema<RoleUpdate> = Joi.object({
    name: Joi.string().required(),
    new_name: Joi.string().optional().max(255),
    new_level: Joi.number().optional(),
    new_permissions: Joi.array().items(Joi.string()).optional(),
  });
  const options: Joi.ValidationOptions = {
    abortEarly: false,
  };

  await schema.validateAsync(
    {
      name: values.name,
      new_name: values.new_name,
      new_level: values.new_level,
      new_permissions: values.new_permissions,
    } as RoleUpdate,
    options
  );
};

export const validateDelete = async (values: RoleDelete) => {
  const schema: Joi.ObjectSchema<RoleDelete> = Joi.object({
    name: Joi.string().required(),
  });
  const options: Joi.ValidationOptions = {
    abortEarly: false,
  };

  await schema.validateAsync({ name: values.name } as RoleDelete, options);
};
