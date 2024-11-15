import { v7 as uuid } from "uuid";
import { Qris, VirtualAccount } from "../types/Responses";
import Donator from "./Donator";
import Receiver from "./Receiver";
import { PaymentMethod } from "../types/Requests";

export default class Transaction {
  protected transactionId: string = uuid();
  protected receiver: Receiver;
  protected donator: Donator;
  protected message: string;
  protected amount: number;
  protected paymentMethod: PaymentMethod;
  qris?: Qris;
  virtualAccount?: VirtualAccount;
  expired_at?: number;

  constructor(
    donator: Donator,
    receiver: Receiver,
    message: string,
    amount: number,
    paymentMethod: PaymentMethod
  ) {
    this.receiver = receiver;
    this.donator = donator;
    this.message = message;
    this.amount = amount;
    this.paymentMethod = paymentMethod;
  }

  async charge(): Promise<void> {
    //
  }

  async save(): Promise<void> {
    //
  }
}
