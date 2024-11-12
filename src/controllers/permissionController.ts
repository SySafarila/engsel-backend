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
} from "../types/PermissionType";
import CustomError from "../utils/CustomError";
import errorHandler from "../utils/errorHandler";

export const storePermission = async (req: Request, res: Response) => {
  const { name } = req.body as StoreParams;
  const prisma = new PrismaClient();
  try {
    const schema: Joi.ObjectSchema<StoreParams> = Joi.object({
      name: Joi.string().required(),
    });
    const options: Joi.ValidationOptions = {
      abortEarly: false,
    };

    await schema.validateAsync({ name } as StoreParams, options);
    const check = await prisma.permission.findFirst({
      where: {
        name: name,
      },
    });

    if (check) {
      throw new CustomError("Permission already exists", 400);
    }

    const permission = await prisma.permission.create({
      data: {
        name: name,
      },
    });

    res.json({
      message: "Success",
      data: {
        id: permission.id,
        name: permission.name,
        created_at: permission.created_at,
        updated_at: permission.updated_at,
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

export const updatePermission = async (req: Request, res: Response) => {
  const { name, new_name } = req.body as UpdateParams;
  const prisma = new PrismaClient();
  try {
    const schema: Joi.ObjectSchema<UpdateParams> = Joi.object({
      name: Joi.string().required(),
      new_name: Joi.string().required(),
    });
    const options: Joi.ValidationOptions = {
      abortEarly: false,
    };

    await schema.validateAsync({ name, new_name } as UpdateParams, options);
    const check = await prisma.permission.findFirst({
      where: {
        name: name,
      },
    });

    if (!check) {
      throw new CustomError("Permission not found", 404);
    }

    const permission = await prisma.permission.update({
      where: {
        name: name,
      },
      data: {
        name: new_name,
      },
    });

    res.json({
      message: "Success",
      data: {
        id: permission.id,
        name: permission.name,
        created_at: permission.created_at,
        updated_at: permission.updated_at,
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

export const deletePermission = async (req: Request, res: Response) => {
  const { name } = req.body as DeleteParams;
  const prisma = new PrismaClient();
  try {
    const schema: Joi.ObjectSchema<DeleteParams> = Joi.object({
      name: Joi.string().required(),
    });
    const options: Joi.ValidationOptions = {
      abortEarly: false,
    };

    await schema.validateAsync({ name } as DeleteParams, options);
    const check = await prisma.permission.findFirst({
      where: {
        name: name,
      },
    });

    if (!check) {
      throw new CustomError("Permission not found", 404);
    }

    await prisma.permission.delete({
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

export const readPermission = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  try {
    const permissions = await prisma.permission.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.json({
      message: "Success",
      data: permissions,
    } as ReadResponseSuccess);
    return;
  } catch (error: any) {
    const handler = errorHandler(error);

    res.status(handler.code).json({
      message: handler.message,
    } as ErrorResponse);
  }
};
