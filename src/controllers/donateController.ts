import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { v7 as UUIDV7 } from "uuid";
import Donator from "../objects/Donator";
import Receiver from "../objects/Receiver";
import Transaction from "../objects/Transaction";
import { io } from "../socketio";
import Locals from "../types/locals";
import { SendDonate } from "../types/Requests";
import {
  DonateSuccess,
  DonationSocket,
  ErrorResponse,
} from "../types/Responses";
import errorHandler from "../utils/errorHandler";
import HTTPError from "../utils/HTTPError";
import { validateDonate } from "../validator/validateDonate";
import { validateReplayDonate } from "../validator/validateReplayDonate";

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
  const { cursor } = req.query as { cursor: string };

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
        updated_at: "desc",
      },
      take: 10,
      ...(cursor && {
        cursor: {
          id: cursor,
        },
      }),
      ...(cursor && { skip: 1 }),
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

export const replayDonation = async (req: Request, res: Response) => {
  const { user_id } = res.locals as Locals;
  const { transaction_id } = req.body as { transaction_id: string };
  const prisma = new PrismaClient();

  try {
    await validateReplayDonate({
      transaction_id: transaction_id,
    });

    const donation = await prisma.donation.findFirst({
      where: {
        user_id: user_id,
        id: transaction_id,
      },
    });

    if (!donation) {
      throw new HTTPError("Donation not found", 404);
    }

    io.of("/donations")
      .to(donation.user_id!)
      .emit("donation", {
        donator_name: donation.donator_name,
        amount: donation.amount,
        currency: donation.currency,
        message: donation.message,
        created_at: donation.created_at.toDateString(),
        updated_at: donation.updated_at.toDateString(),
        id: donation.id,
      } as DonationSocket);

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

export const testDonation = async (req: Request, res: Response) => {
  const { user_id } = res.locals as Locals;

  try {
    io.of("/donations")
      .to(user_id)
      .emit("donation", {
        donator_name: "Syahrul Safarila",
        amount: 100000,
        currency: "IDR",
        message: "Hello world! ini hanya testing!",
        created_at: new Date().toDateString(),
        updated_at: new Date().toDateString(),
        id: UUIDV7(),
      } as DonationSocket);

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
