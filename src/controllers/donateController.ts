import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import Joi from "joi";
import { SendDonate } from "../types/Requests";
import { DonateSuccess, ErrorResponse } from "../types/Responses";
import errorHandler from "../utils/errorHandler";
import HTTPError from "../utils/HTTPError";
import { MidtransTransaction } from "../utils/Midtrans";
import { Donator, Receiver } from "../utils/Transaction";

const doncateController = async (req: Request, res: Response) => {
  const {
    amount,
    donator_name,
    message,
    payment_method,
    receiver_username,
    donator_email,
  } = req.body as SendDonate;
  const prisma = new PrismaClient();

  try {
    const schema: Joi.ObjectSchema<SendDonate> = Joi.object({
      amount: Joi.number().required(),
      donator_name: Joi.string().required(),
      message: Joi.string().required(),
      payment_method: Joi.string().required(),
      receiver_username: Joi.string().required(),
      donator_email: Joi.string().email().optional().allow(null),
    });
    const options: Joi.ValidationOptions = {
      abortEarly: false,
    };

    await schema.validateAsync(
      {
        amount,
        donator_name,
        message,
        payment_method,
        receiver_username,
        donator_email,
      } as SendDonate,
      options
    );

    const checkReceiver = await prisma.user.findFirst({
      where: {
        username: receiver_username,
      },
    });

    if (!checkReceiver) {
      throw new HTTPError("Receiver not found", 400);
    }

    // charge to payment gateway
    const donator = new Donator(donator_name);
    const receiver = new Receiver(receiver_username);
    const paymentGateway = new MidtransTransaction({
      donator: donator,
      receiver: receiver,
      grossAmount: amount,
      message: message,
    });
    await paymentGateway.charge("QRIS");

    res.json({
      message: "success",
      qris: paymentGateway.qris ?? null,
      virtual_account: paymentGateway.virtualAccount,
    } as DonateSuccess);
  } catch (error: any) {
    const handler = errorHandler(error);

    res.status(handler.code).json({
      message: handler.message,
    } as ErrorResponse);
  }
};

export default doncateController;
