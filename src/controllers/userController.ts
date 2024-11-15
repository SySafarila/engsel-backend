import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { ErrorResponse } from "../types/Responses";
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

    res.json({
      message: `Get user detail by username: ${username}`,
      user: {
        name: checkUsername.name,
        username: checkUsername.username,
      },
    });
  } catch (error: any) {
    const handler = errorHandler(error);

    res.status(handler.code).json({
      message: handler.message,
    } as ErrorResponse);
  }
};
