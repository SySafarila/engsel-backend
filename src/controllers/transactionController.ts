import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { createHash } from "node:crypto";
import { validate as validateUUID } from "uuid";
import { io } from "../socketio";
import { MidtransWebhookQrisSettlement } from "../types/Requests";
import { DetailTransaction, ErrorResponse } from "../types/Responses";
import errorHandler from "../utils/errorHandler";
import HTTPError from "../utils/HTTPError";
import { getMidtransServerKey } from "../utils/midtrans";

export const getTransactionDetail = async (req: Request, res: Response) => {
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
};

export const midtransWebhook = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  const { transactionId } = req.params as { transactionId: string };
  const body = req.body as MidtransWebhookQrisSettlement;

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

    const myHash = createHash("sha512")
      .update(
        body.order_id +
          body.status_code +
          body.gross_amount +
          getMidtransServerKey()
      )
      .digest("hex");

    if (myHash !== body.signature_key) {
      throw new HTTPError("Fail to verify signature key", 400);
    }

    switch (body.transaction_status) {
      case "settlement":
        await prisma.donation.updateMany({
          where: {
            id: transactionId,
          },
          data: {
            is_paid: true,
          },
        });
        io.of("/transactions")
          .to(transactionId)
          .emit(
            "transaction-settlement",
            `Transaction ID: ${transactionId} success`
          );
        break;

      case "expire":
        break;

      case "cancel":
        break;

      case "deny":
        break;

      case "pending":
        break;

      case "capture":
        break;

      default:
        throw new HTTPError("Midtrans webhook invalid transaction status", 400);
        break;
    }

    return res.json({
      message: "Transaction updated!",
    });
  } catch (error) {
    const handler = errorHandler(error);

    res.status(handler.code).json({
      message: handler.message,
    } as ErrorResponse);
  }
};
