import express from "express";
import {
  userLogin,
  userRegister,
} from "../controllers/usersController/usersController.js";

// eslint-disable-next-line new-cap
const usersRouter = express.Router();

usersRouter.post("/login", userLogin);

usersRouter.post("/register", userRegister);

export default usersRouter;
