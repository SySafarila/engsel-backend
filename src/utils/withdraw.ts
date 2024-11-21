import { PrismaClient } from "@prisma/client";
import { v7 as UUIDV7 } from "uuid";
import HTTPError from "./HTTPError";

type Params = {
  user_id: string;
  amount: number;
};

export default async function withdraw(values: Params): Promise<void> {
  const prisma = new PrismaClient();

  const user = await prisma.user.findFirst({
    where: {
      id: values.user_id,
    },
  });

  if (!user) {
    throw new HTTPError("User not found", 404);
  }
  if (Number(user.balance) < values.amount) {
    throw new HTTPError(`Request larger than your balance`, 400);
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: {
        id: values.user_id,
      },
      data: {
        balance: {
          decrement: values.amount,
        },
      },
    });

    await tx.withdraw.create({
      data: {
        id: UUIDV7(),
        amount: values.amount,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  });
}
