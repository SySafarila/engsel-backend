import { PrismaClient } from "@prisma/client";
import { io } from "../socketio";
import { DonationSocket } from "../types/Responses";
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

  io.of("/transactions")
    .to(transactionId)
    .emit("transaction-settlement", `Transaction ID: ${transactionId} success`);
  io.of("/donations")
    .to(donate.user_id!)
    .emit("donation", {
      donator_name: donate.donator_name,
      amount: donate.amount,
      currency: donate.currency,
      message: donate.message,
      created_at: donate.created_at.toDateString(),
      updated_at: donate.updated_at.toDateString(),
      id: donate.id,
    } as DonationSocket);
};
