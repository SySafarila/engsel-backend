import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { v7 as UUIDV7 } from "uuid";
import { PermissionCreate, PermissionUpdate } from "../types/Requests";
import {
  ErrorResponse,
  PermissionCreateSuccess,
  PermissionDeleteSuccess,
  PermissionReadSuccess,
} from "../types/Responses";
import HTTPError from "../utils/HTTPError";
import errorHandler from "../utils/errorHandler";
import ValidatePermission from "../validator/ValidatePermission";

export default class PermissionController {
  static async store(req: Request, res: Response) {
    const { name } = req.body as PermissionCreate;
    const prisma = new PrismaClient();
    try {
      await ValidatePermission.validateStore({
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
  }

  static async update(req: Request, res: Response) {
    const { name } = req.body as PermissionUpdate;
    const params = req.params as { permissionName: string };
    const prisma = new PrismaClient();

    try {
      if (!params.permissionName) {
        throw new HTTPError("Permission name required", 400);
      }

      await ValidatePermission.validateUpdate({
        name: name,
      });
      const check = await prisma.permission.findFirst({
        where: {
          name: params.permissionName,
        },
      });

      if (!check) {
        throw new HTTPError("Permission not found", 404);
      }

      const permission = await prisma.permission.update({
        where: {
          name: params.permissionName,
        },
        data: {
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
  }

  static async delete(req: Request, res: Response) {
    const prisma = new PrismaClient();
    const params = req.params as { permissionName: string };

    try {
      if (!params.permissionName) {
        throw new HTTPError("Permission name required", 400);
      }

      const check = await prisma.permission.findFirst({
        where: {
          name: params.permissionName,
        },
      });

      if (!check) {
        throw new HTTPError("Permission not found", 404);
      }

      await prisma.permission.delete({
        where: {
          name: params.permissionName,
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
  }

  static async read(req: Request, res: Response) {
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
  }
}
