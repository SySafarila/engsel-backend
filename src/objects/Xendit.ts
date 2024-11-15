import HTTPError from "../utils/HTTPError";
import Transaction from "./Transaction";

export default class Xendit {
  private readonly provider = "Xendit";
  protected transaction: Transaction;

  constructor(transaction: Transaction) {
    this.transaction = transaction;
  }

  async charge() {
    console.log(
      `Provider: ${this.provider} trying to charge transaction: ${this.transaction.transactionId}`
    );
    if (this.transaction.paymentMethod == "qris") {
      await this.chargeQris();
    }
  }

  private async chargeQris() {
    console.log(
      `Provider: ${this.provider} failed to charge transaction: ${this.transaction.transactionId}`
    );
    throw new HTTPError("Xendit fail", 500);
    console.log(
      `Provider: ${this.provider} success to charge transaction: ${this.transaction.transactionId}`
    );
  }
}
