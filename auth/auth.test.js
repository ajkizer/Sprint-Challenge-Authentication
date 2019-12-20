const request = require("supertest");
const db = require("../database/dbConfig");
const Users = require("./auth-model");
const server = require("../api/server");
const secrets = require("../config/secrets");
const jwt = require("jsonwebtoken");

describe("auth-router", () => {
  beforeEach(async () => {
    await db("users").truncate();
  });

  //REGISTER ROUTE
  describe("register", () => {
    it("should respond with 201 with valid request", async () => {
      await request(server)
        .post("/api/auth/register")
        .send({ username: "roadDawg69", password: "abcd" })
        .expect(201);
    });
    it("should respond with 400 with invalid request", async () => {
      await request(server)
        .post("/api/auth/register")
        .send({ username: "XoXoAZNprideXoXo" })
        .expect(400);
    });
  });

  //LOGIN ROUTE
  describe("login", () => {
    it("should repsond with 401 on incorrect username", async () => {
      await request(server)
        .post("/api/auth/register")
        .send({ username: "hankhill", password: "ladybird123" });

      return request(server)
        .post("/api/auth/login")
        .send({ username: "bobbyhill", password: "ladybird123" })
        .then(res => {
          expect(res.status).toBe(401);
        });
    });
    it("should respond with 200 on correct password", async () => {
      await request(server)
        .post("/api/auth/register")
        .send({ username: "hankhill", password: "ladybird123" });

      return request(server)
        .post("/api/auth/login")
        .send({ username: "hankhill", password: "ladybird123" })
        .then(res => {
          expect(res.status).toBe(200);
        });
    });
  });
});
