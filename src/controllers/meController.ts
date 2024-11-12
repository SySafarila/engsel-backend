import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { ErrorResponse } from "../types/ErrorResponseType";
import Locals from "../types/locals";
import { CurrentUserResponseSuccess } from "../types/UserType";
import CustomError from "../utils/CustomError";
import errorHandler from "../utils/errorHandler";

const meController = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  const { user_id } = res.locals as Locals;

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: user_id,
      },
    });

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    res.json({
      message: "Success",
      user: {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        verified_at: user?.verified_at,
        updated_at: user?.updated_at,
        created_at: user?.created_at,
      },
    } as CurrentUserResponseSuccess);
  } catch (error: any) {
    const handler = errorHandler(error);

    res.status(handler.code).json({
      message: handler.message,
    } as ErrorResponse);
  }
};

export default meController;
