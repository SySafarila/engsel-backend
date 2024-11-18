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
import Locals from "../types/locals";

export const donateCharge = async (req: Request, res: Response) => {
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
      throw new HTTPError("User not found", 404);
    }

    // charge to payment gateway and save to database
    const donator = new Donator(donator_name, donator_email);
    const receiver = new Receiver(username);
    const transaction = new Transaction({
      amount: amount,
      donator: donator,
      receiver: receiver,
      message: message,
      paymentMethod: payment_method,
    });
    await transaction.charge();
    await transaction.save();

    const response: DonateSuccess = {
      message: "success",
      qris: transaction.qris,
      virtual_account: transaction.virtualAccount,
      amount: amount,
      expired_at: transaction.expired_at,
      transaction_id: transaction.transactionId,
    };

    res.status(200).json(response);
  } catch (error: any) {
    const handler = errorHandler(error);

    res.status(handler.code).json({
      message: handler.message,
    } as ErrorResponse);
  }
};

export const getDonations = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  const { user_id } = res.locals as Locals;

  try {
    const donations = await prisma.donation.findMany({
      where: {
        user: {
          id: user_id,
        },
        is_paid: true,
      },
      select: {
        id: true,
        amount: true,
        message: true,
        currency: true,
        donator_name: true,
        donator_email: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    res.status(200).json({
      message: "Success get donations",
      donations: donations,
    });
  } catch (error: any) {
    const handler = errorHandler(error);

    res.status(handler.code).json({
      message: handler.message,
    } as ErrorResponse);
  }
};
