import enviroment from "../../loadEnviroment";
import request from "supertest";
import connectToDatabase from "../../database";
import mongoose from "mongoose";
import app from "../app";

beforeAll(async () => {
  await connectToDatabase(enviroment.mongodbUrl);
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("Given a POST /users/login endpoint", () => {
  const userdata = {
    username: "Mars",
    password: "mars",
  };
  describe("When it receives a request with username 'Mars' and password 'mars'", () => {
    test("Then it should respond with a 200 status and return the token", async () => {
      const expectedStatus = 200;

      const response = await request(app)
        .post("/users/login")
        .send(userdata)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("accessToken");
    });
  });
});

describe("Given a GET /users/list endpoint", () => {
  describe("When it receives a request", () => {
    test("Then it should respond with a 200 status", async () => {
      const response = await request(app).get("/users/list");

      expect(response).not.toBeNull();
    });
  });
});
