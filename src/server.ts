import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rootController from "./controllers/rootController";
import auth from "./routes/auth";
import permissions from "./routes/permissions";
import roles from "./routes/roles";
import transactions from "./routes/transactions";
import users from "./routes/users";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.get("/", rootController);
app.use(auth);
app.use(permissions);
app.use(roles);
app.use(users);
app.use(transactions);

export default app;
