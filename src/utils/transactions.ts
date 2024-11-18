import { PrismaClient } from "@prisma/client";
import { io } from "../socketio";
import HTTPError from "./HTTPError";

export const settlement = async ({
  transactionId,
}: {
  transactionId: string;
}): Promise<void> => {
  const prisma = new PrismaClient();

  const donate = await prisma.donation.findUnique({
    where: {
      id: transactionId,
    },
  });

  if (!donate) {
    throw new HTTPError("Donation not found", 404);
  }

  await prisma.donation.update({
    where: {
      id: transactionId,
    },
    data: {
      is_paid: true,
      updated_at: new Date(),
    },
  });

  io.of("/transactions")
    .to(transactionId)
    .emit("transaction-settlement", `Transaction ID: ${transactionId} success`);
  io.of("/donations")
    .to(donate.user_id)
    .emit("donation", {
      donator: {
        name: donate.donator_name,
      },
      amount: donate.amount,
      currency: donate.currency,
      message: donate.message,
    });
};
