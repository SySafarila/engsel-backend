import request from "supertest";
import app from "../src/server";

describe("Withdraw", () => {
  it("Withdraw success", async () => {
    let token: string = "";
    const res = await request(app).post("/auth/login").send({
      email: "sysafarila@mail.com",
      password: "password",
    });
    token = res.body.token;

    const res2 = await request(app)
      .post("/withdraws")
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 10000,
      });

    expect(res2.statusCode).toBe(200);
  });

  it("Get Withdraw", async () => {
    let token: string = "";
    const res = await request(app).post("/auth/login").send({
      email: "sysafarila@mail.com",
      password: "password",
    });
    token = res.body.token;

    const res2 = await request(app)
      .get("/withdraws")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(res2.statusCode).toBe(200);
  });
});
