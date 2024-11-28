import { PrismaClient } from "@prisma/client";
import { v7 as uuid } from "uuid";
import { PaymentMethod } from "../types/Requests";
import { Qris, VirtualAccount } from "../types/Responses";
import HTTPError from "../utils/HTTPError";
import logger from "../utils/logger";
import Creator from "./Creator";
import Donator from "./Donator";
import Midtrans from "./Midtrans";
import Xendit from "./Xendit";

type TransactionParam = {
  donator: Donator;
  creator: Creator;
  message: string;
  amount: number;
  paymentMethod: PaymentMethod;
  prisma: PrismaClient;
};

export default class Transaction {
  prisma: PrismaClient;
  message: string;
  creator: Creator;
  donator: Donator;
  amount: number;
  transactionId: string = uuid();
  paymentMethod: PaymentMethod;
  qris?: Qris;
  virtualAccount?: VirtualAccount;
  expired_at?: number;
  experiry_time_in_minutes: number = 30;
  provider?: string;

  constructor(values: TransactionParam) {
    this.creator = values.creator;
    this.donator = values.donator;
    this.message = values.message;
    this.amount = values.amount;
    this.paymentMethod = values.paymentMethod;
    this.prisma = values.prisma;
  }

  async charge(): Promise<void> {
    switch (this.paymentMethod) {
      case "qris":
        await this.chargeByProvider();
        break;

      case "bca-virtual-account":
        await this.chargeByProvider();
        break;

      default:
        throw new HTTPError("Unsupported payment method", 400);
        break;
    }
  }

  async save(): Promise<void> {
    try {
      await this.prisma.donation.create({
        data: {
          amount: this.amount,
          currency: "IDR",
          donator_name: this.donator.name,
          donator_email: this.donator.email,
          message: this.message ?? "",
          payment_method: this.paymentMethod!,
          id: this.transactionId,
          qris_image: this.qris,
          virtual_account_bank: this.virtualAccount?.bank,
          virtual_account_number: this.virtualAccount?.number,
          expired_at: this.expired_at,
          provider: this.provider!,
          user: {
            connect: {
              username: this.creator.username,
            },
          },
        },
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  protected async chargeByProvider(): Promise<void> {
    const providers = [new Midtrans(this), new Xendit(this)];
    let allFail: boolean = false;

    for (let provider of providers) {
      allFail = false;
      try {
        await provider.charge();
        break;
      } catch (error) {
        logger.error(`${provider.provider} fail`);
        allFail = true;
        continue;
      }
    }

    if (allFail == true) {
      throw new HTTPError("All providers failed to charge", 500);
    }
  }
}
