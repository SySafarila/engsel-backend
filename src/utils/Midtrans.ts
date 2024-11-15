import { PrismaClient } from "@prisma/client";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import moment from "moment";
import { MidtransQrisSuccess } from "../types/Responses";
import HTTPError from "./HTTPError";
import {
  PaymentMethod,
  Transaction,
  TransactionInterface,
  TransactionParam,
} from "./Transaction";

export class MidtransTransaction extends Transaction implements TransactionInterface {
  private readonly MIDTRANS_SERVER_KEY: string = btoa(this.getMidtransServerKey());
  private readonly MIDTRANS_ENDPOINT: string = this.getEndpoint();
  readonly provider: string = "MIDTRANS";

  constructor(values: TransactionParam) {
    super(values);
  }

  private getMidtransServerKey(): string {
    if (process.env.MIDTRANS_SERVER_KEY) {
      return process.env.MIDTRANS_SERVER_KEY;
    }
    throw new Error("Server key not set");
  }

  private getEndpoint(): string {
    return process.env.DEV_MODE === "false" ? "https://api.midtrans.com/v2/charge" : "https://api.sandbox.midtrans.com/v2/charge";
  }

  async charge(paymentMethod: PaymentMethod) {
    this.paymentMethod = paymentMethod;

    switch (this.paymentMethod) {
      case "QRIS":
        await this.qrisCharge();
        break;

      default:
        throw new Error("Unsupported payment method");
        break;
    }
    await this.saveToDatabase();
  }

  private getAxiosConfig(): AxiosRequestConfig {
    const axiosConfig: AxiosRequestConfig = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${this.MIDTRANS_SERVER_KEY}`,
      },
    };
    return axiosConfig;
  }

  private async qrisCharge(): Promise<void> {
    try {
      this.paymentMethod = "qris";
      const requestBody = {
        payment_type: "qris",
        transaction_details: {
          order_id: this.transactionId,
          gross_amount: this.grossAmount,
        },
        qris: {
          acquirer: "gopay",
        },
        custom_expiry: {
          unit: "minute",
          expiry_duration: this.experiry_time_in_minutes,
        },
      };

      const res = await axios.post(
        this.MIDTRANS_ENDPOINT,
        JSON.stringify(requestBody),
        this.getAxiosConfig()
      );
      const parser = res.data as MidtransQrisSuccess;

      this.qris = parser.actions[0].url;
      this.expired_at = parseInt(
        moment(parser.transaction_time)
          .add(this.experiry_time_in_minutes, "minutes")
          .format("x")
      );
    } catch (error: any) {
      if (error instanceof AxiosError) {
        throw new HTTPError(
          error.response?.data.status_message ?? error.message,
          error.response?.status ?? 500
        );
      }

      throw new HTTPError("Internal server error", 500);
    }
  }

  private async saveToDatabase() {
    const prisma = new PrismaClient();

    try {
      await prisma.donation.create({
        data: {
          amount: this.grossAmount,
          currency: "IDR",
          donator_name: this.donator.name,
          message: this.message ?? "",
          payment_method: this.paymentMethod!,
          id: this.transactionId,
          user: {
            connect: {
              username: this.receiver.username,
            },
          },
        },
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
