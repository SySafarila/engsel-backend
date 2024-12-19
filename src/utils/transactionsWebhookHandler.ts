import { PrismaClient } from "@prisma/client";
import SocketNotification from "../models/SocketNotification";
import HTTPError from "./HTTPError";

export const settlement = async ({
  transactionId,
  prisma,
}: {
  transactionId: string;
  prisma: PrismaClient;
}): Promise<void> => {
  const donate = await prisma.donation.findUnique({
    where: {
      id: transactionId,
    },
  });

  if (!donate) {
    throw new HTTPError("Donation not found", 404);
  }

  const user = await prisma.user.findUnique({
    where: {
      id: donate.user_id!,
    },
  });

  if (!user) {
    throw new HTTPError("User not found", 404);
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: {
        id: donate.user_id!,
      },
      data: {
        balance: {
          increment: donate.amount,
        },
      },
    });

    await tx.donation.update({
      where: {
        id: transactionId,
      },
      data: {
        is_paid: true,
        updated_at: new Date(),
      },
    });
  });

  SocketNotification.sendDonatorSettlement(transactionId);
  await SocketNotification.sendNotificationToCreator({
    amount: donate.amount,
    currency: donate.currency,
    donatorName: donate.donator_name,
    id: donate.id,
    message: donate.message,
    creatorId: user.id,
  });
};
