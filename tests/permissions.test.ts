import request from "supertest";
import app from "../src/server";

let token: string = "";

describe("Login by autorized user", () => {
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
});

describe("READ permissions", () => {
  it("Should success", async () => {
    const res = await request(app)
      .get("/admin/permissions")
      .accept("application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  it("Should fail", async () => {
    const res = await request(app)
      .get("/admin/permissions")
      .accept("application/json")
      .set("Authorization", `Bearer ${token}xxx`);

    expect(res.statusCode).toBe(401);
  });
});

describe("CREATE permission", () => {
  it("Should success", async () => {
    const res = await request(app)
      .post("/admin/permissions")
      .accept("application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "permissions-readx",
      });

    expect(res.statusCode).toBe(200);
  });

  it("Should fail", async () => {
    const res = await request(app)
      .post("/admin/permissions")
      .accept("application/json")
      .set("Authorization", `Bearer ${token}x`)
      .send({
        name: "permissions-readx",
      });

    expect(res.statusCode).toBe(401);
  });
});

describe("UPDATE permission", () => {
  it("Should success", async () => {
    const res = await request(app)
      .patch("/admin/permissions/permissions-readx")
      .accept("application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "permission-redx2",
      });

    expect(res.statusCode).toBe(200);
  });

  it("Should fail", async () => {
    const res = await request(app)
      .patch("/admin/permissions/permissions-readx")
      .accept("application/json")
      .set("Authorization", `Bearer ${token}xx`)
      .send({
        name: "permission-redx2",
      });

    expect(res.statusCode).toBe(401);
  });
});

describe("DELETE permission", () => {
  it("Should success", async () => {
    const res = await request(app)
      .delete("/admin/permissions/permission-redx2")
      .accept("application/json")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(res.statusCode).toBe(200);
  });

  it("Should fail", async () => {
    const res = await request(app)
      .delete("/admin/permissions/permission-redx2")
      .accept("application/json")
      .set("Authorization", `Bearer ${token}xxx`)
      .send();

    expect(res.statusCode).toBe(401);
  });
});
