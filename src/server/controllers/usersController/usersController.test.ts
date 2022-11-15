import enviroment from "../../../loadEnviroment";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mockUser from "../../../mocks/mockUser";
import { userLogin, userRegister, getUsers } from "./usersController";
import CustomError from "../../customError/customError";
import { User } from "../../../database/models/user";

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const tokenPayload = {};

const token = jwt.sign(tokenPayload, enviroment.jwtSecretKey);

const next = jest.fn();
const req: Partial<Request> = {
  body: mockUser,
};

const imageUrl = `http://localhost/images/08fbcbb6ecbb70bb900d8fc35a184c74.png`;
describe("Given a userRegister controller", () => {
  describe("When it receives a response with paco's credentials", () => {
    test("Then it should call it's method with a status 201", async () => {
      const expectedStatus = 201;

      const hashedPassword = await bcrypt.hash(mockUser.password, 10);
      User.create = jest.fn().mockResolvedValue({
        ...mockUser,
        password: hashedPassword,
      });
      await userRegister(req as Request, res as Response, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("When it receives a response without paco's username", () => {
    test("Then it should it should call it's method next", async () => {
      const customError = new CustomError(
        "Error registering",
        400,
        "Missing credentials"
      );

      const req: Partial<Request> = {
        body: { ...mockUser, username: "", image: imageUrl },
      };

      await userRegister(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });

  describe("When it receives a response without paco's password", () => {
    test("Then it should call it's method next", async () => {
      const customError = new CustomError(
        "Error registering",
        400,
        "Missing credentials"
      );

      const req: Partial<Request> = {
        body: { ...mockUser, password: "", image: imageUrl },
      };

      await userRegister(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });

  describe("When it receives a response without paco's email", () => {
    test("Then it should call it's method next", async () => {
      const customError = new CustomError(
        "Error registering",
        400,
        "Missing credentials"
      );

      const req: Partial<Request> = {
        body: { ...mockUser, email: "" },
      };

      await userRegister(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });
});

describe("Given a userLogin controller", () => {
  describe("When it receives a response", () => {
    test("Then it should call it's method with a status 200 and the token as the json", async () => {
      const status = 201;

      const req: Partial<Request> = {
        body: mockUser,
      };

      User.findOne = jest.fn().mockReturnValue(mockUser.username);
      jwt.sign = jest.fn().mockReturnValueOnce(token);
      bcrypt.compare = jest.fn().mockReturnValueOnce(true);

      await userLogin(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(status);
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

describe("Given a getUsers controller", () => {
  describe("When it receives a response with a empty body", () => {
    test("Then it should respond with a list of users", async () => {
      const status = 200;
      const req: Partial<Request> = {
        body: {},
      };

      User.find = jest.fn().mockReturnValue({});
      await getUsers(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(status);
    });
  });
});
