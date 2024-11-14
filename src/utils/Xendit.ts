import {
  PaymentMethod,
  Transaction,
  TransactionInterface,
  TransactionParam,
} from "./Transaction";

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
    this.virtualAccount = {
      bank: "bank",
      number: "000011112222",
    };
    this.qris = "base64 qris";
  }
}
