import { PrismaClient } from "@prisma/client";
import { v7 as uuid } from "uuid";
import { PaymentMethod } from "../types/Requests";
import { Qris, VirtualAccount } from "../types/Responses";
import HTTPError from "../utils/HTTPError";
import Donator from "./Donator";
import Midtrans from "./Midtrans";
import Receiver from "./Receiver";
import Xendit from "./Xendit";

type TransactionParam = {
  donator: Donator;
  receiver: Receiver;
  message: string;
  amount: number;
  paymentMethod: PaymentMethod;
};

export default class Transaction {
  protected message: string;
  receiver: Receiver;
  donator: Donator;
  amount: number;
  transactionId: string = uuid();
  paymentMethod: PaymentMethod;
  qris?: Qris;
  virtualAccount?: VirtualAccount;
  expired_at?: number;
  experiry_time_in_minutes: number = 30;

  constructor(values: TransactionParam) {
    this.receiver = values.receiver;
    this.donator = values.donator;
    this.message = values.message;
    this.amount = values.amount;
    this.paymentMethod = values.paymentMethod;
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
    const prisma = new PrismaClient();

    try {
      await prisma.donation.create({
        data: {
          amount: this.amount,
          currency: "IDR",
          donator_name: this.donator.name,
          message: this.message ?? "",
          payment_method: this.paymentMethod!,
          id: this.transactionId,
          qris_image: this.qris,
          virtual_account_bank: this.virtualAccount?.bank,
          virtual_account_number: this.virtualAccount?.number,
          expired_at: this.expired_at,
          user: {
            connect: {
              username: this.receiver.username,
            },
          },
        },
      });
      console.log("Saved to database");
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
        allFail = true;
        continue;
      }
    }

    if (allFail == true) {
      console.log("All providers failed to charge");
      throw new HTTPError("All providers failed to charge", 500);
    }
  }
}
