import request from "supertest";
import app from "../src/server";

describe("Donation", () => {
  it("Charge donation to payment gateway", async () => {
    const res = await request(app)
      .post("/user/SySafarila/donate")
      .accept("application/json")
      .send({
        amount: 10000,
        donator_name: "Syahrul Safarila",
        message: "Hello world!",
        payment_method: "qris",
        donator_email: "sysafarila@gmail.com",
      });

    expect(res.statusCode).toBe(200);

    const res2 = await request(app)
      .post("/user/SySafarila/donate")
      .accept("application/json")
      .send({
        amount: 10000,
        donator_name: "Syahrul Safarila",
        message: "Hello world!",
        payment_method: "bca-virtual-account",
      });

    expect(res2.statusCode).toBe(200);
  });
});
