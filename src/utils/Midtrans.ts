import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { MidtransQrisSuccess } from "../types/Responses";
import HTTPError from "./HTTPError";
import {
  PaymentMethod,
  Transaction,
  TransactionInterface,
  TransactionParam,
} from "./Transaction";

export const getMidtransServerKey = (): string => {
  if (process.env.MIDTRANS_SERVER_KEY) {
    return process.env.MIDTRANS_SERVER_KEY;
  }
  throw new Error("Server key not set");
};

export class MidtransTransaction
  extends Transaction
  implements TransactionInterface
{
  private readonly MIDTRANS_SERVER_KEY: string = getMidtransServerKey();
  private readonly MIDTRANS_ENDPOINT: string =
    process.env.DEV_MODE === "false"
      ? "https://api.midtrans.com/v2/charge"
      : "https://api.sandbox.midtrans.com/v2/charge";
  readonly provider: string = "MIDTRANS";
  protected paymentMethod: string = "QRIS";

  constructor(values: TransactionParam) {
    super(values);
  }

  async charge(paymentMethod: PaymentMethod) {
    this.paymentMethod = paymentMethod;

    switch (paymentMethod) {
      case "QRIS":
        await this.qrisCharge();
        break;

      default:
        throw new Error("Unsupported payment method");
        break;
    }
  }

  private async qrisCharge(): Promise<void> {
    try {
      const body = {
        payment_type: "qris",
        transaction_details: {
          order_id: this.transactionId,
          gross_amount: this.grossAmount,
        },
        qris: {
          acquirer: "gopay",
        },
      };

      const axiosConfig: AxiosRequestConfig = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(this.MIDTRANS_SERVER_KEY + ":")}`,
        },
      };

      const res = await axios.post(
        this.MIDTRANS_ENDPOINT,
        JSON.stringify(body),
        axiosConfig
      );
      const parser = res.data as MidtransQrisSuccess;

      this.qris = parser.actions[0].url;
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
}
