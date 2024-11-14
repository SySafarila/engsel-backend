import { v7 as UUIDV7 } from "uuid";

export type TransactionParam = {
  donator: Donator;
  receiver: Receiver;
  grossAmount: number;
};

export type PaymentMethod = "QRIS" | "BCA-VA" | "PERMATA-VA";

export interface TransactionInterface {
  charge(paymentMethod: PaymentMethod): void;
}

export class Donator {
  name: string;
  email?: string;
  phone?: string;
  country?: string;

  constructor(name: string, email?: string) {
    this.name = name;
    this.email = email;
  }
}

export class Receiver {
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

export class Transaction {
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
