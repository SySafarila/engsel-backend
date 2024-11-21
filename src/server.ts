import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rootController from "./controllers/rootController";
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
app.use(auth);
app.use(permissions);
app.use(roles);
app.use(users);
app.use(transactions);
app.use(donations);
app.use(withdraws);

export default app;
