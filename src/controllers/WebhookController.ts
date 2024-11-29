import { PrismaClient } from "@prisma/client";
import { createHash } from "crypto";
import { Request, Response } from "express";
import { validate as validateUUID } from "uuid";
import { MidtransWebhookQrisSettlement } from "../types/Requests";
import { ErrorResponse } from "../types/Responses";
import errorHandler from "../utils/errorHandler";
import HTTPError from "../utils/HTTPError";
import { getMidtransServerKey } from "../utils/midtrans";
import { settlement } from "../utils/transactionsWebhookHandler";

export default class WebhookController {
  static async midtrans(req: Request, res: Response) {
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
          await settlement({ transactionId: transactionId, prisma: prisma });
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
          throw new HTTPError(
            "Midtrans webhook invalid transaction status",
            400
          );
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
  }
}
