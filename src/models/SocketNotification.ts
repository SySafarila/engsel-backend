import { PrismaClient } from "@prisma/client";
import { v7 as UUIDV7 } from "uuid";
import { io } from "../socketio";
import { SendNotificationToCreator } from "../types/Requests";
import { DonationSocket } from "../types/Responses";
import logger from "../utils/logger";
import Tts from "./Tts";

export default class SocketNotification {
  static async getMinAmountForTts(creatorId: string): Promise<number> {
    const prisma = new PrismaClient();

    let minAmountForTts: number = 10000;

    try {
      const minTts = await prisma.setting.findFirst({
        where: {
          user_id: creatorId,
          key: "min-amount-for-tts",
        },
      });
      if (minTts) {
        minAmountForTts = Number(minTts.value);
      }
    } catch (error) {
      logger.error(
        "error when run getMinAmountForTts function from SocketNotification class"
      );
    }

    return minAmountForTts;
  }

  static async generateTts(
    data: SendNotificationToCreator
  ): Promise<[string, string]> {
    const tts = new Tts();
    const opening = await tts.generateTts(
      `${data.donatorName} baru saja memberikan ${data.amount} rupiah`
    );
    const message = await tts.generateTts(data.message);

    return [opening, message];
  }

  static async sendNotificationToCreator(data: SendNotificationToCreator) {
    const minAmountForTts = await SocketNotification.getMinAmountForTts(
      data.creatorId
    );

    let tts: string[] = [];

    if (data.amount >= minAmountForTts) {
      tts = await SocketNotification.generateTts(data);
    }

    io.of("/donations")
      .to(data.creatorId)
      .emit("donation", {
        id: data.id,
        donator_name: data.donatorName,
        amount: data.amount,
        currency: data.currency,
        message: data.message,
        is_test: false,
        is_replay: false,
        is_media_share: false,
        ...(tts.length != 0 ? { is_tts: true } : { is_tts: false }),
        ...(tts.length != 0 && { tts: tts }),
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

  static async sendReplayDonation(data: SendNotificationToCreator) {
    const minAmountForTts = await SocketNotification.getMinAmountForTts(
      data.creatorId
    );

    let tts: string[] = [];

    if (data.amount >= minAmountForTts) {
      tts = await SocketNotification.generateTts(data);
    }

    io.of("/donations")
      .to(data.creatorId)
      .emit("donation", {
        id: data.id,
        donator_name: data.donatorName,
        amount: data.amount,
        currency: data.currency,
        message: data.message,
        is_replay: true,
        is_test: false,
        is_media_share: false,
        ...(tts.length != 0 ? { is_tts: true } : { is_tts: false }),
        ...(tts.length != 0 && { tts: tts }),
      } as DonationSocket);
  }

  static async sendTestDonation(creatorId: string) {
    const minAmountForTts = await SocketNotification.getMinAmountForTts(
      creatorId
    );

    const amount: number = 100000;

    let tts: string[] = [];

    if (amount >= minAmountForTts) {
      tts = await SocketNotification.generateTts({
        amount: amount,
        creatorId: creatorId,
        currency: "IDR",
        donatorName: "Syahrul Safarila",
        id: "xxx-xxx-xxx-testing",
        message: "Hello world! ini hanya testing!",
      });
    }

    io.of("/donations")
      .to(creatorId)
      .emit("donation", {
        id: UUIDV7(),
        donator_name: "Syahrul Safarila",
        amount: amount,
        currency: "IDR",
        message: "Hello world! ini hanya testing!",
        is_replay: false,
        is_test: true,
        is_media_share: false,
        ...(tts.length != 0 ? { is_tts: true } : { is_tts: false }),
        ...(tts.length != 0 && { tts: tts }),
      } as DonationSocket);
  }
}
