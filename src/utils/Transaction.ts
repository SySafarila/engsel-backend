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
  name: string;
  url: string;
  email?: string;
  phone?: string;
  country?: string;

  constructor(name: string, url: string) {
    this.name = name;
    this.url = url;
  }
}

class Transaction {
  protected readonly transactionId: string = UUIDV7();
  protected donator: Donator;
  protected receiver: Receiver;
  protected grossAmount: number;
  protected qris?: string;
  protected virtualAccount?: string;

  constructor(values: TransactionParam) {
    this.receiver = values.receiver;
    this.donator = values.donator;
    this.grossAmount = values.grossAmount;
  }
}

class MidtransTransaction extends Transaction implements TransactionInterface {
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

class TriPayTransaction extends Transaction implements TransactionInterface {
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

class XenditTransaction extends Transaction implements TransactionInterface {
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

const syahrul = new Donator("Syahrul");
const safarila = new Receiver("Safarila", "https://sysafarila.my.id");

const tripay = new TriPayTransaction({
  donator: syahrul,
  receiver: safarila,
  grossAmount: 10000,
});
const xendit = new XenditTransaction({
  donator: syahrul,
  receiver: safarila,
  grossAmount: 10000,
});
const midtrans = new MidtransTransaction({
  donator: syahrul,
  receiver: safarila,
  grossAmount: 10000,
});

xendit.charge("BCA-VA");
midtrans.charge("QRIS");
tripay.charge("QRIS");

console.log(xendit, midtrans, tripay);
