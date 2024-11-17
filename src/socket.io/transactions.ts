import { Socket } from "socket.io";

export const onConnection = (socket: Socket) => {
  console.log(`${socket.id} connected on /transactions namespace`);

  socket.on("join", (transactionId: string) => {
    socket.join(transactionId);
    socket.emit("join", `Joined room:${transactionId}`);
  });

  socket.on("disconnect", (reason) => {
    console.log(
      `${socket.id} disconnected from /transactions namespace. Reason: ${
        reason ?? "-"
      }`
    );
  });
};
