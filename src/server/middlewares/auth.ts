import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import CustomError from "../customError/customError.js";
import environment from "../../loadEnviroment.js";
import type { UserTokenPayload } from "../controllers/types.js";

const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.header("Authorization");

    if (!authorizationHeader) {
      const error = new CustomError(
        "Authorization header missing",
        401,
        "Missing token"
      );

      next(error);
      return;
    }

    if (!authorizationHeader.startsWith("Bearer ")) {
      const error = new CustomError(
        "Missing bearer in Authorization header",
        401,
        "Missing token"
      );

      next(error);
    }

    const token = authorizationHeader.replace(/^Bearer\s*/, "");

    jwt.verify(token, environment.jwtSecretKey) as UserTokenPayload;

    next();
  } catch (error: unknown) {
    const tokenError = new CustomError(
      (error as Error).message,
      401,
      "Invalid token"
    );
    next(tokenError);
  }
};

export default auth;
