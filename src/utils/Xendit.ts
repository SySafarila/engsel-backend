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
    this.virtualAccount = "111122223333";
    this.qris = "base64 qris";
  }
}
