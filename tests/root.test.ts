import request from "supertest";
import app from "../src/server";

test("GET /", async () => {
  const res = await request(app).get("/");

  expect(res.statusCode).toBe(200);
});
