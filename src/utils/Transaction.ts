import { v7 as UUIDV7 } from "uuid";

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
  readonly provider: string = "MIDTRANS";
  protected paymentMethod: string = "QRIS";

  constructor(values: TransactionParam) {
    super(values);
  }

  charge(paymentMethod: PaymentMethod): void {
    console.log(
      `Charge to ${this.provider} with ${this.paymentMethod} payment method`
    );
    this.paymentMethod = paymentMethod;
    this.qris = "base64 qris";
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
    console.log(
      `Charge to ${this.provider} with ${this.paymentMethod} payment method`
    );
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
    console.log(
      `Charge to ${this.provider} with ${this.paymentMethod} payment method`
    );
    this.paymentMethod = paymentMethod;
    this.virtualAccount = "111122223333";
    this.qris = "base64 qris";
  }
}
