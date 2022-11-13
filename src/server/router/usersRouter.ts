import express from "express";
import {
  userLogin,
  userRegister,
  getUsers,
} from "../controllers/usersController/usersController.js";
import auth from "../middlewares/auth.js";

// eslint-disable-next-line new-cap
const usersRouter = express.Router();

usersRouter.post("/login", userLogin);

usersRouter.post("/register", userRegister);

usersRouter.get("/list", getUsers);

export default usersRouter;
