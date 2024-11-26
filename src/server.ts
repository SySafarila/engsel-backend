import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import BankController from "./controllers/BankController";
import rootController from "./controllers/rootController";
import UserController from "./controllers/UserController";
import WebhookController from "./controllers/WebhookController";
import authMiddleware from "./middlewares/authMiddleware";
import auth from "./routes/auth";
import donations from "./routes/donations";
import permissions from "./routes/permissions";
import roles from "./routes/roles";
import transactions from "./routes/transactions";
import users from "./routes/users";
import withdraws from "./routes/withdraws";
import withdrawAdmin from "./routes/withdrawsAdmin";
import Cors from "./utils/Cors";

const app = express();
// const whitelist = Cors.parseOrigins();

app.use(
  cors({
    ...Cors.cors(),
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", rootController);

// admin
app.use("/admin", permissions);
app.use("/admin", roles);
app.use("/admin", users);
app.use("/admin", withdrawAdmin);

// public
app.use("/auth", auth);
app.use("/transactions", transactions);
app.use("/donations", donations);
app.use("/withdraws", withdraws);

// users
app.get("/users/:username", UserController.getDetailPublic);

// banks
app.get("/banks", authMiddleware, BankController.get);
app.delete("/banks/:bankId", authMiddleware, BankController.delete);
app.post("/banks", authMiddleware, BankController.store);

// webhooks
app.post("/webhooks/:transactionId/midtrans", WebhookController.midtrans);

export default app;
