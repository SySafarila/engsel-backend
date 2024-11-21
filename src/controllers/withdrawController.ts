import { Request, Response } from "express";
import Locals from "../types/locals";
import { ErrorResponse } from "../types/Responses";
import errorHandler from "../utils/errorHandler";
import withdraw from "../utils/withdraw";
import { validateWithdraw } from "../validator/validateWithdraw";
import { PrismaClient } from "@prisma/client";

export const withdrawCharge = async (req: Request, res: Response) => {
  const { user_id } = res.locals as Locals;
  const { amount } = req.body as { amount: number };

  try {
    await validateWithdraw({ amount: amount });
    await withdraw({
      amount: amount,
      user_id: user_id,
    });

    res.json({
      message: "success",
    });
  } catch (error) {
    const handler = errorHandler(error);

    res.status(handler.code).json({
      message: handler.message,
    } as ErrorResponse);
  }
};

export const getWithdraw = async (req: Request, res: Response) => {
  const { user_id } = res.locals as Locals;
  const prisma = new PrismaClient();
  const { is_pending, cursor } = req.query as {
    is_pending: string;
    cursor: string;
  };

  try {
    const withdraws = await prisma.withdraw.findMany({
      where: {
        user_id: user_id,
        ...(is_pending == "true" && { is_pending: true }),
        ...(is_pending == "false" && { is_pending: false }),
      },
      orderBy: {
        created_at: "desc",
      },
      select: {
        id: true,
        amount: true,
        created_at: true,
        updated_at: true,
        is_pending: true,
      },
      take: 10,
      ...(cursor && {
        cursor: {
          id: cursor,
        },
      }),
      ...(cursor && { skip: 1 }),
    });

    res.json({
      message: "success",
      withdraws: withdraws,
    });
  } catch (error) {
    const handler = errorHandler(error);

    res.status(handler.code).json({
      message: handler.message,
    } as ErrorResponse);
  }
};
