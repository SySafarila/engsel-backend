import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { deleteBank, getBanks, storeBank } from "./controllers/bankController";
import rootController from "./controllers/rootController";
import { getUserDetailPublic } from "./controllers/userController";
import { midtransWebhook } from "./controllers/webhookController";
import authMiddleware from "./middlewares/authMiddleware";
import auth from "./routes/auth";
import donations from "./routes/donations";
import permissions from "./routes/permissions";
import roles from "./routes/roles";
import transactions from "./routes/transactions";
import users from "./routes/users";
import withdraws from "./routes/withdraws";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONT_END_URL,
    credentials: true,
  })
);

app.get("/", rootController);

// admin
app.use("/admin", permissions);
app.use("/admin", roles);
app.use("/admin", users);

// public
app.use("/auth", auth);
app.use("/transactions", transactions);
app.use("/donations", donations);
app.use("/withdraws", withdraws);

// users
app.get("/users/:username", getUserDetailPublic);

// banks
app.get("/banks", authMiddleware, getBanks);
app.delete("/banks/:bankId", authMiddleware, deleteBank);
app.post("/banks", authMiddleware, storeBank);

// webhooks
app.post("/webhooks/:transactionId/midtrans", midtransWebhook);

export default app;
