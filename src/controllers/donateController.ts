import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import Joi from "joi";
import { SendDonate } from "../types/Requests";
import { DonateSuccess, ErrorResponse } from "../types/Responses";
import errorHandler from "../utils/errorHandler";
import HTTPError from "../utils/HTTPError";
import { MidtransTransaction } from "../utils/Transaction";

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

    const receiver = await prisma.user.findFirst({
      where: {
        username: receiver_username,
      },
    });

    if (!receiver) {
      throw new HTTPError("Receiver not found", 400);
    }

    // save donation

    // charge to payment gateway
    const paymentGateway = new MidtransTransaction({
      donator: {
        name: donator_name,
      },
      receiver: {
        username: receiver_username,
      },
      grossAmount: amount,
    });
    paymentGateway.charge("QRIS");
    let va: DonateSuccess["virtual_account"] = null;
    if (paymentGateway.virtualAccount) {
      va = {
        bank: "bank",
        number: paymentGateway.virtualAccount,
      };
    }

    // save donation
    await prisma.donation.create({
      data: {
        amount: amount,
        currency: "IDR",
        donator_name: donator_name,
        message: message,
        payment_method: payment_method,
        id: paymentGateway.transactionId,
        user: {
          connect: {
            username: receiver_username,
          },
        },
      },
    });

    res.json({
      message: "success",
      qris: paymentGateway.qris ?? null,
      virtual_account: va,
    } as DonateSuccess);
  } catch (error: any) {
    const handler = errorHandler(error);

    res.status(handler.code).json({
      message: handler.message,
    } as ErrorResponse);
  }
};

export default doncateController;
