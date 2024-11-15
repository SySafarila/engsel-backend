import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import Donator from "../objects/Donator";
import Receiver from "../objects/Receiver";
import Transaction from "../objects/Transaction";
import { SendDonate } from "../types/Requests";
import { DonateSuccess, ErrorResponse } from "../types/Responses";
import errorHandler from "../utils/errorHandler";
import HTTPError from "../utils/HTTPError";
import { validateDonate } from "../validator/validateDonate";

const doncateController = async (req: Request, res: Response) => {
  const { amount, donator_name, message, payment_method, donator_email } =
    req.body as SendDonate;
  const { username } = req.params as { username: string };
  const prisma = new PrismaClient();

  try {
    await validateDonate({
      amount,
      donator_name,
      message,
      payment_method,
      donator_email,
    });

    const checkReceiver = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    if (!checkReceiver) {
      throw new HTTPError("Receiver not found", 404);
    }

    // charge to payment gateway and save to database
    const donator = new Donator(donator_name);
    const receiver = new Receiver(username);
    const transaction = new Transaction(
      donator,
      receiver,
      message,
      amount,
      payment_method
    );
    await transaction.charge();
    await transaction.save();

    const response: DonateSuccess = {
      message: "success",
      qris: transaction.qris,
      virtual_account: transaction.virtualAccount,
      amount: amount,
      expired_at: transaction.expired_at,
    };

    res.status(200).json(response);
  } catch (error: any) {
    const handler = errorHandler(error);

    res.status(handler.code).json({
      message: handler.message,
    } as ErrorResponse);
  }
};

export default doncateController;
