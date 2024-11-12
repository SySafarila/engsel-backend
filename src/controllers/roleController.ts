import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import Joi from "joi";
import { ErrorResponse } from "../types/ErrorResponseType";
import {
  DeleteParams,
  DeleteResponseSuccess,
  ReadResponseSuccess,
  StoreParams,
  StoreResponseSuccess,
  UpdateParams,
  UpdateResponseSuccess,
} from "../types/RoleType";
import SignedResponseType from "../types/SignedResponseType";
import CustomError from "../utils/CustomError";
import errorHandler from "../utils/errorHandler";

export const storeRole = async (req: Request, res: SignedResponseType) => {
  const { name, level, permissions } = req.body as StoreParams;
  const { role_level_peak } = res.locals;
  const prisma = new PrismaClient();
  try {
    const schema: Joi.ObjectSchema<StoreParams> = Joi.object({
      name: Joi.string().required(),
      level: Joi.number().required(),
      permissions: Joi.array().items(Joi.string()).required(),
    });
    const options: Joi.ValidationOptions = {
      abortEarly: false,
    };

    await schema.validateAsync(
      { name, level, permissions } as StoreParams,
      options
    );

    if (role_level_peak && role_level_peak >= level) {
      throw new CustomError(
        `Your peak role level is ${role_level_peak}, you cannot create role with level that higher than your level. Note: lower is higher (1 > 2)`,
        400
      );
    }

    const check = await prisma.role.findFirst({
      where: {
        name: name,
      },
    });

    if (check) {
      throw new CustomError("Role already exists", 400);
    }

    const validPermissions: { name: string }[] = [];

    const checkValidPermissions = await prisma.permission.findMany({
      where: {
        name: {
          in: permissions,
        },
      },
    });

    checkValidPermissions.forEach((permission) => {
      validPermissions.push({ name: permission.name });
    });

    const role = await prisma.role.create({
      data: {
        name: name,
        level: level,
        permissions: {
          connect: validPermissions,
        },
      },
    });

    res.json({
      message: "Success",
      data: {
        id: role.id,
        name: role.name,
        level: role.level,
        created_at: role.created_at,
        updated_at: role.updated_at,
      },
    } as StoreResponseSuccess);
    return;
  } catch (error: any) {
    const handler = errorHandler(error);

    res.status(handler.code).json({
      message: handler.message,
    } as ErrorResponse);
  }
};

export const updateRole = async (req: Request, res: SignedResponseType) => {
  const { name, new_name, new_level, new_permissions } =
    req.body as UpdateParams;
  const { role_level_peak } = res.locals;
  const prisma = new PrismaClient();
  try {
    const schema: Joi.ObjectSchema<UpdateParams> = Joi.object({
      name: Joi.string().required(),
      new_name: Joi.string().optional().max(255),
      new_level: Joi.number().optional(),
      new_permissions: Joi.array().items(Joi.string()).optional(),
    });
    const options: Joi.ValidationOptions = {
      abortEarly: false,
    };

    await schema.validateAsync(
      { name, new_name, new_level, new_permissions } as UpdateParams,
      options
    );

    const validPermissions: { name: string }[] = [];
    if (new_permissions) {
      const checkValidPermissions = await prisma.permission.findMany({
        where: {
          name: {
            in: new_permissions,
          },
        },
      });

      checkValidPermissions.forEach((permission) => {
        validPermissions.push({ name: permission.name });
      });
    }

    const check = await prisma.role.findFirst({
      where: {
        name: name,
      },
    });

    if (!check) {
      throw new CustomError("Role not found", 404);
    }

    if (role_level_peak && role_level_peak >= check.level) {
      throw new CustomError(
        `Your peak role level is ${role_level_peak}, you cannot update role with level that higher than your level. Note: lower is higher (1 > 2)`,
        400
      );
    }

    if (role_level_peak && new_level && role_level_peak >= new_level) {
      throw new CustomError(
        `Your peak role level is ${role_level_peak}, you cannot update role with level that higher than your level. Note: lower is higher (1 > 2)`,
        400
      );
    }

    const updateRole = await prisma.role.update({
      where: {
        name: name,
      },
      data: {
        name: new_name ?? check.name,
        level: new_level ?? check.level,
      },
    });

    if (new_permissions) {
      const updateRolePermissions = await prisma.role.update({
        where: {
          name: name,
        },
        data: {
          permissions: {
            set: validPermissions,
          },
        },
        select: {
          name: true,
          id: true,
          level: true,
          created_at: true,
          updated_at: true,
          permissions: {
            select: {
              name: true,
            },
          },
        },
      });

      res.json({
        message: "Success",
        data: {
          id: updateRolePermissions.id,
          name: updateRolePermissions.name,
          level: updateRolePermissions.level,
          created_at: updateRolePermissions.created_at,
          updated_at: updateRolePermissions.updated_at,
          permissions: updateRolePermissions.permissions,
        },
      } as UpdateResponseSuccess);
      return;
    }

    res.json({
      message: "Success",
      data: {
        id: updateRole.id,
        name: updateRole.name,
        level: updateRole.level,
        created_at: updateRole.created_at,
        updated_at: updateRole.updated_at,
      },
    } as UpdateResponseSuccess);
    return;
  } catch (error: any) {
    const handler = errorHandler(error);

    res.status(handler.code).json({
      message: handler.message,
    } as ErrorResponse);
  }
};

export const deleteRole = async (req: Request, res: SignedResponseType) => {
  const { name } = req.body as DeleteParams;
  const { role_level_peak } = res.locals;
  const prisma = new PrismaClient();
  try {
    const schema: Joi.ObjectSchema<DeleteParams> = Joi.object({
      name: Joi.string().required(),
    });
    const options: Joi.ValidationOptions = {
      abortEarly: false,
    };

    await schema.validateAsync({ name } as DeleteParams, options);
    const check = await prisma.role.findFirst({
      where: {
        name: name,
      },
    });

    if (!check) {
      throw new CustomError("Role not found", 404);
    }

    if (role_level_peak && role_level_peak >= check.level) {
      throw new CustomError(
        `Your peak role level is ${role_level_peak}, you cannot delete role with level that higher than your level. Note: lower is higher (1 > 2)`,
        400
      );
    }

    await prisma.role.delete({
      where: {
        name: name,
      },
    });

    res.json({
      message: "Success",
    } as DeleteResponseSuccess);
    return;
  } catch (error: any) {
    const handler = errorHandler(error);

    res.status(handler.code).json({
      message: handler.message,
    } as ErrorResponse);
  }
};

export const readRole = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  try {
    const roles = await prisma.role.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        permissions: {
          select: {
            name: true,
          },
        },
      },
    });

    res.json({
      message: "Success",
      data: roles,
    } as ReadResponseSuccess);
    return;
  } catch (error: any) {
    const handler = errorHandler(error);

    res.status(handler.code).json({
      message: handler.message,
    } as ErrorResponse);
  }
};
