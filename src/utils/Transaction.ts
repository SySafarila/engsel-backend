import { v7 as UUIDV7 } from "uuid";
import { Qris, VirtualAccount } from "../types/Responses";

export type TransactionParam = {
  donator: Donator;
  receiver: Receiver;
  grossAmount: number;
  message: string;
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
  protected message?: string;
  protected paymentMethod?: string;
  protected experiry_time_in_minutes: number = 30;
  qris?: Qris;
  virtualAccount?: VirtualAccount;
  expired_at?: number;

  constructor(values: TransactionParam) {
    this.receiver = values.receiver;
    this.donator = values.donator;
    this.grossAmount = values.grossAmount;
    this.message = values.message;
  }
}
