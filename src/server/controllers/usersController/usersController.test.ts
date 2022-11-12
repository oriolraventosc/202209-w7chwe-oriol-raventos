import enviroment from "../../../loadEnviroment";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mockUser from "../../../mocks/mockUser";
import { userLogin } from "./usersController";
import CustomError from "../../customError/customError";
import { User } from "../../../database/models/user";

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const tokenPayload = {};

const token = jwt.sign(tokenPayload, enviroment.jwtSecretKey);

const next = jest.fn();

describe("Given a userLogin controller", () => {
  describe("When it receives a response", () => {
    test("Then it should call it's method with a status 200", async () => {
      const status = 200;

      const req: Partial<Request> = {
        body: mockUser,
      };

      User.findOne = jest.fn().mockResolvedValue(mockUser);
      jwt.sign = jest.fn().mockReturnValueOnce(token);
      bcrypt.compare = jest.fn().mockReturnValueOnce(true);

      await userLogin(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(status);
    });

    test("Then it should call it's method json with the user token", async () => {
      const req: Partial<Request> = {
        body: mockUser,
      };

      User.findOne = jest.fn().mockResolvedValue(mockUser);
      jwt.sign = jest.fn().mockReturnValueOnce(token);
      bcrypt.compare = jest.fn().mockReturnValueOnce(true);

      await userLogin(req as Request, res as Response, next as NextFunction);

      expect(res.json).toHaveBeenCalledWith({ accessToken: token });
    });
  });

  describe("When it receives a response with an empty body", () => {
    test("Then it should call the next function with a customError", async () => {
      const customError = new CustomError("", 401, "User not found!");
      const req: Partial<Request> = {
        body: {},
      };

      User.findOne = jest.fn().mockRejectedValue(customError);
      await userLogin(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });
});
