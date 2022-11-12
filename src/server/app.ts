import express from "express";
import morgan from "morgan";
import cors from "cors";
import usersRouter from "./router/usersRouter.js";
import { endpointUnknown, generalError } from "./middlewares/error.js";

const app = express();

app.disable("x-powered-by");

app.use(express.json());

app.use(morgan("dev"));

app.use("/users", cors(), usersRouter);

app.use(endpointUnknown);

app.use(generalError);

export default app;
