import { createServer } from "http";
import { Server, Socket } from "socket.io";
import app from "./server";
import transactions from "./socket.io/transactions";

export const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

// namespace /transactions
io.of("/transactions").on("connection", transactions);

// namespace /donations
io.of("/donations").on("connection", (socket: Socket) => {
  //
});
