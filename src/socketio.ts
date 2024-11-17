import { createServer } from "http";
import { Server } from "socket.io";
import app from "./server";
import logger from "./utils/logger";

export const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);

  socket.on("join", (transactionId) => {
    socket.join(transactionId);
    socket.emit("join", `Joined room:${transactionId}`);
    logger.info(`socket ${socket.id} joined room:${transactionId}`);
  });
});
