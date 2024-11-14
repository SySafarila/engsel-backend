import request from "supertest";
import app from "../src/server";

describe("Donation", () => {
  it("Charge donation to payment gateway", async () => {
    console.log('MIDTRANS_SERVER_KEY', process.env.MIDTRANS_SERVER_KEY);
    
    const res = await request(app)
      .post("/donate")
      .accept("application/json")
      .send({
        amount: 10000,
        donator_name: "Syahrul Safarila",
        message: "Hello world!",
        payment_method: "QRIS",
        receiver_username: "SySafarila",
        donator_email: "sysafarila@gmail.com",
      });

    expect(res.statusCode).toBe(200);

    const res2 = await request(app)
      .post("/donate")
      .accept("application/json")
      .send({
        amount: 10000,
        donator_name: "Syahrul Safarila",
        message: "Hello world!",
        payment_method: "QRIS",
        receiver_username: "SySafarila",
      });

    expect(res2.statusCode).toBe(200);

    const res3 = await request(app)
      .post("/donate")
      .accept("application/json")
      .send({
        amount: 10000,
        donator_name: "Syahrul Safarila",
        message: "Hello world!",
        payment_method: "QRIS",
        receiver_username: "SySafarila",
        donator_email: null,
      });

    expect(res3.statusCode).toBe(200);
  });
});
