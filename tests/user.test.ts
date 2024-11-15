import request from "supertest";
import app from "../src/server";

describe("Donation", () => {
  it("Charge donation to payment gateway", async () => {
    const res = await request(app)
      .get("/user/SySafarila")
      .accept("application/json")
      .send();

    expect(res.statusCode).toBe(200);
  });
});
