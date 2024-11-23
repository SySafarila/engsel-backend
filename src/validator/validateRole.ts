import Joi from "joi";
import { RoleCreate, RoleUpdate } from "../types/Requests";

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
};

// export const validateDelete = async (values: RoleDelete) => {
//   const schema: Joi.ObjectSchema<RoleDelete> = Joi.object({
//     name: Joi.string().required(),
//   });
//   const options: Joi.ValidationOptions = {
//     abortEarly: false,
//   };

//   await schema.validateAsync({ name: values.name } as RoleDelete, options);
// };
