import { Socket } from "socket.io";

const transactions = (socket: Socket) => {
  console.log(`${socket.id} connected on /transactions namespace`);

  socket.on("join", (transactionId: string) => {
    socket.join(transactionId);
    socket.emit("join", `Joined room:${transactionId}`);
  });
};

export default transactions;
