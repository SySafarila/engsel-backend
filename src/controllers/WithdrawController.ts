import { Request, Response } from "express";
import path from "path";
import { validate as validateUUID } from "uuid";
import Locals from "../types/locals";
import { ErrorResponse, Withdraw, Withdraws } from "../types/Responses";
import PrismaClient from "../utils/Database";
import errorHandler from "../utils/errorHandler";
import HTTPError from "../utils/HTTPError";
import withdraw from "../utils/withdraw";
import { validateWithdraw } from "../validator/validateWithdraw";

export default class WithdrawController {
  static async charge(req: Request, res: Response) {
    const { user_id } = res.locals as Locals;
    const { amount } = req.body as { amount: number };
    const prisma = PrismaClient;

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
    const prisma = PrismaClient;
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
        withdraws: withdraws.map((withdraw) => ({
          ...withdraw,
          amount: Number(withdraw.amount),
          created_at: withdraw.created_at.toDateString(),
          updated_at: withdraw.updated_at.toDateString(),
        })),
      } as { message: string; withdraws: Withdraws });
    } catch (error) {
      const handler = errorHandler(error);

      res.status(handler.code).json({
        message: handler.message,
      } as ErrorResponse);
    }
  }

  static async adminGet(req: Request, res: Response) {
    const prisma = PrismaClient;
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

  static async adminGetDetail(req: Request, res: Response) {
    const prisma = PrismaClient;
    const { withdrawId } = req.params as { withdrawId: string };

    try {
      const checkId = validateUUID(withdrawId);

      if (!checkId) {
        throw new HTTPError("Invalid withdraw ID", 400);
      }

      const withdraw = await prisma.withdraw.findFirst({
        where: {
          id: withdrawId,
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
      });

      if (!withdraw) {
        throw new HTTPError("Data not found", 404);
      }

      res.json({
        message: "success",
        data: {
          amount: Number(withdraw.amount),
          id: withdraw.id,
          created_at: withdraw.created_at.toDateString(),
          updated_at: withdraw.updated_at.toDateString(),
          is_pending: withdraw.is_pending,
          user: {
            email: withdraw.user.email,
            id: withdraw.user.id,
            name: withdraw.user.name,
            username: withdraw.user.username,
          },
        },
      } as { message: string; data: Withdraw });
    } catch (error) {
      const handler = errorHandler(error);

      res.status(handler.code).json({
        message: handler.message,
      } as ErrorResponse);
    }
  }

  static async adminAccept(req: Request, res: Response) {
    const prisma = PrismaClient;
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
          image: image.filename,
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

  static async getImage(req: Request, res: Response) {
    const prisma = PrismaClient;
    const { withdrawId } = req.params as { withdrawId: string };

    try {
      const checkId = validateUUID(withdrawId);

      if (!checkId) {
        throw new HTTPError("Invalid withdraw ID", 400);
      }

      const withdraw = await prisma.withdraw.findFirst({
        where: {
          id: withdrawId,
          image: {
            not: null,
          },
        },
        select: {
          id: true,
          amount: true,
          created_at: true,
          updated_at: true,
          is_pending: true,
          image: true,
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
            },
          },
        },
      });

      if (!withdraw) {
        throw new HTTPError("Data not found", 404);
      }

      const img = path.join(
        __dirname,
        "..",
        "..",
        "storage",
        "images",
        withdraw.image!
      );

      res.sendFile(img);
    } catch (error) {
      const handler = errorHandler(error);

      res.status(handler.code).json({
        message: handler.message,
      } as ErrorResponse);
    }
  }
}
