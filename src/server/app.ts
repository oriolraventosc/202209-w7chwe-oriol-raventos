import express from "express";
import morgan from "morgan";
import cors from "cors";
import usersRouter from "./router/usersRouter.js";

const app = express();

app.disable("x-powered-by");

app.use(express.json());

app.use(morgan("dev"));

app.use("/users", cors(), usersRouter);

export default app;
