import axios, { AxiosRequestConfig } from "axios";
import moment from "moment";
import { MidtransBcaVaSuccess, MidtransQrisSuccess } from "../types/Responses";
import HTTPError from "../utils/HTTPError";
import Transaction from "./Transaction";

export default class Midtrans {
  private readonly provider = "Midtrans";
  protected transaction: Transaction;
  protected MIDTRANS_SERVER_KEY: string = btoa(
    this.getMidtransServerKey() + ":"
  );
  protected MIDTRANS_ENDPOINT: string = this.getEndpoint();

  constructor(transaction: Transaction) {
    this.transaction = transaction;
  }

  private getMidtransServerKey(): string {
    if (process.env.MIDTRANS_SERVER_KEY) {
      return process.env.MIDTRANS_SERVER_KEY;
    }
    throw new Error("Server key not set");
  }

  private getEndpoint(): string {
    return process.env.DEV_MODE === "false"
      ? "https://api.midtrans.com/v2/charge"
      : "https://api.sandbox.midtrans.com/v2/charge";
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

  async charge(): Promise<void> {
    console.log(
      `Provider: ${this.provider} trying to charge transaction: ${this.transaction.transactionId}`
    );
    switch (this.transaction.paymentMethod) {
      case "qris":
        await this.chargeQris();
        break;

      case "bca-virtual-account":
        await this.chargeBcaVa();
        break;

      default:
        throw new HTTPError("Unsupported payment method", 500);
        break;
    }
  }

  private async chargeQris() {
    try {
      const requestBody = {
        payment_type: "qris",
        transaction_details: {
          order_id: this.transaction.transactionId,
          gross_amount: this.transaction.amount,
        },
        qris: {
          acquirer: "gopay",
        },
        custom_expiry: {
          unit: "minute",
          expiry_duration: this.transaction.experiry_time_in_minutes,
        },
      };

      const res = await axios.post(
        this.MIDTRANS_ENDPOINT,
        JSON.stringify(requestBody),
        this.getAxiosConfig()
      );
      const parser = res.data as MidtransQrisSuccess;

      this.transaction.qris = parser.actions[0].url;
      this.transaction.expired_at = parseInt(
        moment(parser.transaction_time)
          .add(this.transaction.experiry_time_in_minutes, "minutes")
          .format("x")
      );
      console.log(
        `Provider: ${this.provider} success to charge transaction: ${this.transaction.transactionId}`
      );
    } catch (error) {
      console.log(
        `Provider: ${this.provider} failed to charge transaction: ${this.transaction.transactionId}`
      );

      throw new HTTPError("Midtrans fail", 500);
    }
  }

  private async chargeBcaVa() {
    try {
      const requestBody = {
        payment_type: "bank_transfer",
        transaction_details: {
          order_id: this.transaction.transactionId,
          gross_amount: this.transaction.amount,
        },
        bank_transfer: {
          bank: "bca",
        },
        custom_expiry: {
          unit: "minute",
          expiry_duration: this.transaction.experiry_time_in_minutes,
        },
      };

      const res = await axios.post(
        this.MIDTRANS_ENDPOINT,
        JSON.stringify(requestBody),
        this.getAxiosConfig()
      );
      const parser = res.data as MidtransBcaVaSuccess;

      this.transaction.virtualAccount = {
        bank: parser.va_numbers[0].bank,
        number: parseInt(parser.va_numbers[0].va_number),
      };
      this.transaction.expired_at = parseInt(
        moment(parser.transaction_time)
          .add(this.transaction.experiry_time_in_minutes, "minutes")
          .format("x")
      );
      console.log(
        `Provider: ${this.provider} success to charge transaction: ${this.transaction.transactionId}`
      );
    } catch (error) {
      console.log(
        `Provider: ${this.provider} failed to charge transaction: ${this.transaction.transactionId}`
      );

      throw new HTTPError("Midtrans fail", 500);
    }
  }
}
