import request from "supertest";
import app from "../src/server";

let transactionQris: string, transactionBcaVa: string;

describe("Donation", () => {
  it("Charge donation to payment gateway", async () => {
    const res = await request(app)
      .post("/donations/SySafarila/donate")
      .accept("application/json")
      .send({
        amount: 10000,
        donator_name: "Syahrul Safarila",
        message: "Hello world!",
        payment_method: "qris",
        donator_email: "sysafarila@gmail.com",
      });

    expect(res.statusCode).toBe(200);
    transactionQris = res.body.transaction_id;

    const res2 = await request(app)
      .post("/donations/SySafarila/donate")
      .accept("application/json")
      .send({
        amount: 10000,
        donator_name: "Syahrul Safarila",
        message: "Hello world!",
        payment_method: "bca-virtual-account",
      });

    expect(res2.statusCode).toBe(200);
    transactionBcaVa = res2.body.transaction_id;
  });

  it("Get detail donation", async () => {
    const res = await request(app)
      .get(`/transactions/${transactionQris}`)
      .send();
    expect(res.statusCode).toBe(200);

    const res2 = await request(app)
      .get(`/transactions/${transactionBcaVa}`)
      .send();
    expect(res2.statusCode).toBe(200);

    const res3 = await request(app).get(`/transactions/xxx`).send();
    expect(res3.statusCode).toBe(400);
  });

  it("Replay donation", async () => {
    let token: string = "";
    const res = await request(app).post("/auth/login").send({
      email: "sysafarila@mail.com",
      password: "password",
    });
    token = res.body.token;

    const res2 = await request(app)
      .post("/donations/replay")
      .set("Authorization", `Bearer ${token}`)
      .send({
        transaction_id: transactionBcaVa,
      });

    expect(res2.statusCode).toBe(200);
  });
});
