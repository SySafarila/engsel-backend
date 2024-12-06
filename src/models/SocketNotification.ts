import { v7 as UUIDV7 } from "uuid";
import { io } from "../socketio";
import { SendNotificationToCreator } from "../types/Requests";
import { DonationSocket } from "../types/Responses";

export default class SocketNotification {
  static sendNotificationToCreator(data: SendNotificationToCreator) {
    io.of("/donations")
      .to(data.creatorId)
      .emit("donation", {
        donator_name: data.donatorName,
        amount: data.amount,
        currency: data.currency,
        message: data.message,
        id: data.id,
        is_test: false,
        is_replay: false,
      } as DonationSocket);
  }

  static sendDonatorSettlement(transactionId: string) {
    io.of("/transactions")
      .to(transactionId)
      .emit(
        "transaction-settlement",
        `Transaction ID: ${transactionId} success`
      );
  }

  static sendReplayDonation(data: SendNotificationToCreator) {
    io.of("/donations")
      .to(data.creatorId)
      .emit("donation", {
        donator_name: data.donatorName,
        amount: data.amount,
        currency: data.currency,
        message: data.message,
        id: data.id,
        is_replay: true,
        is_test: false,
      } as DonationSocket);
  }

  static sendTestDonation(creatorId: string) {
    io.of("/donations")
      .to(creatorId)
      .emit("donation", {
        donator_name: "Syahrul Safarila",
        amount: 100000,
        currency: "IDR",
        message: "Hello world! ini hanya testing!",
        id: UUIDV7(),
        is_replay: false,
        is_test: true,
      } as DonationSocket);
  }
}
