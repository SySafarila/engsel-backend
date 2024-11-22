import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { ErrorResponse, UserDetail, Users } from "../types/Responses";
import errorHandler from "../utils/errorHandler";
import HTTPError from "../utils/HTTPError";

export const getUserDetail = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  const { username } = req.params as { username: string };

  try {
    const checkUsername = await prisma.user.findFirst({
      where: {
        username: username,
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
