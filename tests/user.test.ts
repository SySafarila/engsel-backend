import request from "supertest";
import app from "../src/server";

describe("Donation", () => {
  it("Get user detail", async () => {
    const res = await request(app)
      .get("/user/SySafarila")
      .accept("application/json")
      .send();

    expect(res.statusCode).toBe(200);
  });

  it("Get all users data", async () => {
    const res = await request(app)
      .get("/users")
      .accept("application/json")
      .send();

    expect(res.statusCode).toBe(200);
  });
});
