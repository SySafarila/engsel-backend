import { createServer } from "http";
import { Server } from "socket.io";
import app from "./server";
import { onConnection as donationsOnConnection } from "./socket.io/donations";
import { onConnection as transactionsOnConnection } from "./socket.io/transactions";
import Cors from "./utils/Cors";

const whitelist = Cors.parseOrigins();
export const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin(requestOrigin, callback) {
      if (!requestOrigin) {
        callback(null);
      } else {
        if (whitelist.includes(requestOrigin)) {
          callback(null, requestOrigin);
        } else {
          callback(
            new Error(`Request from ${requestOrigin} blocked by CORS`),
            requestOrigin
          );
        }
      }
    },
  },
});

// namespace /transactions
io.of("/transactions").on("connection", transactionsOnConnection);

// namespace /donations
io.of("/donations").on("connection", donationsOnConnection);
