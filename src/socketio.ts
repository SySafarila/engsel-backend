import { createServer } from "http";
import { Server } from "socket.io";
import app from "./server";
import { onConnection as donationsOnConnection } from "./socket.io/donations";
import { onConnection as transactionsOnConnection } from "./socket.io/transactions";
import Cors from "./utils/Cors";

// const whitelist = Cors.parseOrigins();
export const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    ...Cors.cors(),
  },
});

// namespace /transactions
io.of("/transactions").on("connection", transactionsOnConnection);

// namespace /donations
io.of("/donations").on("connection", donationsOnConnection);
