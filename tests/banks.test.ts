import request from "supertest";
import app from "../src/server";

let token: string = "";
let bankId: string = "";

describe("Banks executed by Creators", () => {
  it("Get token", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "sysafarila@mail.com",
      password: "password",
    });
    expect(res.statusCode).toBe(200);
    token = res.body.token;
  });

  it("Creator can add bank request and will deleted soon", async () => {
    const res = await request(app)
      .post("/banks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        bank: "BCA",
        number: "12345",
      });
    expect(res.statusCode).toBe(200);
    bankId = res.body.data.id;
  });

  it("Creator can delete bank request", async () => {
    const res = await request(app)
      .delete(`/banks/${bankId}`)
      .set("Authorization", `Bearer ${token}`)
      .send();
    expect(res.statusCode).toBe(200);
  });

  it("Creator can add bank request and will approved by Admin", async () => {
    const res = await request(app)
      .post("/banks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        bank: "BCA",
        number: "12345",
      });
    expect(res.statusCode).toBe(200);
    bankId = res.body.data.id;
  });
});

describe("Banks executed by Admin", () => {
  it("Get token", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "super.admin@admin.com",
      password: "password",
    });
    expect(res.statusCode).toBe(200);
    token = res.body.token;
  });

  it("Admin can accept unverified banks", async () => {
    const res = await request(app)
      .patch(`/admin/banks/${bankId}/accept`)
      .set("Authorization", `Bearer ${token}`)
      .send();
    expect(res.statusCode).toBe(200);
  });
});
