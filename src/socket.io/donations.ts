import { Socket } from "socket.io";

export const onConnection = (socket: Socket) => {
  console.log(`${socket.id} connected on /donations namespace`);

  socket.on("join", (userId: string) => {
    socket.join(userId);
    socket.emit("join", `Joined room:${userId}`);
  });

  socket.on("disconnect", (reason) => {
    console.log(
      `${socket.id} disconnected from /donations namespace. Reason: ${
        reason ?? "-"
      }`
    );
  });
};
