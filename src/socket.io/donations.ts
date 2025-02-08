import { PrismaClient } from "@prisma/client";
import { Socket } from "socket.io";

export const onConnection = (socket: Socket) => {
  console.log(`${socket.id} connected on /donations namespace`);

  socket.on("join", async (userId: string) => {
    const prisma = new PrismaClient();

    try {
      const user = await prisma.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (user) {
        socket.join(user.id);
        socket.emit("join", `Joined room:${userId}`);
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      socket.disconnect(true);
    }
  });

  socket.on("disconnect", (reason) => {
    console.log(
      `${socket.id} disconnected from /donations namespace. Reason: ${
        reason ?? "-"
      }`
    );
  });
};
