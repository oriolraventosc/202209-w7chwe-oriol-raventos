import enviroment from "../../../loadEnviroment.js";
import type { Request, Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";
import debugCreator from "debug";
import path from "path";
import fs from "fs/promises";
import chalk from "chalk";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { Credentials, UserTokenPayload, RegisterData } from "../types.js";
import CustomError from "../../customError/customError.js";
import { User } from "../../../database/models/user.js";

const supabase = createClient(
  enviroment.supabaseUrl,
  enviroment.supabaseApiKey
);

const bucket = supabase.storage.from(enviroment.supabaseBucketImages);

const debug = debugCreator(`${enviroment.debug}controllers`);

export const userRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password, email } = req.body as RegisterData;
  const itemFilesContent = await fs.readFile(
    path.join("assets", "images", req.file.originalname)
  );
  await bucket.upload(req.file.originalname, itemFilesContent);
  const {
    data: { publicUrl },
  } = bucket.getPublicUrl(req.file.originalname);
  const timeStamp = Date.now();

  const newFilePath = path.join(
    "assets",
    "images",
    req.file.originalname.split(".").join(`${timeStamp}.`)
  );

  try {
    await fs.rename(
      path.join("assets", "images", req.file.filename),
      newFilePath
    );
    if (!username || !password || !email) {
      const customError = new CustomError(
        "Error registering",
        401,
        "Missing credentials!"
      );
      next(customError);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userToRegister = User.create({
      username,
      password: hashedPassword,
      email,
      picture: req.file.filename,
      backUpImage: publicUrl,
    });

    res.status(201).json(userToRegister);
    debug(chalk.greenBright(`User ${username} registered!`));
  } catch (error: unknown) {
    next(error);
  }
};

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body as Credentials;
  try {
    const user = await User.findOne({ username });

    if (!user) {
      const customError = new CustomError(
        "Wrong credentials!",
        401,
        "Wrong credentials!"
      );
      next(customError);
      return;
    }

    if (!(await bcrypt.compare(password, user.password))) {
      const customError = new CustomError(
        "Wrong credentials!",
        401,
        "Wrong credentials!"
      );
      next(customError);
      return;
    }

    const tokenPayload: UserTokenPayload = {
      id: user._id.toString(),
      username,
    };

    const token = jwt.sign(tokenPayload, enviroment.jwtSecretKey, {
      expiresIn: "3d",
    });

    res.status(200).json({ accessToken: token });
  } catch (error: unknown) {
    next(error);
  }
};
