import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { validate as validateUUID } from "uuid";
import Locals from "../types/locals";
import { ErrorResponse, Withdraws } from "../types/Responses";
import errorHandler from "../utils/errorHandler";
import HTTPError from "../utils/HTTPError";
import withdraw from "../utils/withdraw";
import { validateWithdraw } from "../validator/validateWithdraw";

export default class WithdrawController {
  static async charge(req: Request, res: Response) {
    const { user_id } = res.locals as Locals;
    const { amount } = req.body as { amount: number };
    const prisma = new PrismaClient();

    try {
      const checkBank = await prisma.bank.findFirst({
        where: {
          user_id: user_id,
          verified_at: {
            not: null,
          },
        },
      });

      if (!checkBank) {
        throw new HTTPError("Tambahkan data bank yang terverifikasi dulu", 400);
      }

      await validateWithdraw({ amount: amount });
      const { withdrawId } = await withdraw({
        amount: amount,
        user_id: user_id,
      });

      res.json({
        message: "success",
        data: {
          withdraw_id: withdrawId,
        },
      });
    } catch (error) {
      const handler = errorHandler(error);

      res.status(handler.code).json({
        message: handler.message,
      } as ErrorResponse);
    }
  }

  static async get(req: Request, res: Response) {
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
  }

  static async adminGet(req: Request, res: Response) {
    const prisma = new PrismaClient();
    const { is_pending, cursor } = req.query as {
      is_pending: string;
      cursor: string;
    };

    try {
      const withdraws = await prisma.withdraw.findMany({
        where: {
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
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
            },
          },
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
        data: withdraws.map((withdraw) => ({
          ...withdraw,
          amount: Number(withdraw.amount),
          created_at: withdraw.created_at.toDateString(),
          updated_at: withdraw.updated_at.toDateString(),
        })),
      } as { message: string; data: Withdraws });
    } catch (error) {
      const handler = errorHandler(error);

      res.status(handler.code).json({
        message: handler.message,
      } as ErrorResponse);
    }
  }

  static async adminAccept(req: Request, res: Response) {
    const prisma = new PrismaClient();
    const { withdrawId } = req.params as { withdrawId: string };

    try {
      const image = req.file;
      if (!image) {
        throw new HTTPError("File required with mimetype image/*", 400);
      }

      const checkId = validateUUID(withdrawId);

      if (!checkId) {
        throw new HTTPError("Invalid withdraw ID", 400);
      }

      const checkWithdraw = await prisma.withdraw.findFirst({
        where: {
          id: withdrawId,
        },
      });

      if (!checkWithdraw) {
        throw new HTTPError("Withdraw not found", 404);
      }

      await prisma.withdraw.update({
        where: {
          id: withdrawId,
        },
        data: {
          is_pending: false,
          image: image.filename
        },
      });

      res.json({
        message: "Success",
      });
    } catch (error) {
      const handler = errorHandler(error);

      res.status(handler.code).json({
        message: handler.message,
      } as ErrorResponse);
    }
  }
}
