import express from "express";
import path from "path";
import multer from "multer";
import {
  userLogin,
  userRegister,
} from "../controllers/usersController/usersController.js";

// eslint-disable-next-line new-cap
const usersRouter = express.Router();

const upload = multer({
  dest: path.join("assets", "images"),
});

usersRouter.post("/login", userLogin);

usersRouter.post("/register", upload.single("image"), userRegister);

export default usersRouter;
