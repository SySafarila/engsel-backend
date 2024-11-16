import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { v7 as UUIDV7 } from "uuid";
import Locals from "../types/locals";
import { RoleCreate, RoleDelete, RoleUpdate } from "../types/Requests";
import {
  ErrorResponse,
  RoleCreateSuccess,
  RoleDeleteSuccess,
  RoleReadSuccess,
  RoleUpdateSuccess,
} from "../types/Responses";
import errorHandler from "../utils/errorHandler";
import HTTPError from "../utils/HTTPError";
import {
  validateDelete,
  validateStore,
  validateUpdate,
} from "../validator/validateRole";

export const storeRole = async (req: Request, res: Response) => {
  const { name, level, permissions } = req.body as RoleCreate;
  const { role_level_peak } = res.locals as Locals;
  const prisma = new PrismaClient();
  try {
    await validateStore({
      level: level,
      name: name,
      permissions: permissions,
    });

    if (role_level_peak && role_level_peak >= level) {
      throw new HTTPError(
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
      throw new HTTPError("Role already exists", 400);
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
        id: UUIDV7(),
        name: name,
        level: level,
        permissions: {
          connect: validPermissions,
        },
      },
    });

    const response: RoleCreateSuccess = {
      message: "Success",
      data: {
        id: role.id,
        name: role.name,
        level: role.level,
        created_at: role.created_at,
        updated_at: role.updated_at,
      },
    };

    res.json(response);
    return;
  } catch (error: any) {
    const handler = errorHandler(error);

    res.status(handler.code).json({
      message: handler.message,
    } as ErrorResponse);
  }
};

export const updateRole = async (req: Request, res: Response) => {
  const { name, new_name, new_level, new_permissions } = req.body as RoleUpdate;
  const { role_level_peak } = res.locals as Locals;
  const prisma = new PrismaClient();
  try {
    await validateUpdate({
      name: name,
      new_level: new_level,
      new_name: new_name,
      new_permissions: new_permissions,
    });

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
      throw new HTTPError("Role not found", 404);
    }

    if (role_level_peak && role_level_peak >= check.level) {
      throw new HTTPError(
        `Your peak role level is ${role_level_peak}, you cannot update role with level that higher than your level. Note: lower is higher (1 > 2)`,
        400
      );
    }

    if (role_level_peak && new_level && role_level_peak >= new_level) {
      throw new HTTPError(
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

      const response: RoleUpdateSuccess = {
        message: "Success",
        data: {
          id: updateRolePermissions.id,
          name: updateRolePermissions.name,
          level: updateRolePermissions.level,
          created_at: updateRolePermissions.created_at,
          updated_at: updateRolePermissions.updated_at,
          permissions: updateRolePermissions.permissions,
        },
      };

      res.json(response);
      return;
    }

    const response: RoleUpdateSuccess = {
      message: "Success",
      data: {
        id: updateRole.id,
        name: updateRole.name,
        level: updateRole.level,
        created_at: updateRole.created_at,
        updated_at: updateRole.updated_at,
      },
    };

    res.json(response);
    return;
  } catch (error: any) {
    const handler = errorHandler(error);

    res.status(handler.code).json({
      message: handler.message,
    } as ErrorResponse);
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  const { name } = req.body as RoleDelete;
  const { role_level_peak } = res.locals as Locals;
  const prisma = new PrismaClient();
  try {
    await validateDelete({
      name: name,
    });
    const check = await prisma.role.findFirst({
      where: {
        name: name,
      },
    });

    if (!check) {
      throw new HTTPError("Role not found", 404);
    }

    if (role_level_peak && role_level_peak >= check.level) {
      throw new HTTPError(
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
    } as RoleDeleteSuccess);
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
    } as RoleReadSuccess);
    return;
  } catch (error: any) {
    const handler = errorHandler(error);

    res.status(handler.code).json({
      message: handler.message,
    } as ErrorResponse);
  }
};
