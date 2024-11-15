import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import doncateController from "./controllers/donateController";
import rootController from "./controllers/rootController";
import { getUserDetail } from "./controllers/userController";
import auth from "./routes/auth";
import permissions from "./routes/permissions";
import roles from "./routes/roles";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.get("/", rootController);
app.use(auth);
app.use(permissions);
app.use(roles);
app.post("/user/:username/donate", doncateController);
app.get("/user/:username", getUserDetail);

export default app;
