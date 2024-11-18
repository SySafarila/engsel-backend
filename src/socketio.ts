import { createServer } from "http";
import { Server } from "socket.io";
import app from "./server";
import { onConnection as donationsOnConnection } from "./socket.io/donations";
import { onConnection as transactionsOnConnection } from "./socket.io/transactions";

export const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONT_END_URL,
  },
});

// namespace /transactions
io.of("/transactions").on("connection", transactionsOnConnection);

// namespace /donations
io.of("/donations").on("connection", donationsOnConnection);
