import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import Cookies from "../types/Cookies";
import Locals from "../types/locals";
import { ErrorResponse } from "../types/Responses";
import HTTPError from "../utils/HTTPError";
import verifyJwt from "../utils/verifyJwt";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const locals = res.locals as Locals;
    const cookies: Cookies = req.cookies;
    const prisma = new PrismaClient();
    const { authorization } = req.headers;
    let jwt = authorization?.split("Bearer ")[1];

    if (cookies.access_token) {
      jwt = cookies.access_token;
    }

    if (!jwt) {
      throw new HTTPError("Token required", 401);
    }

    const { payload } = await verifyJwt(jwt!);
    const { user_id, token_id } = payload;

    const token = await prisma.token.findFirst({
      where: {
        token_id: payload.token_id,
        is_active: true,
      },
    });

    if (!token) {
      throw new HTTPError("Token invalid", 401);
    }

    const rolesAndPermissions = await prisma.user.findFirst({
      where: {
        id: user_id,
      },
      include: {
        roles: {
          select: {
            name: true,
            level: true,
            permissions: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    let role_level_peak: Locals["role_level_peak"];
    const roles: string[] = [];
    const permissions: string[] = [];

    rolesAndPermissions?.roles.forEach((role) => {
      roles.push(role.name);
      if (!role_level_peak) {
        role_level_peak = role.level;
      } else {
        if (role.level < role_level_peak) {
          role_level_peak = role.level;
        }
      }
      role.permissions.forEach((permission) => {
        permissions.push(permission.name);
      });
    });

    locals.jwt = jwt;
    locals.token_id = token_id;
    locals.user_id = user_id;
    locals.permissions = permissions;
    locals.roles = roles;
    locals.role_level_peak = role_level_peak;

    return next();
  } catch (error: any) {
    if (error instanceof HTTPError) {
      res.status(error.code).json({
        message: error.message,
      } as ErrorResponse);
      return;
    }
    res.status(401).json({
      message: error.message ?? "Unauthorized request",
    } as ErrorResponse);
  }
};

export default authMiddleware;
