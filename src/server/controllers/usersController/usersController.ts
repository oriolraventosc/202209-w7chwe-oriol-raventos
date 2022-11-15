import enviroment from "../../../loadEnviroment.js";
import type { Request, Response, NextFunction } from "express";
import debugCreator from "debug";
import chalk from "chalk";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import path from "path";
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
  const timeStamp = Date.now();

  await fs.rename(
    path.join("assets", "images", req.file.filename),
    path.join(
      "assets",
      "images",
      req.file.originalname.split(".").join(`${timeStamp}`)
    )
  );

  const itemFilesContent = await fs.readFile(
    path.join("assets", "images", req.file.originalname)
  );

  await bucket.upload(req.file.originalname, itemFilesContent);

  const {
    data: { publicUrl },
  } = bucket.getPublicUrl(req.file.originalname);

  try {
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

    const userToRegister = await User.create({
      username,
      password: hashedPassword,
      email,
      image: req.file.originalname,
      backUpImage: publicUrl,
    });

    res.status(201).json({
      message: `User ${userToRegister.username} created!`,
    });

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

    const accessToken = jwt.sign(tokenPayload, enviroment.jwtSecretKey, {
      expiresIn: "3d",
    });

    res.status(200).json({ accessToken });
  } catch (error: unknown) {
    next(error);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const items = await User.find();
    if (items.length === 0) {
      const customError = new CustomError("No users", 400, "No users");
      next(customError);
      return;
    }

    res.status(200).json(items);
    debug(chalk.greenBright(`Found ${items.length} users`));
  } catch (error: unknown) {
    next(error);
  }
};
