import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { v7 as UUIDV7 } from "uuid";
import {
  PermissionCreate,
  PermissionDelete,
  PermissionUpdate,
} from "../types/Requests";
import {
  ErrorResponse,
  PermissionCreateSuccess,
  PermissionDeleteSuccess,
  PermissionReadSuccess,
} from "../types/Responses";
import HTTPError from "../utils/HTTPError";
import errorHandler from "../utils/errorHandler";
import {
  validateDelete,
  validateStore,
  validateUpdate,
} from "../validator/validatePermission";

export const storePermission = async (req: Request, res: Response) => {
  const { name } = req.body as PermissionCreate;
  const prisma = new PrismaClient();
  try {
    await validateStore({
      name: name,
    });
    const check = await prisma.permission.findFirst({
      where: {
        name: name,
      },
    });

    if (check) {
      throw new HTTPError("Permission already exists", 400);
    }

    const permission = await prisma.permission.create({
      data: {
        id: UUIDV7(),
        name: name,
      },
    });

    const response: PermissionCreateSuccess = {
      message: "Success",
      data: {
        id: permission.id,
        name: permission.name,
        created_at: permission.created_at,
        updated_at: permission.updated_at,
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

export const updatePermission = async (req: Request, res: Response) => {
  const { name, new_name } = req.body as PermissionUpdate;
  const prisma = new PrismaClient();
  try {
    await validateUpdate({
      name: name,
      new_name: new_name,
    });
    const check = await prisma.permission.findFirst({
      where: {
        name: name,
      },
    });

    if (!check) {
      throw new HTTPError("Permission not found", 404);
    }

    const permission = await prisma.permission.update({
      where: {
        name: name,
      },
      data: {
        name: new_name,
      },
    });

    const response: PermissionCreateSuccess = {
      message: "Success",
      data: {
        id: permission.id,
        name: permission.name,
        created_at: permission.created_at,
        updated_at: permission.updated_at,
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

export const deletePermission = async (req: Request, res: Response) => {
  const { name } = req.body as PermissionDelete;
  const prisma = new PrismaClient();
  try {
    await validateDelete({
      name: name,
    });
    const check = await prisma.permission.findFirst({
      where: {
        name: name,
      },
    });

    if (!check) {
      throw new HTTPError("Permission not found", 404);
    }

    await prisma.permission.delete({
      where: {
        name: name,
      },
    });

    res.json({
      message: "Success",
    } as PermissionDeleteSuccess);
    return;
  } catch (error: any) {
    const handler = errorHandler(error);

    res.status(handler.code).json({
      message: handler.message,
    } as ErrorResponse);
  }
};

export const readPermission = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  try {
    const permissions = await prisma.permission.findMany({
      orderBy: {
        name: "asc",
      },
    });

    const response: PermissionReadSuccess = {
      message: "Success",
      data: permissions,
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
