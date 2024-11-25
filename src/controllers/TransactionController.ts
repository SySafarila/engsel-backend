import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { validate as validateUUID } from "uuid";
import { DetailTransaction, ErrorResponse } from "../types/Responses";
import errorHandler from "../utils/errorHandler";
import HTTPError from "../utils/HTTPError";

export default class TransactionController {
  static async getDetail(req: Request, res: Response) {
    const prisma = new PrismaClient();
    const { transactionId } = req.params as { transactionId: string };

    try {
      const checkUUID = validateUUID(transactionId);
      if (!checkUUID) {
        throw new HTTPError("Invalid Transaction ID", 400);
      }

      const donation = await prisma.donation.findUnique({
        where: {
          id: transactionId,
        },
      });

      if (!donation) {
        throw new HTTPError("Donate not found", 404);
      }

      const response: DetailTransaction = {
        amount: donation.amount,
        message: donation.message,
        transaction_id: donation.id,
        expired_at: Number(donation.expired_at),
        qris: donation.qris_image ? donation.qris_image : undefined,
        virtual_account:
          donation.virtual_account_number && donation.virtual_account_bank
            ? {
                bank: donation.virtual_account_bank,
                number: donation.virtual_account_number,
              }
            : undefined,
        is_paid: donation.is_paid,
      };

      return res.json(response);
    } catch (error) {
      const handler = errorHandler(error);

      res.status(handler.code).json({
        message: handler.message,
      } as ErrorResponse);
    }
  }
}
