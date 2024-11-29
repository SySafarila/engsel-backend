import request from "supertest";
import app from "../src/server";

let token: string = "";
let superAdminToken: string = "";

describe("/auth/Register", () => {
  it("Should success", async () => {
    const res = await request(app)
      .post("/auth/register")
      .accept("application/json")
      .send({
        email: "test@test.com",
        password: "password",
        name: "test",
        username: "test",
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

describe("/auth/login", () => {
  it("Should success", async () => {
    const res2 = await request(app)
      .post("/auth/login")
      .accept("application/json")
      .send({
        email: "admin@admin.com",
        password: "password",
      });

    expect(res2.statusCode).toBe(200);
    token = res2.body.token;
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

describe("/auth/me", () => {
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
      .set("Authorization", `Bearer xxx`);

    expect(res.statusCode).toBe(401);
  });
});

describe("/auth/logout", () => {
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

describe("/auth/me UPDATE USER", () => {
  it("Should success", async () => {
    let token: string = "";
    const res = await request(app)
      .post("/auth/login")
      .accept("application/json")
      .send({
        email: "admin@admin.com",
        password: "password",
      });

    expect(res.statusCode).toBe(200);
    token = res.body.token;

    const res2 = await request(app)
      .patch("/auth/me")
      .accept("application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "testing.update@gmail.com",
        password: "password2",
        name: "name name",
        username: "password2",
      });

    expect(res2.statusCode).toBe(200);
  });
});
