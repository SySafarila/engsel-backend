import Joi from "joi";
import {
  PermissionCreate,
  PermissionDelete,
  PermissionUpdate,
} from "../types/Requests";

export const validateStore = async (values: PermissionCreate) => {
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
};

export const validateUpdate = async (values: PermissionUpdate) => {
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
};

// export const validateDelete = async (values: PermissionDelete) => {
//   const schema: Joi.ObjectSchema<PermissionDelete> = Joi.object({
//     name: Joi.string().required(),
//   });
//   const options: Joi.ValidationOptions = {
//     abortEarly: false,
//   };

//   await schema.validateAsync(
//     { name: values.name } as PermissionDelete,
//     options
//   );
// };
