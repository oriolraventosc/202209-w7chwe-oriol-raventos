import express from "express";
import multer from "multer";
import path from "path";
import { validate } from "express-validation";
import {
  userLogin,
  userRegister,
  getUsers,
} from "../controllers/usersController/usersController.js";
import userRegisterValidation from "../schemas/userRegisterSchema.js";

// eslint-disable-next-line new-cap
const usersRouter = express.Router();

const upload = multer({
  dest: path.join("assets", "images"),
});

usersRouter.post("/login", userLogin);

usersRouter.post(
  "/register",
  upload.single("image"),
  validate(userRegisterValidation),
  userRegister
);

usersRouter.get("/list", getUsers);

export default usersRouter;
