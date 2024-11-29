import request from "supertest";
import app from "../src/server";

let withdrawId: string = "";
describe("Withdraw executed by creator", () => {
  it("Creator can send withdraw request", async () => {
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
    withdrawId = res2.body.data.withdraw_id;
    expect(res2.statusCode).toBe(200);
  });

  it("Creator can get withdraws data", async () => {
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

describe("Withdraw executed by Admin", () => {
  it("Admin Get Withdraws data and accept withdraw", async () => {
    let token: string = "";
    const res = await request(app).post("/auth/login").send({
      email: "super.admin@admin.com",
      password: "password",
    });
    token = res.body.token;

    const res3 = await request(app)
      .get("/admin/withdraws")
      .set("Authorization", `Bearer ${token}`)
      .send();
    expect(res3.statusCode).toBe(200);

    const res4 = await request(app)
      .patch(`/admin/withdraws/${withdrawId}/accept`)
      .set("Authorization", `Bearer ${token}`)
      .attach("image", "test.jpeg");
    expect(res4.statusCode).toBe(200);

    const res5 = await request(app)
      .patch(`/admin/withdraws/${withdrawId}/accept`)
      .set("Authorization", `Bearer ${token}`)
      .attach("image", "README.md");
    expect(res5.statusCode).toBe(400);
  });
});
