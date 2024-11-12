import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import Locals from "../types/locals";
import { ErrorResponse, LogoutSuccess } from "../types/Responses";
import errorHandler from "../utils/errorHandler";
import HTTPError from "../utils/HTTPError";

const logoutController = async (req: Request, res: Response) => {
  const { token_id } = res.locals as Locals;
  const prisma = new PrismaClient();

  try {
    const findToken = await prisma.token.findFirst({
      where: {
        token_id: token_id,
      },
    });

    if (!findToken) {
      throw new HTTPError("Token not found", 404);
    }

    await prisma.token.update({
      where: {
        id: findToken.id,
      },
      data: {
        is_active: false,
      },
    });

    res.json({
      message: "Logout success",
    } as LogoutSuccess);
  } catch (error: any) {
    const handler = errorHandler(error);

    res.status(handler.code).json({
      message: handler.message,
    } as ErrorResponse);
  }
};

export default logoutController;
