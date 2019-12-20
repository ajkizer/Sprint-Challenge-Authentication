const request = require("supertest");
const server = require("../api/server.js");

describe("jokes-router", () => {
  describe("Jokes Route", () => {
    it("responds with 400 if no token", () => {
      return request(server)
        .get("/api/jokes")
        .expect(400);
    });

    it("returns JSON object", () => {
      return request(server)
        .get("/api/jokes")
        .then(res => {
          expect(res.type).toBe("application/json");
        });
    });
  });
});
