import enviroment from "../../loadEnviroment.js";
import chalk from "chalk";
import debugCreator from "debug";
import type { NextFunction, Request, Response } from "express";
import type CustomError from "../customError/customError.js";

const debug = debugCreator(`${enviroment.debug}middlewears`);

export const endpointUnknown = (req: Request, res: Response) => {
  res.status(404).json({ message: "Error not found the endpoint" });
};

export const generalError = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  debug(chalk.red(`Error ${error.message}`));
  const status = error.state ?? 500;
  const message = error.customMessage || "Opps...General Error";

  res.status(status).json({ error: message });
  next();
};
