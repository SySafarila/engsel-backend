import {
  PaymentMethod,
  Transaction,
  TransactionInterface,
  TransactionParam,
} from "./Transaction";

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
    this.virtualAccount = {
      bank: "bank",
      number: "000011112222",
    };
  }
}
