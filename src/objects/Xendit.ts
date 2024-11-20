import HTTPError from "../utils/HTTPError";
import logger from "../utils/logger";
import Transaction from "./Transaction";

export default class Xendit {
  readonly provider = "XENDIT";
  protected transaction: Transaction;

  constructor(transaction: Transaction) {
    this.transaction = transaction;
  }

  async charge() {
    logger.info(
      `${this.provider} trying to charge transaction: ${this.transaction.transactionId}`
    );
    switch (this.transaction.paymentMethod) {
      case "qris":
        await this.chargeQris();
        break;

      default:
        throw new HTTPError("Unsupported payment method", 500);
        break;
    }
    this.transaction.provider = this.provider;
  }

  private async chargeQris() {
    logger.error(
      `${this.provider} failed to charge transaction: ${this.transaction.transactionId}`
    );
    throw new HTTPError("Xendit fail", 500);
    console.log(
      `Provider: ${this.provider} success to charge transaction: ${this.transaction.transactionId}`
    );
  }

  private async chargeBcaVa() {
    logger.error(
      `${this.provider} failed to charge transaction: ${this.transaction.transactionId}`
    );
    throw new HTTPError("Xendit fail", 500);
    console.log(
      `Provider: ${this.provider} success to charge transaction: ${this.transaction.transactionId}`
    );
  }
}
