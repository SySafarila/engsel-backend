import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import Locals from "../types/locals";
import { ErrorResponse, UserDetail, Users } from "../types/Responses";
import errorHandler from "../utils/errorHandler";
import HTTPError from "../utils/HTTPError";
import Joi from "joi";
import { validateUpdateUser } from "../validator/validateUpdateUser";

export const getUserDetail = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  const { username } = req.params as { username: string };

  try {
    const checkUsername = await prisma.user.findFirst({
      where: {
        username: username,
      },
      select: {
        id: true,
        name: true,
        username: true,
        balance: true,
        roles: {
          select: {
            level: true,
            name: true,
          },
          orderBy: {
            level: "asc",
          },
        },
      },
    });

    if (!checkUsername) {
      throw new HTTPError("User not found", 404);
    }

    const response: UserDetail = {
      message: `Get user detail by username: ${username}`,
      user: {
        id: checkUsername.id,
        name: checkUsername.name,
        username: checkUsername.username,
        balance: Number(checkUsername.balance),
        roles: checkUsername.roles,
      },
    };

    res.json(response);
  } catch (error: any) {
    const handler = errorHandler(error);

    res.status(handler.code).json({
      message: handler.message,
    } as ErrorResponse);
  }
};

export const getUsers = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        balance: true,
        roles: {
          select: {
            name: true,
            level: true,
          },
          orderBy: {
            level: "asc",
          },
        },
      },
    });

    const response: Users = {
      message: `Get all users`,
      users: users.map((user) => ({
        ...user,
        balance: user.balance.toNumber(),
      })),
    };

    res.json(response);
  } catch (error: any) {
    const handler = errorHandler(error);

    res.status(handler.code).json({
      message: handler.message,
    } as ErrorResponse);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  const { user_id } = res.locals as Locals;
  const { username } = req.params as { username: string };

  try {
    const checkCurrentUser = await prisma.user.findFirst({
      where: {
        id: user_id,
      },
    });

    if (!checkCurrentUser) {
      throw new HTTPError("User not found", 404);
    }

    if (checkCurrentUser.username === username) {
      throw new HTTPError("You cannot delete yourself", 400);
    }

    const checkUsername = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    if (!checkUsername) {
      throw new HTTPError("User not found", 404);
    }

    await prisma.user.delete({
      where: {
        username: username,
      },
    });

    res.json({
      message: `${username} deleted!`,
    });
  } catch (error: any) {
    const handler = errorHandler(error);

    res.status(handler.code).json({
      message: handler.message,
    } as ErrorResponse);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  const { username } = req.params as { username: string };
  const body = req.body as { name: string; username: string; roles: string[] };

  try {
    await validateUpdateUser({
      name: body.name,
      roles: body.roles,
      username: body.username,
    });

    const user = await prisma.user.findFirst({
      where: {
        username: username,
      }
    });

    if (!user) {
      throw new HTTPError("User not found", 404);
    }

    const checkUsername = await prisma.user.findFirst({
      where: {
        username: body.username,
      },
    });

    if (checkUsername && checkUsername.id != user.id) {
      throw new HTTPError("Username already registered", 400);
    }

    const validRoles: { name: string }[] = [];
    const checkRoles = await prisma.role.findMany({
      where: {
        name: {
          in: body.roles,
        },
      },
    });

    checkRoles.forEach((checkRole) => {
      validRoles.push({ name: checkRole.name });
    });

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: body.name,
        username: body.username,
        roles: {
          set: validRoles,
        },
      },
    });

    res.json({
      message: `${username} updated!`,
    });
  } catch (error: any) {
    const handler = errorHandler(error);

    res.status(handler.code).json({
      message: handler.message,
    } as ErrorResponse);
  }
};
