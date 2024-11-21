import axios, { AxiosError, AxiosRequestConfig } from "axios";
import moment from "moment";
import { MidtransBcaVaSuccess, MidtransQrisSuccess } from "../types/Responses";
import HTTPError from "../utils/HTTPError";
import logger from "../utils/logger";
import { getMidtransServerKey } from "../utils/midtrans";
import Transaction from "./Transaction";

type ReqBodyTemplate = {
  transaction_details: {
    order_id: string;
    gross_amount: number;
  };
  custom_expiry: {
    unit: "minute";
    expiry_duration: number;
  };
  customer_details: {
    first_name: string;
    email?: string;
  };
};

export default class Midtrans {
  readonly provider = "MIDTRANS";
  protected transaction: Transaction;
  protected MIDTRANS_SERVER_KEY: string = btoa(getMidtransServerKey() + ":");
  protected MIDTRANS_ENDPOINT: string = this.getEndpoint();

  constructor(transaction: Transaction) {
    this.transaction = transaction;
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
        "X-Append-Notification": `${process.env.BASE_URL}/transactions/${this.transaction.transactionId}/midtrans`,
      },
    };
    return axiosConfig;
  }

  private getReqBodyTemplate(): ReqBodyTemplate {
    return {
      transaction_details: {
        order_id: this.transaction.transactionId,
        gross_amount: this.transaction.amount,
      },
      custom_expiry: {
        unit: "minute",
        expiry_duration: this.transaction.experiry_time_in_minutes,
      },
      customer_details: {
        first_name: this.transaction.donator.name,
        email: this.transaction.donator.email,
      },
    };
  }

  async charge(): Promise<void> {
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
    this.transaction.provider = this.provider;
  }

  private async chargeQris() {
    try {
      const requestBody = {
        ...this.getReqBodyTemplate(),
        payment_type: "qris",
        qris: {
          acquirer: "gopay",
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
    } catch (error) {
      logger.error(
        `${this.provider} failed to charge transaction: ${this.transaction.transactionId}`
      );
      if (error instanceof AxiosError) {
        logger.error(`${this.provider}: ${error.message}`);
      }

      throw new HTTPError("Midtrans fail", 500);
    }
  }

  private async chargeBcaVa() {
    try {
      const requestBody = {
        ...this.getReqBodyTemplate(),
        payment_type: "bank_transfer",
        bank_transfer: {
          bank: "bca",
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
        number: parser.va_numbers[0].va_number,
      };
      this.transaction.expired_at = parseInt(
        moment(parser.transaction_time)
          .add(this.transaction.experiry_time_in_minutes, "minutes")
          .format("x")
      );
    } catch (error) {
      logger.error(
        `${this.provider} failed to charge transaction: ${this.transaction.transactionId}`
      );
      if (error instanceof AxiosError) {
        logger.error(`${this.provider}: ${error.message}`);
      }

      throw new HTTPError("Midtrans fail", 500);
    }
  }
}
