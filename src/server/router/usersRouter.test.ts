import { MongoMemoryServer } from "mongodb-memory-server";
import { userRegister } from "../controllers/usersController/usersController";
import request from "supertest";
import enviroment from "../../loadEnviroment";
import connectToDatabase from "../../database";
import mongoose from "mongoose";
import app from "../app";
import type { NextFunction, Response, Request } from "express";
import { User } from "../../database/models/user";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectToDatabase(enviroment.mongodbUrl);
});

afterAll(async () => {
  await mongoose.disconnect();
  await server.stop();
});

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

beforeEach(async () => {
  await User.deleteMany();
});
describe("Given a POST /users/login endpoint", () => {
  describe("When it receives a request with username 'Mars' and password 'mars'", () => {
    test("Then it should respond with a 200 status and return the token", async () => {
      const userPendingToRegister = {
        username: "Jacob",
        email: "jacob@gmail.com",
        password: "jacob",
      };

      const req: Partial<Request> = {
        body: userPendingToRegister,
      };
      await userRegister(req as Request, res as Response, next as NextFunction);

      const userdata = {
        username: "Jacob",
        password: "jacob",
      };

      const expectedStatus = 200;

      const response = await request(app)
        .post("/users/login")
        .send(userdata)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("accessToken");
    });
  });

  describe("When it recevies a request with an empty username and password 'mars'", () => {
    test("Then it should respond with a 401 status and a CustomError", async () => {
      const userdata = {
        username: "",
        password: "mars",
      };
      const expectedStatus = 401;

      const response = await request(app)
        .post("/users/login")
        .send(userdata)
        .expect(expectedStatus);

      expect(response.body).toStrictEqual({ error: "Wrong credentials!" });
    });
  });

  describe("When it receives a request with a username 'Mars' and an empty password", () => {
    test("Then it should respond with a 401 status and a CustomError", async () => {
      const userdata = {
        username: "Mars",
        password: "",
      };
      const expectedStatus = 401;

      const response = await request(app)
        .post("/users/login")
        .send(userdata)
        .expect(expectedStatus);

      expect(response.body).toStrictEqual({
        error: "Wrong credentials!",
      });
    });
  });
});

describe("Given a GET /users/register endpoint", () => {
  describe("When it receives a request with username 'Josefa', password 'josefa' and email 'josefa@gmail.com'", () => {
    test("Then it should respond with a 201 status and register the user 'Josefa'", async () => {
      const userData = {
        username: "Josefa",
        password: "josefa",
        email: "josefa@gmail.com",
      };
      const expectedStatus = 201;
      const expectedText = { message: `User ${userData.username} created!` };

      const response = await request(app)
        .post("/users/register")
        .send(userData)
        .expect(expectedStatus);

      expect(response.body).toStrictEqual(expectedText);
    });
  });

  describe("When it receives a request with an empty username, password 'josefa' and email 'josefa@gmail.com'", () => {
    test("Then it should return a respond with a status 401 and a CustomError", async () => {
      const userData = {
        username: "",
        password: "josefa",
        email: "josefa@gmail.com",
      };
      const expectedText = { error: "Missing credentials!" };
      const expectedStatus = 401;

      const response = await request(app)
        .post("/users/register")
        .send(userData)
        .expect(expectedStatus);

      expect(response.body).toStrictEqual(expectedText);
    });
  });

  describe("When it receives a request with a username 'Josefa', an empty password and email 'josefa@gmail.com'", () => {
    test("Then it should return a respond with a status 401 and a CustomError", async () => {
      const userData = {
        username: "Josefa",
        password: "",
        email: "josefa@gmail.com",
      };
      const expectedText = { error: "Missing credentials!" };
      const expectedStatus = 401;

      const response = await request(app)
        .post("/users/register")
        .send(userData)
        .expect(expectedStatus);

      expect(response.body).toStrictEqual(expectedText);
    });
  });

  describe("When it receives a request with a username 'Josefa', password 'josefa' and an empty email", () => {
    test("Then it should return a respond with a status 401 and a CustomError", async () => {
      const userData = {
        username: "Josefa",
        password: "josefa",
        email: "",
      };
      const expectedText = { error: "Missing credentials!" };
      const expectedStatus = 401;

      const response = await request(app)
        .post("/users/register")
        .send(userData)
        .expect(expectedStatus);

      expect(response.body).toStrictEqual(expectedText);
    });
  });
});
