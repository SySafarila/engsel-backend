import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { v7 as UUIDV7 } from "uuid";
import { MidtransQrisSuccess } from "../types/Responses";
import HTTPError from "./HTTPError";
import { getMidtransEndpoint, getMidtransServerKey } from "./midtrans";

type TransactionParam = {
  donator: Donator;
  receiver: Receiver;
  grossAmount: number;
};

type PaymentMethod = "QRIS" | "BCA-VA" | "PERMATA-VA";

interface TransactionInterface {
  charge(paymentMethod: PaymentMethod): void;
}

class Donator {
  name: string;
  email?: string;
  phone?: string;
  country?: string;

  constructor(name: string, email?: string) {
    this.name = name;
    this.email = email;
  }
}

class Receiver {
  username: string;
  name?: string;
  url?: string;
  email?: string;
  phone?: string;
  country?: string;

  constructor(username: string) {
    this.username = username;
  }
}

class Transaction {
  readonly transactionId: string = UUIDV7();
  protected donator: Donator;
  protected receiver: Receiver;
  protected grossAmount: number;
  qris?: string;
  virtualAccount?: string;

  constructor(values: TransactionParam) {
    this.receiver = values.receiver;
    this.donator = values.donator;
    this.grossAmount = values.grossAmount;
  }
}

export class MidtransTransaction
  extends Transaction
  implements TransactionInterface
{
  private readonly MIDTRANS_SERVER_KEY: string = getMidtransServerKey();
  private readonly MIDTRANS_ENDPOINT: string = getMidtransEndpoint();
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
          Authorization: `Basic ${btoa(this.MIDTRANS_SERVER_KEY! + ":")}`,
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

export class TriPayTransaction
  extends Transaction
  implements TransactionInterface
{
  readonly provider: string = "TRIPAY";
  protected paymentMethod: string = "QRIS";

  constructor(values: TransactionParam) {
    super(values);
  }

  charge(paymentMethod: PaymentMethod): void {
    this.paymentMethod = paymentMethod;
    this.virtualAccount = "000011112222";
  }
}

export class XenditTransaction
  extends Transaction
  implements TransactionInterface
{
  readonly provider: string = "XENDIT";
  protected paymentMethod: string = "QRIS";

  constructor(values: TransactionParam) {
    super(values);
  }

  charge(paymentMethod: PaymentMethod): void {
    this.paymentMethod = paymentMethod;
    this.virtualAccount = "111122223333";
    this.qris = "base64 qris";
  }
}
