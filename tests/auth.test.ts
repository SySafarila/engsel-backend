import request from "supertest";
import app from "../src/server";

let token: string = "";

describe("Register a user", () => {
  it("Should success", async () => {
    const res = await request(app)
      .post("/auth/register")
      .accept("application/json")
      .send({
        email: "syahrul@email.com",
        password: "password",
        name: "Syahrul",
      });

    expect(res.statusCode).toBe(200);
  });

  it("Should fail", async () => {
    const res = await request(app)
      .post("/auth/register")
      .accept("application/json")
      .send({
        email: "super.admin@admin.com",
        password: "password",
        name: "Syahrul",
      });

    expect(res.statusCode).toBe(400);
  });
});

describe("User can login", () => {
  it("Should success", async () => {
    const res = await request(app)
      .post("/auth/login")
      .accept("application/json")
      .send({
        email: "super.admin@admin.com",
        password: "password",
      });

    expect(res.statusCode).toBe(200);
    token = res.body.token;
  });

  it("Should fail", async () => {
    const res = await request(app)
      .post("/auth/login")
      .accept("application/json")
      .send({
        email: "super.admin@admin.com",
        password: "passwordxxxx",
      });

    expect(res.statusCode).toBe(401);
  });
});

describe("Get current user", () => {
  it("Should success", async () => {
    const res = await request(app)
      .get("/auth/me")
      .accept("application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  it("Should fail", async () => {
    const res = await request(app)
      .get("/auth/me")
      .accept("application/json")
      .set("Authorization", `Bearer ${token}xxx`);

    expect(res.statusCode).toBe(401);
  });
});

describe("User can logout", () => {
  it("Should success", async () => {
    const res = await request(app)
      .post("/auth/logout")
      .accept("application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  it("Should fail", async () => {
    const res2 = await request(app)
      .get("/auth/me")
      .accept("application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(res2.statusCode).toBe(401);
  });
});
