import cors from "cors";
import express from "express";
import rootController from "./controllers/rootController";
import UserController from "./controllers/UserController";
import WebhookController from "./controllers/WebhookController";
import auth from "./routes/auth";
import banks from "./routes/banks";
import donations from "./routes/donations";
import permissions from "./routes/permissions";
import roles from "./routes/roles";
import transactions from "./routes/transactions";
import users from "./routes/users";
import withdraws from "./routes/withdraws";
import withdrawAdmin from "./routes/withdrawsAdmin";
import Cors from "./utils/Cors";
import bankAdmin from './routes/banksAdmin'

const app = express();

app.use(
  cors({
    ...Cors.cors(),
    credentials: true,
  })
);
app.use(express.json());

app.get("/", rootController);

// admin
app.use("/admin", permissions);
app.use("/admin", roles);
app.use("/admin", users);
app.use("/admin", withdrawAdmin);
app.use("/admin", bankAdmin);

// public
app.use("/auth", auth);
app.use("/transactions", transactions);
app.use("/donations", donations);
app.use("/withdraws", withdraws);
app.use("/banks", banks);

// users
app.get("/users/:username", UserController.getDetailPublic);

// webhooks
app.post("/webhooks/:transactionId/midtrans", WebhookController.midtrans);

export default app;
